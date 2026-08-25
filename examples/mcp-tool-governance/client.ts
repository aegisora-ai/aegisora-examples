import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const client = new Client({
    name: "aegisora-mcp-governance-test",
    version: "0.1.2",
  });

  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/server.js"],
  });

  try {
    await client.connect(transport);

    const tools = await client.listTools();
    const toolNames = tools.tools.map((tool) => tool.name);

    assert(
      toolNames.includes("read_context"),
      "read_context tool was not registered."
    );

    assert(
      toolNames.includes("write_external"),
      "write_external tool was not registered."
    );

    assert(
      toolNames.includes("review_operation"),
      "review_operation tool was not registered."
    );

    const allowed = await client.callTool({
      name: "read_context",
      arguments: {
        value: "safe-context",
      },
    });

    const allowedText = String(
      (allowed.content?.find((item) => item.type === "text") as
        | { type: "text"; text: string }
        | undefined)?.text ?? ""
    );

    assert(
      allowedText.includes("\"decision\":\"ALLOW\""),
      "ALLOW decision was not returned."
    );

    const blocked = await client.callTool({
      name: "write_external",
      arguments: {
        value: "dangerous-side-effect",
      },
    });

    const blockedText = String(
      (blocked.content?.find((item) => item.type === "text") as
        | { type: "text"; text: string }
        | undefined)?.text ?? ""
    );

    assert(
      blocked.isError === true,
      "BLOCKED MCP tool did not return isError=true."
    );

    assert(
      blockedText.includes("\"decision\":\"BLOCK\""),
      "BLOCK decision was not returned."
    );

    const escalated = await client.callTool({
      name: "review_operation",
      arguments: {
        value: "production-deployment",
      },
    });

    const escalatedText = String(
      (escalated.content?.find((item) => item.type === "text") as
        | { type: "text"; text: string }
        | undefined)?.text ?? ""
    );

    assert(
      escalatedText.includes("\"decision\":\"ESCALATE\""),
      "ESCALATE decision was not returned."
    );

    const metrics = await client.callTool({
      name: "governance_metrics",
      arguments: {},
    });

    const metricsText = String(
      (metrics.content?.find((item) => item.type === "text") as
        | { type: "text"; text: string }
        | undefined)?.text ?? ""
    );

    const metricsValue = JSON.parse(metricsText) as {
      protectedExecutionCount: number;
    };

    assert(
      metricsValue.protectedExecutionCount === 1,
      "Blocked tool crossed the protected execution boundary."
    );

    console.log("============================================================");
    console.log("AEGISORA MCP TOOL GOVERNANCE EXAMPLE");
    console.log("============================================================");
    console.log("MCP_HANDSHAKE=PASS");
    console.log("TOOLS_DISCOVERED=" + toolNames.join(","));
    console.log("ALLOW=PASS");
    console.log("BLOCK=PASS");
    console.log("ESCALATE=PASS");
    console.log("SIDE_EFFECT_BOUNDARY=PASS");
    console.log("EXAMPLE_RESULT=PASS");
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("EXAMPLE_RESULT=FAIL");
  console.error(error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
