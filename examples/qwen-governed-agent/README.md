# Aegisora Qwen Governed Agent Example

Runnable Qwen integration through the Alibaba Model Studio OpenAI-compatible API, governed by Aegisora before provider execution.

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
      +---- ALLOW ------> Qwen OpenAI-compatible API
                                |
                                v
                           Model Output
```

## Deterministic test

The default test performs no network request and requires no Qwen credentials.

```bash
pnpm --filter @aegisora/example-qwen-governed-agent typecheck
pnpm --filter @aegisora/example-qwen-governed-agent build
pnpm --filter @aegisora/example-qwen-governed-agent test
```

Expected:

```text
MODE=DETERMINISTIC
PROVIDER=QWEN
MODEL=qwen-plus
DECISION=ALLOW
QWEN_EXAMPLE_RESULT=PASS
```

## Live test

For Alibaba Cloud Model Studio, use the OpenAI-compatible endpoint for the region/workspace you selected.

Germany example:

```powershell
$env:QWEN_API_KEY="YOUR_KEY"
$env:QWEN_BASE_URL="https://YOUR_WORKSPACE_ID.eu-central-1.maas.aliyuncs.com/compatible-mode/v1"
$env:QWEN_MODEL="qwen-plus"
pnpm --filter @aegisora/example-qwen-governed-agent live
```

Never commit API credentials or workspace secrets.

## Documentation

https://docs.aegisora.org/integrations/qwen/
