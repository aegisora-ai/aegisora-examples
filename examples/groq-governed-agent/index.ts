import { createRequire } from "node:module";
import Groq from "groq-sdk";

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
      return "Deterministic Groq integration test completed without network access.";
    }

    const client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL ?? "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: input,
        },
      ],
    });

    const output = response.choices[0]?.message?.content;

    if (!output) {
      throw new Error("Groq returned empty output.");
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
      output: "Human review required before Groq execution.",
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

  if (live && !process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is required for --live.");
  }

  const goal =
    process.env.AEGISORA_EXAMPLE_GOAL ??
    "Explain why runtime governance should sit outside the model provider.";

  const result = await executeGoverned(goal);

  if (result.decision !== "ALLOW") {
    throw new Error("Expected ALLOW decision for the default Groq integration test.");
  }

  if (!result.output) {
    throw new Error("Groq example returned empty output.");
  }

  console.log("============================================================");
  console.log("AEGISORA GROQ GOVERNED AGENT");
  console.log("============================================================");
  console.log("MODE=" + (live ? "LIVE" : "DETERMINISTIC"));
  console.log("PROVIDER=GROQ");
  console.log("MODEL=" + (process.env.GROQ_MODEL ?? "openai/gpt-oss-20b"));
  console.log("DECISION=" + result.decision);
  console.log("OUTPUT=" + result.output);
  console.log("GROQ_EXAMPLE_RESULT=PASS");
}

main().catch((error) => {
  console.error("GROQ_EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
