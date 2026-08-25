# Aegisora Custom Agent Governance Example

Runnable provider-independent custom agent example showing how an arbitrary agent implementation can execute behind Aegisora governance.

## Architecture

```text
Application Goal
      |
      v
Aegisora Governance
      |
      +---- BLOCK ------> stop
      |
      +---- ESCALATE ---> human review
      |
      +---- ALLOW ------> Aegisora protected execution
                                |
                                v
                           Custom Agent
```

## What this verifies

- Custom agent compatibility
- ALLOW decision
- BLOCK decision
- ESCALATE decision
- Protected execution boundary
- Blocked work never reaches the custom agent
- Escalated work never reaches the custom agent

## Verify

```bash
pnpm --filter @aegisora/example-custom-agent-governance typecheck
pnpm --filter @aegisora/example-custom-agent-governance build
pnpm --filter @aegisora/example-custom-agent-governance test
```

Expected output contains:

```text
AGENT_TYPE=CUSTOM
ALLOW=PASS
BLOCK=PASS
ESCALATE=PASS
EXECUTION_BOUNDARY=PASS
CUSTOM_AGENT_EXAMPLE_RESULT=PASS
```

## Documentation

https://docs.aegisora.org/integrations/custom-agents/
