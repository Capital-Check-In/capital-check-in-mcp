/**
 * Resources module
 * Exports all resource definitions as an array for automatic registration
 */

import type { ResourceDefinition } from "../types/index.js";
import { recentCheckInsResource } from "./recentCheckIns.js";

/**
 * Array of all available resources
 * Add new resources to this array to automatically register them
 */
export const allResources: ResourceDefinition[] = [
  recentCheckInsResource,
  // Add more resources here as you create them
];
