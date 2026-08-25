# Aegisora MCP Tool Governance Example

Runnable Model Context Protocol example demonstrating a real MCP client/server boundary governed by Aegisora.

## Architecture

```text
MCP Client
    |
    | listTools / callTool
    v
MCP Server
    |
    v
Tool Governance
    |
    +---- ALLOW ----> Aegisora protected execution
    |
    +---- BLOCK ----> stop before protected execution
    |
    +---- ESCALATE -> review result
```

## What this verifies

- MCP initialization handshake
- MCP tool discovery
- MCP tool invocation
- ALLOW decision
- BLOCK decision
- ESCALATE decision
- Protected execution boundary
- Blocked side effect does not cross the execution boundary

## Verify

```bash
pnpm --filter @aegisora/example-mcp-tool-governance typecheck
pnpm --filter @aegisora/example-mcp-tool-governance build
pnpm --filter @aegisora/example-mcp-tool-governance test
```

Expected output contains:

```text
MCP_HANDSHAKE=PASS
ALLOW=PASS
BLOCK=PASS
ESCALATE=PASS
SIDE_EFFECT_BOUNDARY=PASS
EXAMPLE_RESULT=PASS
```

## MCP SDK

This example uses the current MCP TypeScript SDK v2 packages:

- `@modelcontextprotocol/server`
- `@modelcontextprotocol/client`

## Documentation

https://docs.aegisora.org/integrations/mcp/
