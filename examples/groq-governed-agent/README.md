# Aegisora Groq Governed Agent Example

Runnable Groq Chat Completions integration governed by Aegisora before provider execution.

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
      +---- ALLOW ------> Groq Chat Completions
                                |
                                v
                           Model Output
```

## Deterministic test

The default test performs no Groq network call and requires no API key.

```bash
pnpm --filter @aegisora/example-groq-governed-agent typecheck
pnpm --filter @aegisora/example-groq-governed-agent build
pnpm --filter @aegisora/example-groq-governed-agent test
```

Expected:

```text
MODE=DETERMINISTIC
PROVIDER=GROQ
DECISION=ALLOW
GROQ_EXAMPLE_RESULT=PASS
```

## Live test

```powershell
$env:GROQ_API_KEY="YOUR_KEY"
$env:GROQ_MODEL="openai/gpt-oss-20b"
pnpm --filter @aegisora/example-groq-governed-agent live
```

Never commit API credentials.

## Documentation

https://docs.aegisora.org/integrations/groq/
