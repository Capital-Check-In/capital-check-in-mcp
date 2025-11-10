/**
 * Simple logger utility for MCP server
 * Logs to stderr to avoid interfering with stdio transport
 */

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    console.error(`[INFO] ${message}`, ...args);
  },

  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },

  warn: (message: string, ...args: unknown[]) => {
    console.error(`[WARN] ${message}`, ...args);
  },

  debug: (message: string, ...args: unknown[]) => {
    if (process.env.DEBUG) {
      console.error(`[DEBUG] ${message}`, ...args);
    }
  },
};
