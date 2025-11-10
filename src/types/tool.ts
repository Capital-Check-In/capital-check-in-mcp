import type { ZodRawShape } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/**
 * Definition for a tool that can be registered with the MCP server
 */
export interface ToolDefinition<TSchema extends ZodRawShape = ZodRawShape> {
  /**
   * Unique identifier for the tool (e.g., "check_in")
   */
  name: string;

  /**
   * Human-readable description of what the tool does
   */
  description: string;

  /**
   * Zod schema for input validation
   */
  inputSchema: TSchema;

  /**
   * Handler function that executes the tool logic
   * The args parameter will be validated against the inputSchema
   */
  handler: (args: Record<string, unknown>) => Promise<CallToolResult>;
}
