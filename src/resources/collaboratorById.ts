import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResourceDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Handler for the collaborator by ID resource
 * Returns detailed information for a specific collaborator
 * URI format: capital://collaborators/{id}
 */
async function handler(uri: URL): Promise<ReadResourceResult> {
  // Extract collaborator ID from URI path
  // Expected format: capital://collaborators/{id}
  const pathParts = uri.pathname.split("/").filter(Boolean);
  const collaboratorId = pathParts[1]; // Get the ID from the path

  if (!collaboratorId) {
    throw new Error("Collaborator ID is required in the URI path");
  }

  logger.info(`Fetching collaborator details for ID: ${collaboratorId}`);

  // In a real implementation, this would call the API:
  // GET https://api.capitalcheckin.app/v1/collaborators/{id}
  // with OAuth2 Bearer token authentication

  const data = {
    id: collaboratorId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    position: "Software Engineer",
    department: "Engineering",
    location: "Office A - Floor 3",
    hire_date: "2023-01-15",
    salary: 75000,
    work_schedule: "9:00 AM - 5:00 PM",
    manager_id: "mgr_001",
    status: "active",
    role: "employee",
    avatar_url: "https://example.com/avatars/john.jpg",
    emergency_contact: {
      name: "Jane Doe",
      phone: "+1234567891",
      relationship: "Spouse",
    },
    created_at: "2023-01-10T10:00:00Z",
    updated_at: "2024-12-20T15:30:00Z",
  };

  logger.info(`Successfully retrieved collaborator: ${data.name} (${collaboratorId})`);

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
 * Collaborator by ID resource definition
 * Retrieves detailed information for a specific collaborator
 * API Endpoint: GET /v1/collaborators/{id}
 * Documentation: https://docs.capitalcheckin.app/api-reference/collaborators/get-collaborator-by-id
 */
export const collaboratorByIdResource: ResourceDefinition = {
  name: "Collaborator Details",
  uri: "capital://collaborators/{id}",
  metadata: {
    description:
      "Retrieves detailed information for a specific collaborator. Replace {id} with the collaborator's unique identifier.",
    mimeType: "application/json",
  },
  handler,
};
