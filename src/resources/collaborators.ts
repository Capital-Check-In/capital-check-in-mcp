import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResourceDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

/**
 * Handler for the collaborators list resource
 * Returns a paginated list of collaborators with optional filtering
 * URI format: capital://collaborators?page=1&per_page=10&status=active&department=Engineering&search=john
 */
async function handler(uri: URL): Promise<ReadResourceResult> {
  // Extract query parameters
  const page = parseInt(uri.searchParams.get("page") || "1", 10);
  const perPage = Math.min(parseInt(uri.searchParams.get("per_page") || "10", 10), 100);
  const status = uri.searchParams.get("status") || undefined;
  const department = uri.searchParams.get("department") || undefined;
  const search = uri.searchParams.get("search") || undefined;

  logger.info(
    `Fetching collaborators - page: ${page}, per_page: ${perPage}, status: ${status}, department: ${department}, search: ${search}`
  );

  // In a real implementation, this would call the API:
  // GET https://api.capitalcheckin.app/v1/collaborators
  // with query parameters and OAuth2 Bearer token authentication

  const data = {
    data: [
      {
        id: "collab_001",
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        position: "Software Engineer",
        department: department || "Engineering",
        status: status || "active",
        role: "developer",
        hire_date: "2023-01-15",
        salary: 75000,
        manager_id: "mgr_001",
        work_schedule: "9:00 AM - 5:00 PM",
        location: "Office A",
        avatar_url: "https://example.com/avatars/john.jpg",
        emergency_contact: {
          name: "Jane Doe",
          phone: "+1234567891",
          relationship: "Spouse",
        },
        created_at: "2023-01-10T10:00:00Z",
        updated_at: "2024-01-10T10:00:00Z",
      },
      {
        id: "collab_002",
        name: "Sarah Smith",
        email: "sarah.smith@example.com",
        phone: "+1234567892",
        position: "Product Manager",
        department: department || "Product",
        status: status || "active",
        role: "manager",
        hire_date: "2022-06-01",
        salary: 85000,
        manager_id: "mgr_002",
        work_schedule: "9:00 AM - 5:00 PM",
        location: "Office B",
        avatar_url: "https://example.com/avatars/sarah.jpg",
        emergency_contact: {
          name: "Bob Smith",
          phone: "+1234567893",
          relationship: "Sibling",
        },
        created_at: "2022-05-25T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ],
    metadata: {
      total: 50,
      page: page,
      per_page: perPage,
      total_pages: Math.ceil(50 / perPage),
      has_next: page < Math.ceil(50 / perPage),
      has_prev: page > 1,
    },
  };

  // Filter data if search is provided (in real implementation, API would handle this)
  if (search) {
    data.data = data.data.filter(
      (collab) =>
        collab.name.toLowerCase().includes(search.toLowerCase()) ||
        collab.email.toLowerCase().includes(search.toLowerCase()) ||
        collab.position.toLowerCase().includes(search.toLowerCase())
    );
  }

  logger.info(
    `Retrieved ${data.data.length} collaborators (page ${page} of ${data.metadata.total_pages})`
  );

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
 * Collaborators list resource definition
 * Retrieves a paginated list of collaborators with optional filtering
 * API Endpoint: GET /v1/collaborators
 * Documentation: https://docs.capitalcheckin.app/api-reference/collaborators/get-collaborators
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - per_page: Items per page (default: 10, max: 100)
 * - status: Filter by status (active, inactive, pending)
 * - department: Filter by department
 * - search: Search in name, email, or position
 */
export const collaboratorsResource: ResourceDefinition = {
  name: "Collaborators List",
  uri: "capital://collaborators",
  metadata: {
    description:
      "Retrieves a paginated list of collaborators. Supports query parameters: page, per_page, status, department, search",
    mimeType: "application/json",
  },
  handler,
};
