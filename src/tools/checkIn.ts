import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ToolDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Input schema for the check_in tool
 */
const inputSchema = {
  location: z.string().describe("Location of the check-in"),
  amount: z.number().positive().describe("Capital amount involved"),
  notes: z.string().optional().describe("Optional notes about the check-in"),
};

/**
 * Handler for the check_in tool
 * Registers a capital check-in event
 */
async function handler(args: Record<string, unknown>): Promise<CallToolResult> {
  // Type assertion after Zod validation
  const { location, amount, notes } = args as {
    location: string;
    amount: number;
    notes?: string;
  };

  // In a real implementation, this would save to a database
  const checkIn = {
    id: Date.now().toString(),
    location,
    amount,
    notes: notes || "",
    timestamp: new Date().toISOString(),
  };

  logger.info(`Check-in registered: ${location} - $${amount}`);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            success: true,
            message: "Check-in registered successfully",
            data: checkIn,
          },
          null,
          2
        ),
      },
    ],
  };
}

/**
 * Check-in tool definition
 */
export const checkInTool: ToolDefinition = {
  name: "check_in",
  description: "Register a capital check-in event",
  inputSchema,
  handler,
};
