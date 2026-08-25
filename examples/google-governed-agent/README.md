# Aegisora Google Governed Agent Example

Runnable Google Gemini integration governed by Aegisora before provider execution.

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
      +---- ALLOW ------> Google Gemini API
                                |
                                v
                           Gemini Output
```

## Deterministic test

The default test performs no Google network call and requires no API key.

```bash
pnpm --filter @aegisora/example-google-governed-agent typecheck
pnpm --filter @aegisora/example-google-governed-agent build
pnpm --filter @aegisora/example-google-governed-agent test
```

Expected:

```text
MODE=DETERMINISTIC
PROVIDER=GOOGLE
DECISION=ALLOW
GOOGLE_EXAMPLE_RESULT=PASS
```

## Live test

```powershell
$env:GEMINI_API_KEY="YOUR_KEY"
$env:GEMINI_MODEL="gemini-3.7-flash"
pnpm --filter @aegisora/example-google-governed-agent live
```

Never commit API credentials.

## Documentation

https://docs.aegisora.org/integrations/google/
