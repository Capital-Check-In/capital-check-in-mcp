# Capital Check-In MCP Server

A Model Context Protocol (MCP) server for managing capital check-ins. This server provides tools and resources for tracking and managing capital-related events.

## Features

- **Check-in Tool**: Register capital check-in events with location, amount, and notes
- **Status Tool**: Retrieve current capital status and recent check-ins
- **Resources**: Access recent check-ins via MCP resources

## Installation

```bash
pnpm install
```

## Development

```bash
# Build the project
pnpm build

# Watch mode for development
pnpm dev

# Lint code
pnpm lint

# Format code
pnpm format
```

## Usage

### Testing with MCP Inspector

The fastest way to test your server is using the MCP Inspector:

```bash
pnpm inspector
# or
pnpm test:mcp
```

This opens an interactive web UI at http://localhost:6274 where you can:
- Test all tools with parameter validation
- Browse and read resources
- View real-time request/response logs
- Debug tool behavior

See [TESTING.md](TESTING.md) for a complete testing guide.

### Running the Server

The server communicates via stdio and can be used with any MCP client:

```bash
node build/index.js
```

### Available Tools

#### check_in

Register a capital check-in event.

**Parameters:**
- `location` (string, required): Location of the check-in
- `amount` (number, required): Capital amount involved
- `notes` (string, optional): Optional notes about the check-in

**Example:**
```json
{
  "location": "Office HQ",
  "amount": 50000,
  "notes": "Monthly capital review"
}
```

#### get_status

Get current capital status and recent check-ins.

**Parameters:**
- `limit` (number, optional): Number of recent check-ins to retrieve (default: 10)

### Available Resources

- `capital://check-ins/recent`: List of recent capital check-ins

## Configuration with Claude Desktop

Add this server to your Claude Desktop config:

**MacOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "capital-check-in": {
      "command": "node",
      "args": ["/absolute/path/to/capital-check-in-mcp/build/index.js"]
    }
  }
}
```

## Project Structure

```
src/
├── index.ts              # Main MCP server - auto-registers all tools/resources
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

## Architecture

This server uses a **scalable auto-registration architecture** with `McpServer` from `@modelcontextprotocol/sdk`:

- **Auto-registration** - Tools/resources are automatically registered from arrays
- **Consistent patterns** - All tools/resources follow standardized ToolDefinition/ResourceDefinition interfaces
- **Type-safe** - Full TypeScript support with strict mode and Zod validation
- **Scalable** - Adding 100 tools doesn't require 100 manual registrations
- **Modular** - Each tool/resource is self-contained and testable
- **Stdio transport** - JSON-RPC communication via stdio

### Adding New Tools/Resources

Simply create a new file following the pattern, add it to the array in `index.ts`, and it's automatically registered. No need to modify the main server file!

See `CLAUDE.md` for detailed architecture patterns and development guidelines.

## License

MIT
