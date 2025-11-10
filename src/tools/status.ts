import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ToolDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Input schema for the get_status tool
 */
const inputSchema = {
  limit: z
    .number()
    .positive()
    .optional()
    .describe("Number of recent check-ins to retrieve (default: 10)"),
};

/**
 * Handler for the get_status tool
 * Retrieves current capital status and recent check-ins
 */
async function handler(args: Record<string, unknown>): Promise<CallToolResult> {
  // Type assertion after Zod validation
  const { limit } = args as { limit?: number };
  const requestLimit = limit || 10;

  // In a real implementation, this would fetch from a database
  const status = {
    totalCheckIns: 0,
    totalAmount: 0,
    recentCheckIns: [],
    lastUpdated: new Date().toISOString(),
    limit: requestLimit,
  };

  logger.info(`Status requested with limit: ${requestLimit}`);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(status, null, 2),
      },
    ],
  };
}

/**
 * Status tool definition
 */
export const statusTool: ToolDefinition = {
  name: "get_status",
  description: "Get current capital status and recent check-ins",
  inputSchema,
  handler,
};
