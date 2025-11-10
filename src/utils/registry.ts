import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolDefinition, ResourceDefinition } from "../types/index.js";
import { logger } from "./logger.js";

/**
 * Register multiple tools with the MCP server
 * @param server - The MCP server instance
 * @param tools - Array of tool definitions
 */
export function registerTools(server: McpServer, tools: ToolDefinition[]): void {
  for (const tool of tools) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.inputSchema,
      },
      tool.handler
    );
    logger.info(`Registered tool: ${tool.name}`);
  }
}

/**
 * Register multiple resources with the MCP server
 * @param server - The MCP server instance
 * @param resources - Array of resource definitions
 */
export function registerResources(
  server: McpServer,
  resources: ResourceDefinition[]
): void {
  for (const resource of resources) {
    server.registerResource(
      resource.name,
      resource.uri,
      resource.metadata,
      resource.handler
    );
    logger.info(`Registered resource: ${resource.name} (${resource.uri})`);
  }
}
