import { createRequire } from "node:module";
import { RunnableLambda } from "@langchain/core/runnables";

const require = createRequire(import.meta.url);
const { Aegisora } = require("@aegisora/sdk") as typeof import("@aegisora/sdk");

type ExampleInput = {
  goal: string;
};

const protectedAgent = Aegisora.protect({
  async run(input: string) {
    if (!input.trim()) {
      throw new Error("Goal is required.");
    }

    return "Aegisora protected LangChain execution completed for: " + input;
  },
});

const governedRunnable = RunnableLambda.from(
  async (input: ExampleInput) => {
    const result = await protectedAgent.run({ input: input.goal });

    return {
      status: "SUCCESS",
      output: result.output,
    };
  }
);

async function main() {
  const goal = process.env.AEGISORA_EXAMPLE_GOAL ??
    "Run a protected LangChain agent action.";

  const result = await governedRunnable.invoke({ goal });

  if (result.status !== "SUCCESS") {
    throw new Error("Example failed with status: " + result.status);
  }

  console.log("============================================================");
  console.log("AEGISORA LANGCHAIN EXAMPLE");
  console.log("============================================================");
  console.log("STATUS=" + result.status);
  console.log("OUTPUT=" + result.output);
  console.log("EXAMPLE_RESULT=PASS");
}

main().catch((error) => {
  console.error("EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
