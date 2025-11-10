# Testing Guide

This guide explains how to test your MCP server using the MCP Inspector.

## Quick Start

The easiest way to test your server is using the built-in npm script:

```bash
pnpm test:mcp
```

Or:

```bash
pnpm inspector
```

This will:
1. Build your TypeScript code
2. Launch the MCP Inspector
3. Connect it to your server
4. Open a web UI at http://localhost:6274

## What is MCP Inspector?

MCP Inspector is the official testing tool for MCP servers. It provides:
- **Interactive Web UI** for testing tools and resources
- **Real-time communication** with your server
- **Visual feedback** of requests and responses
- **Tool testing** with parameter validation
- **Resource browsing** and inspection

## Step-by-Step Testing

### 1. Start the Inspector

```bash
pnpm inspector
```

You should see output like:
```
Capital Check-In MCP Server running on stdio
Registered 2 tools and 1 resources
MCP Inspector running at http://localhost:6274
```

### 2. Open the Web UI

Open your browser and navigate to:
```
http://localhost:6274
```

### 3. Test Your Tools

In the MCP Inspector UI:

#### Testing `check_in` Tool

1. Click on the **Tools** tab
2. Select `check_in` from the list
3. Fill in the parameters:
   ```json
   {
     "location": "Office HQ",
     "amount": 50000,
     "notes": "Monthly capital review"
   }
   ```
4. Click **Execute**
5. View the response in the output panel

Expected response:
```json
{
  "success": true,
  "message": "Check-in registered successfully",
  "data": {
    "id": "1699...",
    "location": "Office HQ",
    "amount": 50000,
    "notes": "Monthly capital review",
    "timestamp": "2025-11-09T..."
  }
}
```

#### Testing `get_status` Tool

1. Select `get_status` from the tools list
2. (Optional) Set parameters:
   ```json
   {
     "limit": 5
   }
   ```
3. Click **Execute**
4. View the status response

### 4. Test Your Resources

1. Click on the **Resources** tab
2. You should see `Recent Check-ins` listed
3. Click on the resource to view its URI: `capital://check-ins/recent`
4. Click **Read** to fetch the resource
5. View the JSON response

Expected response:
```json
{
  "checkIns": [],
  "total": 0,
  "timestamp": "2025-11-09T..."
}
```

## Testing from Command Line

You can also test using the CLI mode:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js
```

## Advanced Testing

### Testing with Environment Variables

```bash
npx @modelcontextprotocol/inspector -e DEBUG=true node build/index.js
```

### Testing Specific Scenarios

1. **Invalid Parameters**: Try sending invalid data to test Zod validation
2. **Missing Required Fields**: Omit required fields to test error handling
3. **Edge Cases**: Test with extreme values (very large numbers, empty strings, etc.)

## Troubleshooting

### Inspector Won't Start

**Issue**: Port already in use
```
Error: listen EADDRINUSE: address already in use :::6274
```

**Solution**: Kill the process using the port or use a different port:
```bash
# Kill existing process
lsof -ti:6274 | xargs kill

# Or specify different port
npx @modelcontextprotocol/inspector --port 6275 node build/index.js
```

### Server Not Responding

**Issue**: Server crashes or doesn't respond

**Solution**: Check the logs in the terminal. Common issues:
- TypeScript compilation errors
- Missing dependencies
- Syntax errors in tool handlers

### Can't See Tools/Resources

**Issue**: Tools or resources don't appear in the UI

**Solution**:
1. Check that tools are added to the `allTools` array in `src/tools/index.ts`
2. Check that resources are added to the `allResources` array in `src/resources/index.ts`
3. Rebuild: `pnpm build`
4. Restart inspector

## Debugging Tips

### Enable Debug Logging

Set the `DEBUG` environment variable in your handler:

```typescript
async function handler(args: Record<string, unknown>): Promise<CallToolResult> {
  console.error('[DEBUG] Received args:', JSON.stringify(args, null, 2));
  // ... rest of handler
}
```

### Check Server Logs

The server logs to stderr, which you'll see in the terminal where you ran `pnpm inspector`. Look for:
- `[INFO]` messages showing tool/resource registration
- `[ERROR]` messages indicating problems
- Custom debug logs from your handlers

### Inspect Network Traffic

In the MCP Inspector UI:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter for WebSocket connections
4. View the JSON-RPC messages being sent/received

## Next Steps

Once you've verified your server works with MCP Inspector:

1. **Test in Claude Desktop** - Configure your server in Claude Desktop config
2. **Add More Tools** - Create additional tools following the pattern
3. **Add Tests** - Write unit tests for your tool handlers
4. **Deploy** - Package and deploy your server

## Resources

- [MCP Inspector GitHub](https://github.com/modelcontextprotocol/inspector)
- [MCP Documentation](https://modelcontextprotocol.io)
- [MCP Specification](https://spec.modelcontextprotocol.io)
