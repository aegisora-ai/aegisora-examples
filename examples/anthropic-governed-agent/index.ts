import { createRequire } from "node:module";
import Anthropic from "@anthropic-ai/sdk";

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
      return "Deterministic Anthropic integration test completed without network access.";
    }

    const client = new Anthropic();

    const response = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    const text = response.content.find((item) => item.type === "text");

    if (!text || text.type !== "text") {
      throw new Error("Anthropic returned no text output.");
    }

    return text.text;
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
      output: "Human review required before Anthropic execution.",
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

  if (live && !process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is required for --live.");
  }

  const goal =
    process.env.AEGISORA_EXAMPLE_GOAL ??
    "Explain why runtime governance should sit outside the model provider.";

  const result = await executeGoverned(goal);

  if (result.decision !== "ALLOW") {
    throw new Error("Expected ALLOW decision for the default Anthropic integration test.");
  }

  if (!result.output) {
    throw new Error("Anthropic example returned empty output.");
  }

  console.log("============================================================");
  console.log("AEGISORA ANTHROPIC GOVERNED AGENT");
  console.log("============================================================");
  console.log("MODE=" + (live ? "LIVE" : "DETERMINISTIC"));
  console.log("PROVIDER=ANTHROPIC");
  console.log("DECISION=" + result.decision);
  console.log("OUTPUT=" + result.output);
  console.log("ANTHROPIC_EXAMPLE_RESULT=PASS");
}

main().catch((error) => {
  console.error("ANTHROPIC_EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
