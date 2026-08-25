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
      return "Deterministic OpenAI integration test completed without network access.";
    }

    const client = new OpenAI();

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL ?? "gpt-5.5",
      input,
    });

    return response.output_text;
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
      output: "Human review required before OpenAI execution.",
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

  if (live && !process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is required for --live.");
  }

  const goal =
    process.env.AEGISORA_EXAMPLE_GOAL ??
    "Explain why runtime governance should sit outside the model provider.";

  const result = await executeGoverned(goal);

  if (result.decision !== "ALLOW") {
    throw new Error("Expected ALLOW decision for the default OpenAI integration test.");
  }

  if (!result.output) {
    throw new Error("OpenAI example returned empty output.");
  }

  console.log("============================================================");
  console.log("AEGISORA OPENAI GOVERNED AGENT");
  console.log("============================================================");
  console.log("MODE=" + (live ? "LIVE" : "DETERMINISTIC"));
  console.log("PROVIDER=OPENAI");
  console.log("DECISION=" + result.decision);
  console.log("OUTPUT=" + result.output);
  console.log("OPENAI_EXAMPLE_RESULT=PASS");
}

main().catch((error) => {
  console.error("OPENAI_EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
