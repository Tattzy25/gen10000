const DIFY_MCP_URL = "https://api.dify.ai/mcp/server/vIKsLS3ToLV1yeUx/mcp";
const TOOL_NAME = "trash";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405, headers: CORS_HEADERS });
    }

    let body;
    try {
      body = await request.json();
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    const { version, prompt, numOutputs, uploads, customer_id } = body;

    try {
      const message = await mcpPost({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
          name: TOOL_NAME,
          arguments: { version, prompt, numOutputs, uploads, customer_id },
        },
      });

      if (!message || !message.result) {
        throw new Error("No result in MCP tools/call response: " + JSON.stringify(message));
      }

      const content = message.result.content;
      const textPart = Array.isArray(content) ? content.find((c) => c.type === "text") : null;
      if (!textPart) {
        throw new Error("No text content in MCP tools/call result: " + JSON.stringify(message.result));
      }

      let payload = JSON.parse(textPart.text);
      if (payload && typeof payload.body === "string") {
        payload = JSON.parse(payload.body);
      }

      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: String(err && err.message ? err.message : err) }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }
  },
};

async function mcpPost(jsonRpcBody) {
  const res = await fetch(DIFY_MCP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify(jsonRpcBody),
  });

  const contentType = res.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return await res.json();
  }

  if (contentType.includes("text/event-stream")) {
    return await readSseFinalMessage(res, jsonRpcBody.id);
  }

  const text = await res.text();
  throw new Error(`Unexpected MCP response (${res.status}, ${contentType}): ${text}`);
}

async function readSseFinalMessage(res, expectedId) {
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let lastMessage = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sepIndex;
    while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
      const rawEvent = buffer.slice(0, sepIndex);
      buffer = buffer.slice(sepIndex + 2);

      const dataLines = rawEvent
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.slice(5).trim());

      if (dataLines.length === 0) continue;

      const dataStr = dataLines.join("\n");
      let parsed;
      try {
        parsed = JSON.parse(dataStr);
      } catch (err) {
        continue;
      }

      if (parsed.id === expectedId && (parsed.result || parsed.error)) {
        lastMessage = parsed;
      }
    }
  }

  if (!lastMessage) {
    throw new Error("MCP SSE stream ended without a final JSON-RPC response for id " + expectedId);
  }

  return lastMessage;
}
