#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { logger } from "./utils/logger.js";
import { registerTools, registerResources } from "./utils/registry.js";

// Import all tools and resources
import { allTools } from "./tools/index.js";
import { allResources } from "./resources/index.js";

/**
 * Capital Check-In MCP Server
 *
 * This server provides tools and resources for managing capital check-ins.
 */

const server = new McpServer({
  name: "capital-check-in-mcp",
  version: "0.1.0",
  capabilities: {
    tools: {},
    resources: {},
  },
});

// Auto-register all tools and resources
registerTools(server, allTools);
registerResources(server, allResources);

// Error handling
server.server.onerror = (error) => {
  logger.error("MCP Server error:", error);
};

process.on("SIGINT", async () => {
  logger.info("Shutting down server...");
  await server.close();
  process.exit(0);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  logger.info("Capital Check-In MCP Server running on stdio");
  logger.info(`Registered ${allTools.length} tools and ${allResources.length} resources`);
}

main().catch((error) => {
  logger.error("Fatal error:", error);
  process.exit(1);
});
