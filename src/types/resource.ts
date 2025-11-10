import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResourceMetadata as SDKResourceMetadata } from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Re-export ResourceMetadata from the SDK for convenience
 */
export type ResourceMetadata = SDKResourceMetadata;

/**
 * Definition for a resource that can be registered with the MCP server
 */
export interface ResourceDefinition {
  /**
   * Human-readable name for the resource
   */
  name: string;

  /**
   * URI or URI template for the resource
   */
  uri: string;

  /**
   * Resource metadata (description, MIME type, etc.)
   */
  metadata: ResourceMetadata;

  /**
   * Handler function that reads the resource
   */
  handler: (uri: URL) => Promise<ReadResourceResult>;
}
