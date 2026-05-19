"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  Clipboard,
  Database,
  FileText,
  Gauge,
  Hospital,
  Landmark,
  Layers3,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Upload,
  Zap
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  buildMarketLabel,
  buildRequestText,
  getMarketCompleteness,
  getStateLabel,
  normalizeCounty,
  sanitizeZip,
  states,
  workflows
} from "../lib/marketLogic.mjs";

const iconMap = {
  market_brief: Landmark,
  hospital_opportunity: Hospital,
  snf_opportunity: Building2,
  hospice_share_proxy: BarChart3,
  quality_positioning: ShieldCheck,
  npi_lookup: Search,
  admissions_summary: Upload,
  hospital_gap: Activity,
  snf_gap: Stethoscope,
  data_reality: Database
};

const marketPresets = [
  { label: "Brevard", state: "FL", city: "Satellite Beach", county: "Brevard", zip: "32937" },
  { label: "Orlando", state: "FL", city: "Orlando", county: "Orange", zip: "32801" },
  { label: "Tampa", state: "FL", city: "Tampa", county: "Hillsborough", zip: "33602" },
  { label: "Miami", state: "FL", city: "Miami", county: "Miami Dade", zip: "33101" }
];

const examples = [
  "Build a leadership ready hospice market command brief with hospital and SNF opportunity priorities.",
  "Identify the accounts that appear most underpenetrated based on public opportunity signals and internal admissions context.",
  "Create a compliant account plan that separates evidence, inference, caveats, and recommended field action.",
  "Explain what public CMS data can and cannot tell me about hospice referral movement."
];

const trendData = [
  { label: "Hospital", value: 82 },
  { label: "SNF", value: 74 },
  { label: "Hospice", value: 68 },
  { label: "Quality", value: 91 },
  { label: "Gap", value: 77 }
];

const signalData = [
  { month: "Jan", score: 44 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 61 },
  { month: "Apr", score: 58 },
  { month: "May", score: 74 },
  { month: "Jun", score: 82 }
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Card({ children, className = "" }) {
  return <section className={cx("rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>{children}</section>;
}

function Kpi({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">{label}</div>
          <div className="mt-1 text-lg font-black text-slate-950">{value}</div>
        </div>
        <Icon className="h-5 w-5 text-slate-500" />
      </div>
    </div>
  );
}

function WorkflowCard({ item, active, onClick }) {
  const Icon = iconMap[item.id] || FileText;

  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-2xl border p-3 text-left transition",
        active
          ? "border-blue-600 bg-blue-600 text-white shadow-md"
          : "border-slate-200 bg-white text-slate-900 hover:border-blue-300 hover:bg-blue-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cx("grid h-10 w-10 shrink-0 place-items-center rounded-xl", active ? "bg-white text-blue-700" : "bg-blue-50 text-blue-700")}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-black">{item.title}</div>
          <div className={cx("mt-0.5 truncate text-xs", active ? "text-slate-100" : "text-slate-500")}>{item.category} · {item.metric}</div>
        </div>
      </div>
    </button>
  );
}

function Field({ label, value, children }) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</span>
        {value && <span className="truncate text-xs font-semibold text-slate-400">{value}</span>}
      </div>
      {children}
    </label>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={cx(
        "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
        className
      )}
    />
  );
}

function SectionTitle({ icon: Icon, title, detail }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-lg font-black tracking-tight text-slate-950">{title}</h2>
        {detail && <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>}
      </div>
    </div>
  );
}

