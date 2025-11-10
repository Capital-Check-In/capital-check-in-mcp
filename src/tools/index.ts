/**
 * Tools module
 * Exports all tool definitions as an array for automatic registration
 */

import type { ToolDefinition } from "../types/index.js";
import { checkInTool } from "./checkIn.js";
import { statusTool } from "./status.js";

/**
 * Array of all available tools
 * Add new tools to this array to automatically register them
 */
export const allTools: ToolDefinition[] = [
  checkInTool,
  statusTool,
  // Add more tools here as you create them
];
