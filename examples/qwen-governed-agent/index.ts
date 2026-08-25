import { createRequire } from "node:module";
import OpenAI from "openai";

const require = createRequire(import.meta.url);
const { Aegisora } = require("@aegisora/sdk") as typeof import("@aegisora/sdk");

type GovernanceDecision = "ALLOW" | "BLOCK" | "ESCALATE";

type GovernedResult = {
  decision: GovernanceDecision;
  output: string;
};

function decide(goal: string): GovernanceDecision {
  if (!goal.trim()) {
    return "BLOCK";
  }

  if (goal.toLowerCase().includes("production deploy")) {
    return "ESCALATE";
  }

  return "ALLOW";
}

const protectedExecution = Aegisora.protect({
  async run(input: string) {
    const live = process.argv.includes("--live");

    if (!live) {
      return "Deterministic Qwen integration test completed without network access.";
    }

    const apiKey = process.env.QWEN_API_KEY;
    const baseURL = process.env.QWEN_BASE_URL;

    if (!apiKey) {
      throw new Error("QWEN_API_KEY is required for --live.");
    }

    if (!baseURL) {
      throw new Error("QWEN_BASE_URL is required for --live.");
    }

    const client = new OpenAI({
      apiKey,
      baseURL,
    });

    const response = await client.chat.completions.create({
      model: process.env.QWEN_MODEL ?? "qwen-plus",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    const output = response.choices[0]?.message?.content;

    if (!output) {
      throw new Error("Qwen returned empty output.");
    }

    return output;
  },
});

async function executeGoverned(goal: string): Promise<GovernedResult> {
  const decision = decide(goal);

  if (decision === "BLOCK") {
    return {
      decision,
      output: "Execution blocked by Aegisora governance.",
    };
  }

  if (decision === "ESCALATE") {
    return {
      decision,
      output: "Human review required before Qwen execution.",
    };
  }

  const execution = await protectedExecution.run({
    input: goal,
  });

  return {
    decision: "ALLOW",
    output: execution.output,
  };
}

async function main() {
  const live = process.argv.includes("--live");

  const goal =
    process.env.AEGISORA_EXAMPLE_GOAL ??
    "Explain why runtime governance should sit outside the model provider.";

  const result = await executeGoverned(goal);

  if (result.decision !== "ALLOW") {
    throw new Error("Expected ALLOW decision for the default Qwen integration test.");
  }

  if (!result.output) {
    throw new Error("Qwen example returned empty output.");
  }

  console.log("============================================================");
  console.log("AEGISORA QWEN GOVERNED AGENT");
  console.log("============================================================");
  console.log("MODE=" + (live ? "LIVE" : "DETERMINISTIC"));
  console.log("PROVIDER=QWEN");
  console.log("MODEL=" + (process.env.QWEN_MODEL ?? "qwen-plus"));
  console.log("DECISION=" + result.decision);
  console.log("OUTPUT=" + result.output);
  console.log("QWEN_EXAMPLE_RESULT=PASS");
}

main().catch((error) => {
  console.error("QWEN_EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
