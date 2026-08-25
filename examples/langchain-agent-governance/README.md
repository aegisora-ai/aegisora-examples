# Aegisora LangChain Governance Example

Runnable LangChain integration example using the Aegisora SDK.

## Architecture

```text
LangChain Runnable
       |
       v
Execution Intent
       |
       v
Aegisora Governance
       |
       +---- ALLOW ----> Protected Execution
       +---- BLOCK ----> Stop
       +---- ESCALATE -> Review
```

## Requirements

- Node.js 24.x
- pnpm 11.20.0

## Verify

```bash
pnpm --filter @aegisora/example-langchain-agent-governance typecheck
pnpm --filter @aegisora/example-langchain-agent-governance build
pnpm --filter @aegisora/example-langchain-agent-governance test
```

Expected:

```text
STATUS=SUCCESS
EXAMPLE_RESULT=PASS
```

## Documentation

https://docs.aegisora.org/integrations/langchain/
