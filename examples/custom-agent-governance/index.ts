import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Aegisora } = require("@aegisora/sdk") as typeof import("@aegisora/sdk");

type GovernanceDecision = "ALLOW" | "BLOCK" | "ESCALATE";

type GovernedResult = {
  decision: GovernanceDecision;
  output: string;
};

let customAgentExecutionCount = 0;

class CustomAgent {
  async execute(goal: string): Promise<string> {
    customAgentExecutionCount += 1;

    return "Custom agent executed: " + goal;
  }
}

function decide(goal: string): GovernanceDecision {
  if (!goal.trim()) {
    return "BLOCK";
  }

  if (goal.toLowerCase().includes("production deploy")) {
    return "ESCALATE";
  }

  return "ALLOW";
}

const agent = new CustomAgent();

const protectedExecution = Aegisora.protect({
  async run(input: string) {
    return agent.execute(input);
  },
});

async function executeGoverned(goal: string): Promise<GovernedResult> {
  const decision = decide(goal);

  if (decision === "BLOCK") {
    return {
      decision,
      output: "Execution blocked before custom agent execution.",
    };
  }

  if (decision === "ESCALATE") {
    return {
      decision,
      output: "Human review required before custom agent execution.",
    };
  }

  const execution = await protectedExecution.run({
    input: goal,
  });

  return {
    decision,
    output: execution.output,
  };
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const allowed = await executeGoverned("Run a harmless custom agent task.");

  assert(
    allowed.decision === "ALLOW",
    "Custom agent ALLOW decision failed."
  );

  assert(
    allowed.output.includes("Custom agent executed:"),
    "Custom agent execution did not occur."
  );

  assert(
    customAgentExecutionCount === 1,
    "Unexpected execution count after ALLOW."
  );

  const blocked = await executeGoverned("");

  assert(
    blocked.decision === "BLOCK",
    "Custom agent BLOCK decision failed."
  );

  assert(
    customAgentExecutionCount === 1,
    "BLOCKED execution crossed the custom agent boundary."
  );

  const escalated = await executeGoverned("production deploy custom agent");

  assert(
    escalated.decision === "ESCALATE",
    "Custom agent ESCALATE decision failed."
  );

  assert(
    customAgentExecutionCount === 1,
    "ESCALATED execution crossed the custom agent boundary."
  );

  console.log("============================================================");
  console.log("AEGISORA CUSTOM AGENT GOVERNANCE EXAMPLE");
  console.log("============================================================");
  console.log("AGENT_TYPE=CUSTOM");
  console.log("ALLOW=PASS");
  console.log("BLOCK=PASS");
  console.log("ESCALATE=PASS");
  console.log("EXECUTION_BOUNDARY=PASS");
  console.log("PROTECTED_EXECUTIONS=" + customAgentExecutionCount);
  console.log("CUSTOM_AGENT_EXAMPLE_RESULT=PASS");
}

main().catch((error) => {
  console.error("CUSTOM_AGENT_EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
