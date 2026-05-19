export const NEWLINE = String.fromCharCode(10);

export const states = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" }
];

export const workflows = [
  { id: "market_brief", title: "Market Brief", fullTitle: "Market Command Brief", category: "Executive", confidence: "High", metric: "360 view", tools: ["Market share proxy", "Hospital opportunity", "SNF opportunity", "Data reality"], description: "Leadership ready territory intelligence using public CMS signals, hospice utilization proxies, hospital opportunity, SNF opportunity, and optional admissions summaries.", prompt: "Build a full hospice market intelligence brief for this geography. Include public opportunity signals, caveats, recommended account focus, and compliant next steps." },
  { id: "hospital_opportunity", title: "Hospitals", fullTitle: "Hospital Opportunity", category: "Accounts", confidence: "Directional", metric: "DRG signal", tools: ["Hospital opportunity", "CMS inpatient", "Public scoring"], description: "Prioritize hospitals using Medicare inpatient patterns and hospice relevant discharge opportunity indicators.", prompt: "Analyze hospital hospice education opportunity in this geography. Rank accounts, explain why they matter, and include limitations." },
  { id: "snf_opportunity", title: "SNFs", fullTitle: "SNF Opportunity", category: "Accounts", confidence: "Directional", metric: "Quality pressure", tools: ["Nursing home opportunity", "Provider catalog", "Quality signals"], description: "Rank nursing facilities using provider information, capacity, staffing, quality pressure, and market fit.", prompt: "Analyze skilled nursing facility hospice opportunity in this geography. Identify priority accounts and education themes." },
  { id: "hospice_share_proxy", title: "Share Proxy", fullTitle: "Hospice Share Proxy", category: "Market", confidence: "Proxy", metric: "PAC proxy", tools: ["PAC utilization", "Share proxy", "Provider comparison"], description: "Estimate directional hospice utilization share from Medicare post acute care utilization data without overstating referral flow.", prompt: "Create a hospice public market share proxy for this geography and explain what can and cannot be concluded." },
  { id: "quality_positioning", title: "Quality", fullTitle: "Hospice Quality Positioning", category: "Positioning", confidence: "High", metric: "Quality signal", tools: ["Hospice quality", "Public comparison", "Positioning"], description: "Convert hospice provider quality data into careful positioning language for leadership, field education, and account planning.", prompt: "Review hospice public quality positioning in this geography. Identify cautious differentiators and risk areas." },
  { id: "npi_lookup", title: "NPI Lookup", fullTitle: "NPI Lookup", category: "Validation", confidence: "High", metric: "Identity check", tools: ["NPPES", "Taxonomy", "Provider identity"], description: "Validate provider identity, taxonomy, location, organization names, and registry details from NPPES.", prompt: "Use NPPES to validate this provider or organization and summarize the public identity details." },
  { id: "admissions_summary", title: "Admissions", fullTitle: "Admissions Summary", category: "Internal", confidence: "Internal", metric: "CSV summary", tools: ["CSV validation", "Source summary", "Account concentration"], description: "Validate and summarize a deidentified admissions CSV using the MCP engine. No PHI. No patient level analysis.", prompt: "Validate and summarize this deidentified admissions CSV. Identify source patterns, account concentration, and safe market insights." },
  { id: "hospital_gap", title: "Hospital Gaps", fullTitle: "Hospital Gap Analysis", category: "Growth", confidence: "Hybrid", metric: "Gap proxy", tools: ["Internal admissions", "Hospital opportunity", "Gap scoring"], description: "Compare internal admissions summaries against public hospital opportunity scoring to identify underpenetrated hospital accounts.", prompt: "Compare deidentified internal admissions signals against public hospital opportunity scores and identify likely hospital account gaps." },
  { id: "snf_gap", title: "SNF Gaps", fullTitle: "SNF Gap Analysis", category: "Growth", confidence: "Hybrid", metric: "Gap proxy", tools: ["Internal admissions", "SNF opportunity", "Gap scoring"], description: "Compare internal admissions summaries against public SNF opportunity scoring to identify underpenetrated nursing facility accounts.", prompt: "Compare deidentified internal admissions signals against public SNF opportunity scores and identify likely SNF account gaps." },
  { id: "data_reality", title: "Reality Check", fullTitle: "Data Reality Checker", category: "Compliance", confidence: "High", metric: "Guardrails", tools: ["Data source limits", "Claim boundaries", "Safe interpretation"], description: "Separate what public CMS can prove, what it can only suggest, what needs internal data, and what requires licensed claims data.", prompt: "Explain the data access reality for this request. Separate what public CMS can prove, what it can only suggest, and what requires internal or licensed data." }
];

export function getStateLabel(state) {
  return states.find((item) => item.value === state)?.label || state || "";
}

export function sanitizeZip(value) {
  return String(value || "").split("").filter((char) => char >= "0" && char <= "9").join("").slice(0, 5);
}

export function normalizeCounty(value) {
  const trimmed = String(value || "").trim();
  return trimmed.toLowerCase().endsWith(" county") ? trimmed.slice(0, trimmed.length - 7) : trimmed;
}

export function buildMarketLabel({ state = "", city = "", county = "", zip = "" }) {
  const pieces = [];
  const stateLabel = getStateLabel(state);
  const cleanCity = String(city || "").trim();
  const cleanCounty = normalizeCounty(county);

  if (cleanCity) pieces.push(cleanCity);
  if (cleanCounty) pieces.push(`${cleanCounty} County`);
  if (stateLabel) pieces.push(stateLabel);
  if (zip) pieces.push(`ZIP ${zip}`);

  return pieces.length ? pieces.join(", ") : "No market selected";
}

export function getMarketCompleteness({ state = "", city = "", county = "", zip = "" }) {
  const values = [state, city, county, zip];
  return Math.round((values.filter(Boolean).length / values.length) * 100);
}

export function buildRequestText({ workflow, marketLabel, state, city, county, zip, organization, csvPath, notes }) {
  const selectedWorkflow = workflow || workflows[0];
  const parts = [
    selectedWorkflow.prompt,
    `Market: ${marketLabel || "No market selected"}`,
    `State: ${state || "Not provided"}`,
    `City: ${city || "Not provided"}`,
    `County: ${county || "Not provided"}`,
    `ZIP: ${zip || "Not provided"}`
  ];

  if (organization) parts.push(`Provider or organization context: ${organization}`);
  if (csvPath) parts.push(`Deidentified admissions CSV server path: ${csvPath}`);
  if (notes) parts.push(`Additional context: ${notes}`);

  return parts.join(NEWLINE);
}
