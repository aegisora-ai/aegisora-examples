import { createRequire } from "node:module";
import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

const require = createRequire(import.meta.url);
const { Aegisora } = require("@aegisora/sdk") as typeof import("@aegisora/sdk");

type Decision = "ALLOW" | "BLOCK" | "ESCALATE";

let protectedExecutionCount = 0;

const protectedExecution = Aegisora.protect({
  async run(input: string) {
    protectedExecutionCount += 1;
    return "Protected execution completed for: " + input;
  },
});

function evaluateTool(toolName: string, operation: string): Decision {
  if (toolName === "write_external") {
    return "BLOCK";
  }

  if (operation === "review") {
    return "ESCALATE";
  }

  return "ALLOW";
}

function resultText(decision: Decision, output: string) {
  return JSON.stringify({
    decision,
    output,
  });
}

function createServer() {
  const server = new McpServer({
    name: "aegisora-mcp-governance-example",
    version: "0.1.2",
  });

  server.registerTool(
    "read_context",
    {
      description: "Read a governed context value.",
      inputSchema: z.object({
        value: z.string(),
      }),
    },
    async ({ value }) => {
      const decision = evaluateTool("read_context", "read");

      const execution = await protectedExecution.run({
        input: "read_context:" + value,
      });

      return {
        content: [
          {
            type: "text",
            text: resultText(decision, execution.output),
          },
        ],
      };
    }
  );

  server.registerTool(
    "write_external",
    {
      description: "Simulates a protected external side effect.",
      inputSchema: z.object({
        value: z.string(),
      }),
    },
    async ({ value }) => {
      const decision = evaluateTool("write_external", "write");

      if (decision === "BLOCK") {
        return {
          content: [
            {
              type: "text",
              text: resultText(
                "BLOCK",
                "Protected side effect was denied before execution: " + value
              ),
            },
          ],
          isError: true,
        };
      }

      const execution = await protectedExecution.run({
        input: "write_external:" + value,
      });

      return {
        content: [
          {
            type: "text",
            text: resultText(decision, execution.output),
          },
        ],
      };
    }
  );

  server.registerTool(
    "review_operation",
    {
      description: "Simulates an operation that requires human review.",
      inputSchema: z.object({
        value: z.string(),
      }),
    },
    async ({ value }) => {
      const decision = evaluateTool("review_operation", "review");

      return {
        content: [
          {
            type: "text",
            text: resultText(
              decision,
              "Operation requires review: " + value
            ),
          },
        ],
      };
    }
  );

  server.registerTool(
    "governance_metrics",
    {
      description: "Return example governance execution metrics.",
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              protectedExecutionCount,
            }),
          },
        ],
      };
    }
  );

  return server;
}

serveStdio(createServer);
