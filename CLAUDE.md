# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a TypeScript-based MCP (Model Context Protocol) server for Capital Check-In. The project uses pnpm as its package manager and is configured for development in a VS Code devcontainer.

## Development Setup

The project uses pnpm with corepack for package management:

```bash
# Enable corepack and install dependencies (done automatically in devcontainer)
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
```

## Build System

TypeScript configuration:
- **Source directory**: `src/`
- **Build output**: `build/`
- **Target**: ES2022
- **Module system**: Node16 with Node16 module resolution
- **Strict mode**: Enabled

Build commands:
```bash
pnpm build          # Compile TypeScript to build/
pnpm dev            # Development mode with watch
pnpm lint           # Run ESLint
pnpm format         # Format code with Prettier
pnpm format:check   # Check code formatting
pnpm inspector      # Test with MCP Inspector (recommended for development)
pnpm test:mcp       # Alias for inspector
```

## Code Standards

The project uses:
- **ESLint** for linting
- **Prettier** for formatting (runs on save in VS Code)
- **TypeScript strict mode** with full type safety

All code should be formatted with Prettier and pass ESLint checks before committing.

## Project Structure

```
src/
├── index.ts              # Main MCP server entry point - auto-registers all tools/resources
├── tools/                # Tool implementations
│   ├── index.ts          # Exports allTools array for auto-registration
│   ├── checkIn.ts        # Check-in tool definition
│   └── status.ts         # Status tool definition
├── resources/            # Resource implementations
│   ├── index.ts          # Exports allResources array for auto-registration
│   └── recentCheckIns.ts # Recent check-ins resource definition
├── types/                # Shared type definitions
│   ├── index.ts          # Type exports
│   ├── tool.ts           # ToolDefinition interface
│   └── resource.ts       # ResourceDefinition interface
└── utils/                # Shared utilities
    ├── logger.ts         # Logging utility (writes to stderr)
    └── registry.ts       # Auto-registration helpers
```

## MCP Server Architecture

The server uses a **scalable auto-registration pattern** with `McpServer` from `@modelcontextprotocol/sdk`:

- **Main server** (`src/index.ts`): Creates McpServer and auto-registers all tools/resources from arrays
- **Tools** (`src/tools/`): Each tool exports a `ToolDefinition` object added to `allTools` array
- **Resources** (`src/resources/`): Each resource exports a `ResourceDefinition` object added to `allResources` array
- **Types** (`src/types/`): Shared TypeScript interfaces for tools and resources
- **Auto-registration** (`src/utils/registry.ts`): Helper functions that register arrays of tools/resources
- **Logging**: CRITICAL - All logging MUST go to stderr to avoid corrupting stdio JSON-RPC messages

### Why This Architecture Scales

✅ **No manual registration** - Add tool/resource to array, it's automatically registered
✅ **Consistent pattern** - All tools/resources follow the same structure
✅ **Type safety** - Strong TypeScript typing across all definitions
✅ **Easy to test** - Each tool/resource is self-contained and can be tested independently
✅ **Low maintenance** - Adding 100 tools doesn't make index.ts 100x larger

### Adding New Tools

**Step 1:** Create a new file in `src/tools/` (e.g., `newTool.ts`):

```typescript
import { z } from "zod";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { ToolDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

// Define the input schema
const inputSchema = {
  param1: z.string().describe("Parameter description"),
  param2: z.number().optional().describe("Optional parameter"),
};

// Define the handler
async function handler(args: Record<string, unknown>): Promise<CallToolResult> {
  // Type assertion after Zod validation
  const { param1, param2 } = args as {
    param1: string;
    param2?: number;
  };

  logger.info(`Tool executed with: ${param1}`);

  return {
    content: [{ type: "text", text: "Result" }],
  };
}

// Export the tool definition
export const newTool: ToolDefinition = {
  name: "new_tool",
  description: "Tool description",
  inputSchema,
  handler,
};
```

**Step 2:** Add to `src/tools/index.ts`:

```typescript
import { newTool } from "./newTool.js";

export const allTools: ToolDefinition[] = [
  checkInTool,
  statusTool,
  newTool, // ← Just add this line!
];
```

**That's it!** The tool is automatically registered when the server starts. No need to modify `src/index.ts`.

### Adding New Resources

**Step 1:** Create a new file in `src/resources/` (e.g., `newResource.ts`):

```typescript
import type { ReadResourceResult } from "@modelcontextprotocol/sdk/types.js";
import type { ResourceDefinition } from "../types/index.js";
import { logger } from "../utils/logger.js";

// Define the handler
async function handler(uri: URL): Promise<ReadResourceResult> {
  logger.info(`Resource accessed: ${uri}`);

  return {
    contents: [
      {
        uri: uri.toString(),
        mimeType: "application/json",
        text: JSON.stringify({ data: "..." }, null, 2),
      },
    ],
  };
}

// Export the resource definition
export const newResource: ResourceDefinition = {
  name: "Resource Name",
  uri: "protocol://resource/path",
  metadata: {
    description: "Resource description",
    mimeType: "application/json",
  },
  handler,
};
```

**Step 2:** Add to `src/resources/index.ts`:

```typescript
import { newResource } from "./newResource.js";

export const allResources: ResourceDefinition[] = [
  recentCheckInsResource,
  newResource, // ← Just add this line!
];
```

**That's it!** The resource is automatically registered when the server starts. No need to modify `src/index.ts`.

### Organizing Many Tools/Resources

When you have many tools (10+), organize them in subdirectories:

```
src/tools/
├── index.ts                    # Exports allTools array
├── checkins/                   # Check-in related tools
│   ├── create.ts
│   ├── update.ts
│   └── delete.ts
├── reports/                    # Reporting tools
│   ├── summary.ts
│   └── detailed.ts
└── admin/                      # Admin tools
    ├── users.ts
    └── settings.ts
```

In `src/tools/index.ts`, import from subdirectories:

```typescript
import { createCheckInTool } from "./checkins/create.js";
import { updateCheckInTool } from "./checkins/update.js";
// ... etc

export const allTools: ToolDefinition[] = [
  createCheckInTool,
  updateCheckInTool,
  // ... etc
];
```

### Key Patterns

- **Auto-registration** - Tools/resources in the arrays are automatically registered
- **Consistent structure** - Every tool/resource follows the same ToolDefinition/ResourceDefinition pattern
- **Type safety** - Strong TypeScript typing prevents errors
- **Modular** - Each tool/resource is self-contained and testable
- **Scalable** - Adding 100 tools only requires adding 100 lines to the array
- **Use Zod schemas** for input validation (imported from `zod`)
- **Always log to stderr** - Use the `logger` utility, NEVER write to stdout
- **Async handlers** - All handlers are async and return proper result types

## Testing Your Server

Use the MCP Inspector for interactive testing:

```bash
pnpm inspector
```

This launches a web UI at http://localhost:6274 where you can:
- Test all tools with parameter validation
- Browse and read resources
- View real-time logs
- Debug tool behavior

See [TESTING.md](TESTING.md) for detailed testing instructions.

## Environment Configuration

The project uses environment variables for configuration. Create a `.env` file for local development (already gitignored).
