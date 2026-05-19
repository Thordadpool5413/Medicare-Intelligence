import OpenAI from "openai";

const SYSTEM_PROMPT = `You are a hospice market intelligence analyst. Use public CMS style evidence carefully. Do not process PHI. Do not claim that public proxy data proves referral flow. Separate evidence, inference, caveats, and recommended next steps.`;

function containsPhiRisk(text) {
  const value = String(text || "").toLowerCase();
  const riskyTerms = [
    "patient name",
    "date of birth",
    "dob",
    "social security",
    "ssn",
    "medical record",
    "mrn",
    "beneficiary id",
    "patient address"
  ];

  return riskyTerms.some((term) => value.includes(term));
}

function fallbackResponse(payload) {
  return [
    "Executive market intelligence request prepared.",
    "",
    `Workflow: ${payload.workflowId || "Not provided"}`,
    `Market: ${payload.geography || "Not provided"}`,
    `State: ${payload.state || "Not provided"}`,
    `City: ${payload.city || "Not provided"}`,
    `County: ${payload.county || "Not provided"}`,
    `ZIP: ${payload.zip || "Not provided"}`,
    "",
    "The OpenAI and MCP production connection is not configured in this environment yet, so this fallback confirms the app wiring, guardrails, and request payload are functioning.",
    "",
    "Next production step: set OPENAI_API_KEY and CMS_MEDICARE_MCP_URL, then connect this route to the remote MCP server for live CMS public market tools."
  ].join("\n");
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const message = payload.message || "";

    if (containsPhiRisk(JSON.stringify(payload))) {
      return Response.json(
        {
          error: "This request appears to include PHI or patient level identifiers. Remove patient names, DOB, MRN, SSN, beneficiary identifiers, addresses, or private clinical notes before running analysis."
        },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ output: fallbackResponse(payload) });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const tools = [];

    if (process.env.CMS_MEDICARE_MCP_URL) {
      tools.push({
        type: "mcp",
        server_label: "cms_medicare_market",
        server_url: process.env.CMS_MEDICARE_MCP_URL,
        require_approval: "never"
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      tools
    });

    return Response.json({ output: response.output_text || "No response returned." });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unexpected server error." },
      { status: 500 }
    );
  }
}
