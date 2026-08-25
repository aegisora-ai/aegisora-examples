# Aegisora Examples

Runnable examples and integration recipes for the Aegisora AI governance ecosystem.

Aegisora provides zero-trust runtime security and governance for autonomous AI agents.

## Repository purpose

This repository contains reproducible examples showing how agent frameworks, model providers, tools, and custom runtimes can execute through Aegisora governance.

## Current examples

| Example | Status |
| --- | --- |
| LangGraph Agent Governance | Maintained |
| LangChain Agent Governance | Planned |
| MCP Tool Governance | Planned |
| OpenAI Governed Agent | Planned |
| Anthropic Governed Agent | Planned |
| Google Governed Agent | Planned |
| Groq Governed Agent | Planned |
| Qwen Governed Agent | Planned |
| Custom Agent Governance | Planned |

## Requirements

| Tool | Baseline |
| --- | --- |
| Node.js | 24.x |
| pnpm | 11.20.0 |
| Git | Current |
| Aegisora | v0.1.2 |

## Maintained example

``bash
pnpm --filter @aegisora/example-langgraph-agent-governance test
``

Expected:

``text
STATUS=SUCCESS
EXAMPLE_RESULT=PASS
``

## Documentation

https://docs.aegisora.org/

## Core repository

https://github.com/aegisora-ai/aegisora