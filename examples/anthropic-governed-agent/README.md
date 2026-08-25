# Aegisora Anthropic Governed Agent Example

Runnable Anthropic Messages API integration governed by Aegisora before provider execution.

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
      +---- ALLOW ------> Anthropic Messages API
                                |
                                v
                           Claude Output
```

## Deterministic test

The default test performs no Anthropic network call and requires no API key.

```bash
pnpm --filter @aegisora/example-anthropic-governed-agent typecheck
pnpm --filter @aegisora/example-anthropic-governed-agent build
pnpm --filter @aegisora/example-anthropic-governed-agent test
```

Expected:

```text
MODE=DETERMINISTIC
PROVIDER=ANTHROPIC
DECISION=ALLOW
ANTHROPIC_EXAMPLE_RESULT=PASS
```

## Live test

```powershell
$env:ANTHROPIC_API_KEY="YOUR_KEY"
$env:ANTHROPIC_MODEL="claude-sonnet-4-5"
pnpm --filter @aegisora/example-anthropic-governed-agent live
```

Never commit API credentials.

## Documentation

https://docs.aegisora.org/integrations/anthropic/
