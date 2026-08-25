# Aegisora OpenAI Governed Agent Example

Runnable OpenAI Responses API integration governed by Aegisora before provider execution.

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
      +---- ALLOW ------> OpenAI Responses API
                                |
                                v
                           Model Output
```

## Deterministic test

The default test performs no OpenAI network call and requires no API key.

```bash
pnpm --filter @aegisora/example-openai-governed-agent typecheck
pnpm --filter @aegisora/example-openai-governed-agent build
pnpm --filter @aegisora/example-openai-governed-agent test
```

Expected:

```text
MODE=DETERMINISTIC
PROVIDER=OPENAI
DECISION=ALLOW
OPENAI_EXAMPLE_RESULT=PASS
```

## Live test

```powershell
$env:OPENAI_API_KEY="YOUR_KEY"
$env:OPENAI_MODEL="gpt-5.5"
pnpm --filter @aegisora/example-openai-governed-agent live
```

Never commit API credentials.

## Documentation

https://docs.aegisora.org/integrations/openai/
