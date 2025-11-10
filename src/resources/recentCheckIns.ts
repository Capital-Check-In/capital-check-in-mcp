import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResourceDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Handler for the recent check-ins resource
 * Returns a list of recent capital check-ins
 */
async function handler(uri: URL): Promise<ReadResourceResult> {
  // In a real implementation, this would fetch from a database
  const data = {
    checkIns: [],
    total: 0,
    timestamp: new Date().toISOString(),
  };

  logger.info(`Resource accessed: ${uri}`);

  return {
    contents: [
      {
        uri: uri.toString(),
        mimeType: "application/json",
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Recent check-ins resource definition
 */
export const recentCheckInsResource: ResourceDefinition = {
  name: "Recent Check-ins",
  uri: "capital://check-ins/recent",
  metadata: {
    description: "List of recent capital check-ins",
    mimeType: "application/json",
  },
  handler,
};
