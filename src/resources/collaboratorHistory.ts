import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResourceDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Handler for the collaborator history resource
 * Returns the action history for a specific collaborator
 * URI format: capital://collaborators/{id}/history
 */
async function handler(uri: URL): Promise<ReadResourceResult> {
  // Extract collaborator ID from URI path
  // Expected format: capital://collaborators/{id}/history
  const pathParts = uri.pathname.split("/").filter(Boolean);
  const collaboratorId = pathParts[1]; // Get the ID from the path

  if (!collaboratorId) {
    throw new Error("Collaborator ID is required in the URI path");
  }

  logger.info(`Fetching history for collaborator: ${collaboratorId}`);

  // In a real implementation, this would call the API:
  // GET https://api.capitalcheckin.app/v1/collaborators/{id}/history
  // with OAuth2 Bearer token authentication

  const data = {
    data: [
      {
        id: "hist_example_1",
        action: "check_in",
        description: `Collaborator ${collaboratorId} checked in`,
        timestamp: new Date().toISOString(),
        user_id: "user_example_1",
      },
      {
        id: "hist_example_2",
        action: "profile_update",
        description: `Collaborator ${collaboratorId} profile was updated`,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        user_id: "user_example_2",
      },
    ],
  };

  logger.info(`Retrieved ${data.data.length} history entries for collaborator ${collaboratorId}`);

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
 * Collaborator history resource definition
 * Retrieves action history for a specific collaborator
 * API Endpoint: GET /v1/collaborators/{id}/history
 * Documentation: https://docs.capitalcheckin.app/api-reference/collaborators/get-single-collaborator-history
 */
export const collaboratorHistoryResource: ResourceDefinition = {
  name: "Collaborator History",
  uri: "capital://collaborators/{id}/history",
  metadata: {
    description:
      "Retrieves the action history for a specific collaborator. Replace {id} with the collaborator's unique identifier.",
    mimeType: "application/json",
  },
  handler,
};