export default function MedicareMarketCommandCenter() {
  const [workflowId, setWorkflowId] = useState("market_brief");
  const [state, setState] = useState("FL");
  const [city, setCity] = useState("Satellite Beach");
  const [county, setCounty] = useState("Brevard");
  const [zip, setZip] = useState("32937");
  const [organization, setOrganization] = useState("");
  const [csvPath, setCsvPath] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const workflow = useMemo(() => workflows.find((item) => item.id === workflowId) || workflows[0], [workflowId]);
  const ActiveIcon = iconMap[workflow.id] || FileText;
  const marketLabel = useMemo(() => buildMarketLabel({ state, city, county, zip }), [state, city, county, zip]);
  const completeness = useMemo(() => getMarketCompleteness({ state, city, county, zip }), [state, city, county, zip]);
  const requestText = useMemo(
    () => buildRequestText({ workflow, marketLabel, state, city, county, zip, organization, csvPath, notes }),
    [workflow, marketLabel, state, city, county, zip, organization, csvPath, notes]
  );

  function applyPreset(preset) {
    setState(preset.state);
    setCity(preset.city);
    setCounty(preset.county);
    setZip(preset.zip);
  }

  async function copyRequest() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(requestText);
    }
  }

  async function runAnalysis() {
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workflowId,
          geography: marketLabel,
          state,
          city,
          county,
          zip,
          organization,
          csvPath,
          notes,
          message: requestText
        })
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : { error: await response.text() };

      if (!response.ok) {
        throw new Error(data.error || `The analysis request failed with status ${response.status}.`);
      }

      setResult(data.output || data.text || "No response returned.");
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-700 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-white">Medicare Intelligence</span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">MCP ready</span>
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-slate-600">No PHI</span>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">Market Command Workspace</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">A clean executive workspace for hospice market intelligence, account opportunity, provider validation, and compliant growth planning.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:w-[620px]">
              <Kpi icon={MapPin} label="Market" value={`${completeness}%`} />
              <Kpi icon={Gauge} label="Workflow" value={workflow.category} />
              <Kpi icon={ShieldCheck} label="Evidence" value={workflow.confidence} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-5 py-5">
        <Card className="p-4">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <SectionTitle icon={Layers3} title="Workflow library" detail="Every mode is visible, compact, and selectable without hiding controls in a sidebar." />
            <div className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-600">10 workflows</div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {workflows.map((item) => (
              <WorkflowCard key={item.id} item={item} active={item.id === workflowId} onClick={() => setWorkflowId(item.id)} />
            ))}
          </div>
        </Card>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <div className="space-y-5">
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600 text-white">
                      <ActiveIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Active workflow</div>
                      <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{workflow.fullTitle}</h2>
                      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{workflow.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:max-w-sm lg:justify-end">
                    {workflow.tools.map((tool) => (
                      <span key={tool} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-black text-slate-700">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                  <SectionTitle icon={MapPin} title="Market and account inputs" detail="Simple, visible, and built for fast execution." />
                  <div className="mt-4 flex flex-wrap gap-2">
                    {marketPresets.map((preset) => (
                      <button key={preset.label} onClick={() => applyPreset(preset)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-700 hover:border-blue-500">
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-4">
                    <Field label="State" value={getStateLabel(state)}>
                      <select value={state} onChange={(event) => setState(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-blue-500">
                        {states.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                      </select>
                    </Field>
                    <Field label="City" value={city}>
                      <TextInput value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" />
                    </Field>
                    <Field label="County" value={county ? `${normalizeCounty(county)} County` : ""}>
                      <TextInput value={county} onChange={(event) => setCounty(event.target.value)} placeholder="County" />
                    </Field>
                    <Field label="ZIP" value={zip}>
                      <TextInput value={zip} onChange={(event) => setZip(sanitizeZip(event.target.value))} placeholder="ZIP" inputMode="numeric" />
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field label="Provider or organization" value={organization}>
                      <TextInput value={organization} onChange={(event) => setOrganization(event.target.value)} placeholder="Hospital, SNF, hospice, NPI, physician group" />
                    </Field>
                    <Field label="Deidentified CSV path" value={csvPath}>
                      <TextInput value={csvPath} onChange={(event) => setCsvPath(event.target.value)} placeholder="Secure server path only" />
                    </Field>
                  </div>

                  <label className="mt-4 block">
                    <div className="mb-1.5 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Additional context</div>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium leading-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Add leadership questions, target accounts, service area context, or what decision this should support." />
                  </label>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button onClick={runAnalysis} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
                      {loading ? <Activity className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                      {loading ? "Running analysis" : "Run analysis"}
                    </button>
                    <button onClick={() => setNotes(examples[Math.floor(Math.random() * examples.length)])} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-blue-500">
                      <Sparkles className="h-4 w-4" /> Example
                    </button>
                    <button onClick={copyRequest} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-800 hover:border-blue-500">
                      <Clipboard className="h-4 w-4" /> Copy request
                    </button>
                  </div>
                </div>

                <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Market snapshot</div>
                  <div className="mt-2 text-xl font-black text-slate-950">{marketLabel}</div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${completeness}%` }} />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Completeness</div>
                      <div className="mt-1 text-lg font-black">{completeness}%</div>
                    </div>
                    <div className="rounded-xl bg-white p-3">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Mode</div>
                      <div className="mt-1 text-lg font-black">{workflow.category}</div>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-white p-3">
                    <div className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Guardrails</div>
                    <div className="mt-2 grid gap-2 text-xs font-bold text-slate-600">
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No PHI</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No patient level data</div>
                      <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Proxy signals labeled</div>
                    </div>
                  </div>
                </aside>
              </div>
            </Card>

            <section className="grid gap-5 lg:grid-cols-2">
              <Card className="p-5">
                <SectionTitle icon={FileText} title="Request preview" detail="The structured payload that will be sent to the backend." />
                <pre className="mt-4 max-h-[380px] overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">{requestText}</pre>
              </Card>

              <Card className="p-5">
                <SectionTitle icon={Activity} title="Analysis output" detail="Readable result area with enough room for executive narrative." />
                <div className="mt-4 min-h-[380px] rounded-2xl border border-slate-200 bg-white p-4 text-slate-800">
                  {result ? (
                    <pre className="whitespace-pre-wrap text-sm leading-7">{result}</pre>
                  ) : (
                    <div className="grid h-[340px] place-items-center rounded-xl border border-dashed border-blue-200 bg-blue-50 text-center">
                      <div className="max-w-md px-6">
                        <Activity className="mx-auto h-9 w-9 text-blue-500" />
                        <h3 className="mt-4 text-xl font-black text-slate-950">Ready for analysis</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-500">Run the selected workflow to generate the market intelligence output.</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </section>
          </div>

          <aside className="space-y-5">
            <Card className="p-5">
              <SectionTitle icon={BarChart3} title="Signal board" detail="Compact visual layer without oversized decoration." />
              <div className="mt-4 h-56 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendData} margin={{ top: 12, right: 4, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 h-56 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={signalData} margin={{ top: 12, right: 4, left: -28, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="score" stroke="#2563eb" fill="#dbeafe" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <SectionTitle icon={Database} title="Execution plan" detail="The app shows what will happen before running analysis." />
              <div className="mt-4 grid gap-3">
                {["Validate market", "Select MCP tools", "Apply guardrails", "Generate output"].map((step, index) => (
                  <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-xs font-black text-white">{index + 1}</div>
                    <div className="text-sm font-black text-slate-800">{step}</div>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </section>
      </main>
    </div>
  );
}
