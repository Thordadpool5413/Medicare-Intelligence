# Medicare Intelligence

A professional hospice market intelligence workspace built with Next.js, Tailwind CSS, Recharts, and an MCP ready API layer.

## What this app does

Medicare Intelligence helps hospice leaders build market briefs, hospital opportunity reviews, SNF opportunity reviews, hospice share proxy summaries, quality positioning, NPI validation, admissions summaries, and referral gap analysis using public CMS aligned intelligence and safe deidentified internal context.

## Key features

- Professional healthcare SaaS layout
- Visible workflow library with 10 intelligence workflows
- State, city, county, and ZIP market targeting
- Provider or organization context input
- Deidentified CSV path support
- Request preview before execution
- Executive analysis output panel
- Signal board charts
- Guardrail first UX for PHI and public data limitations
- MCP ready API route

## Local setup

```bash
npm install
npm run dev
```

Open the app at:

```text
http://localhost:3000
```

## Environment variables

Create a `.env.local` file if you want to connect the API route to OpenAI or a remote MCP service.

```bash
OPENAI_API_KEY=your_key_here
CMS_MEDICARE_MCP_URL=https://your-mcp-server.example.com/mcp
```

The current API route includes a safe fallback response, so the UI can run without production credentials while the backend is being connected.

## Compliance posture

This app is built for public market intelligence and deidentified internal summaries only.

Do not enter PHI, patient names, dates of birth, medical record numbers, beneficiary identifiers, private clinical notes, or patient level admission data.

Public CMS outputs must be treated as signals, proxies, and directional intelligence. They should not be described as exact referral movement or proof of referral relationships.
