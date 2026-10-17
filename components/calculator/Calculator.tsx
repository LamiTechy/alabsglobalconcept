"use client";

import { useMemo, useState } from "react";
import {
  Calculator as CalcIcon,
  Plus,
  Trash2,
  Zap,
  Battery,
  Sun as SunIcon,
  Info,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  APPLIANCE_PRESETS,
  sizeSystem,
  estimatePriceRange,
  type ApplianceEntry,
} from "@/lib/solar";
import { submitCalculatorLead } from "@/lib/actions/leads";
import { Button } from "@/components/ui/Button";
import { cn, formatNaira } from "@/lib/utils";

type Row = ApplianceEntry & { selected: boolean };

const initialRows: Row[] = APPLIANCE_PRESETS.map((p) => ({
  key: p.key,
  name: p.name,
  watts: p.watts,
  hours: p.hours,
  qty: p.qty ?? 1,
  surge: p.surge ?? 1,
  selected: ["fan-standing", "bulb-led", "tv-32", "decoder", "router", "fridge-small"].includes(p.key),
}));

const steps = ["Appliances", "Backup & results", "Get your quote"];

export function Calculator() {
  const [step, setStep] = useState(0);
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [custom, setCustom] = useState<Row[]>([]);
  const [backupHours, setBackupHours] = useState(6);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [lead, setLead] = useState({ name: "", phone: "", email: "", location: "" });

  const selected = useMemo(() => rows.filter((r) => r.selected).concat(custom), [rows, custom]);
  const result = useMemo(() => sizeSystem(selected, backupHours), [selected, backupHours]);
  const priceRange = useMemo(() => estimatePriceRange(result), [result]);

  function updateRow(key: string, patch: Partial<Row>) {
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function addCustom() {
    setCustom((cs) => [
      ...cs,
      { key: `custom-${Date.now()}`, name: "Custom appliance", watts: 100, hours: 2, qty: 1, surge: 1, selected: true },
    ]);
  }

  function updateCustom(key: string, patch: Partial<Row>) {
    setCustom((cs) => cs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function removeCustom(key: string) {
    setCustom((cs) => cs.filter((r) => r.key !== key));
  }

  async function sendQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!lead.name || !lead.phone) {
      setFormMsg("Please enter your name and phone number.");
      return;
    }
    setSending(true);
    setFormMsg("");
    const res = await submitCalculatorLead({
      name: lead.name,
      phone: lead.phone,
      email: lead.email || undefined,
      location: lead.location || undefined,
      appliances: selected,
      totals: {
        dailyEnergyKwh: result.dailyEnergyKwh,
        surgeW: result.surgeW,
        continuousPeakW: result.continuousPeakW,
      },
      recommendation: {
        inverterKva: result.recommendedInverterKva,
        batteryKwh: result.batteryNameplateKwh,
        batteryUnits: result.batteryUnits,
        panelCount: result.panelCount,
        arrayKwp: result.arrayKwp,
        priceRange,
      },
      backupHours,
    });
    setSending(false);
    setSent(res.ok);
    setFormMsg(res.message);
  }

  const grouped = useMemo(() => {
    const groups = new Map<string, Row[]>();
    for (const r of rows) {
      const g = APPLIANCE_PRESETS.find((p) => p.key === r.key)?.group ?? "Other";
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(r);
    }
    return Array.from(groups.entries());
  }, [rows]);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
      {/* Stepper */}
      <div className="border-b border-slate-200 bg-deep-950 px-6 py-5">
        <ol className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs",
                  i === step
                    ? "bg-sun-400 text-deep-900"
                    : i < step
                      ? "bg-energy-500 text-white"
                      : "bg-white/10 text-white/60"
                )}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <span className={i === step ? "text-white" : "text-white/55"}>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* STEP 1 — appliances */}
      {step === 0 && (
        <div className="p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-deep-900">Select your appliances</h2>
          <p className="mt-1.5 text-sm text-muted">
            Tick everything you want solar to power. Adjust watts, quantity and daily hours to match your usage.
          </p>

          <div className="mt-6 space-y-8">
            {grouped.map(([group, items]) => (
              <fieldset key={group}>
                <legend className="text-xs font-bold uppercase tracking-widest text-sun-600">{group}</legend>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {items.map((r) => (
                    <label
                      key={r.key}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition",
                        r.selected
                          ? "border-sun-400 bg-sun-50/60"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={r.selected}
                        onChange={(e) => updateRow(r.key, { selected: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-sun-500 focus:ring-sun-400"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-deep-900">{r.name}</p>
                        {r.selected && (
                          <div className="mt-2 grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[0.65rem] font-bold uppercase text-muted">Watts</label>
                              <input
                                type="number"
                                min={1}
                                value={r.watts}
                                onChange={(e) => updateRow(r.key, { watts: Math.max(1, +e.target.value || 1) })}
                                className="mt-0.5 h-9 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-sun-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[0.65rem] font-bold uppercase text-muted">Qty</label>
                              <input
                                type="number"
                                min={1}
                                value={r.qty}
                                onChange={(e) => updateRow(r.key, { qty: Math.max(1, +e.target.value || 1) })}
                                className="mt-0.5 h-9 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-sun-400 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-[0.65rem] font-bold uppercase text-muted">Hrs/day</label>
                              <input
                                type="number"
                                min={0.1}
                                max={24}
                                step={0.5}
                                value={r.hours}
                                onChange={(e) =>
                                  updateRow(r.key, { hours: Math.min(24, Math.max(0.1, +e.target.value || 0.1)) })
                                }
                                className="mt-0.5 h-9 w-full rounded-lg border border-slate-300 px-2 text-sm focus:border-sun-400 focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {/* Custom appliances */}
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-widest text-sun-600">Custom appliances</legend>
              <div className="mt-3 space-y-3">
                {custom.map((r) => (
                  <div key={r.key} className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 p-4 sm:grid-cols-5">
                    <input
                      aria-label="Appliance name"
                      value={r.name}
                      onChange={(e) => updateCustom(r.key, { name: e.target.value })}
                      className="col-span-2 h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none sm:col-span-1"
                    />
                    <input
                      aria-label="Watts"
                      type="number"
                      min={1}
                      value={r.watts}
                      onChange={(e) => updateCustom(r.key, { watts: Math.max(1, +e.target.value || 1) })}
                      className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none"
                      placeholder="Watts"
                    />
                    <input
                      aria-label="Quantity"
                      type="number"
                      min={1}
                      value={r.qty}
                      onChange={(e) => updateCustom(r.key, { qty: Math.max(1, +e.target.value || 1) })}
                      className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none"
                      placeholder="Qty"
                    />
                    <input
                      aria-label="Hours per day"
                      type="number"
                      min={0.1}
                      max={24}
                      step={0.5}
                      value={r.hours}
                      onChange={(e) => updateCustom(r.key, { hours: Math.min(24, Math.max(0.1, +e.target.value || 0.1)) })}
                      className="h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-sun-400 focus:outline-none"
                      placeholder="Hrs/day"
                    />
                    <button
                      type="button"
                      onClick={() => removeCustom(r.key)}
                      className="col-span-2 inline-flex h-10 items-center justify-center gap-1 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 sm:col-span-5"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden /> Remove
                    </button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addCustom}>
                  <Plus className="h-4 w-4" aria-hidden /> Add custom appliance
                </Button>
              </div>
            </fieldset>
          </div>

          {/* Live totals */}
          <div className="mt-8 grid gap-4 rounded-2xl bg-surface p-5 sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Daily energy</p>
              <p className="mt-1 font-display text-2xl font-bold text-deep-900">{result.dailyEnergyKwh} kWh</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Peak surge</p>
              <p className="mt-1 font-display text-2xl font-bold text-deep-900">{result.surgeW.toLocaleString()} W</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Selected appliances</p>
              <p className="mt-1 font-display text-2xl font-bold text-deep-900">{selected.length}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button size="lg" onClick={() => setStep(1)} disabled={selected.length === 0}>
              Next: Backup & results <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2 — backup + results */}
      {step === 1 && (
        <div className="p-6 md:p-8">
          <h2 className="font-display text-xl font-bold text-deep-900">How long do you want backup?</h2>
          <p className="mt-1.5 text-sm text-muted">
            Drag the slider to set your target backup window (hours of battery power during an outage).
          </p>

          <div className="mt-6">
            <label htmlFor="backup-hours" className="sr-only">Backup hours</label>
            <input
              id="backup-hours"
              type="range"
              min={1}
              max={24}
              step={1}
              value={backupHours}
              onChange={(e) => setBackupHours(+e.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-sun-400"
            />
            <div className="mt-2 flex justify-between text-xs font-semibold text-muted">
              {[1, 6, 12, 18, 24].map((h) => (
                <span key={h} className={backupHours >= h ? "text-sun-600" : ""}>
                  {h}h
                </span>
              ))}
            </div>
            <p className="mt-3 text-center font-display text-3xl font-bold text-deep-900">
              {backupHours} hours of backup
            </p>
          </div>

          {/* Results */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sun-400/15 text-sun-600">
                <Zap className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">Inverter size</p>
              <p className="mt-1 font-display text-3xl font-bold text-deep-900">
                {result.recommendedInverterKva} kVA
              </p>
              <p className="mt-1 text-xs text-muted">{result.recommendedSystemVoltage}V system · pure sine wave</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-energy-500/15 text-energy-600">
                <Battery className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">Battery bank</p>
              <p className="mt-1 font-display text-3xl font-bold text-deep-900">{result.batteryNameplateKwh} kWh</p>
              <p className="mt-1 text-xs text-muted">
                {result.batteryUnits} × lithium module{result.batteryUnits > 1 ? "s" : ""} · usable {result.batteryUsableKwh} kWh
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-surface p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sun-400/15 text-sun-600">
                <SunIcon className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">Solar panels</p>
              <p className="mt-1 font-display text-3xl font-bold text-deep-900">
                {result.panelCount} × {result.panelUnitW}W
              </p>
              <p className="mt-1 text-xs text-muted">{result.arrayKwp} kWp array · needs ≈{result.panelWattageNeeded}W</p>
            </div>
          </div>

          {priceRange && (
            <div className="mt-6 rounded-2xl border border-sun-200 bg-sun-50 p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-wider text-sun-700">Indicative budget range</p>
              <p className="mt-1 font-display text-2xl font-bold text-deep-900">
                {formatNaira(priceRange.low)} – {formatNaira(priceRange.high)}
              </p>
              <p className="mt-1.5 text-xs text-muted">
                Ballpark only [CONFIRM_PRICING_LOGIC] — final pricing follows a site survey and brand selection.
              </p>
            </div>
          )}

          <details className="mt-6 rounded-2xl border border-slate-200 p-5">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-deep-900">
              <Info className="h-4 w-4 text-sun-500" aria-hidden /> How we calculated this
            </summary>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs text-muted">
              {result.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
              <li>
                Energy/day = Σ(watts × hours × qty). Inverter sized on surge × 1.1 ÷ power factor, rounded to a
                standard kVA step. Panels = daily kWh ÷ {4.5} peak sun hours ÷ 25% derate.
              </li>
            </ul>
          </details>

          <p className="mt-4 flex items-start gap-2 text-xs text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-sun-500" aria-hidden />
            <strong className="font-semibold text-deep-900">Disclaimer:</strong> This is an estimate for guidance
            only. Final system design, pricing and performance follow a professional site survey.
          </p>

          <div className="mt-6 flex justify-between">
            <Button type="button" variant="outline" onClick={() => setStep(0)}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back
            </Button>
            <Button size="lg" onClick={() => setStep(2)}>
              Send me this quote <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 — lead form */}
      {step === 2 && (
        <div className="p-6 md:p-8">
          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle2 className="mx-auto h-14 w-14 text-energy-500" aria-hidden />
              <h2 className="mt-4 font-display text-2xl font-bold text-deep-900">Your quote request is in!</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">{formMsg}</p>
              <Button type="button" variant="outline" className="mt-6" onClick={() => { setSent(false); setStep(0); }}>
                Start a new calculation
              </Button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-xl font-bold text-deep-900">Where should we send your quote?</h2>
              <p className="mt-1.5 text-sm text-muted">
                We&apos;ll contact you to confirm the design and schedule a free site survey.
              </p>
              <form onSubmit={sendQuote} className="mt-6 max-w-md space-y-4">
                <div>
                  <label htmlFor="calc-name" className="mb-1.5 block text-sm font-semibold text-deep-900">
                    Full name *
                  </label>
                  <input
                    id="calc-name"
                    value={lead.name}
                    onChange={(e) => setLead({ ...lead, name: e.target.value })}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
                    placeholder="e.g. Amina Yusuf"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="calc-phone" className="mb-1.5 block text-sm font-semibold text-deep-900">
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="calc-phone"
                    type="tel"
                    value={lead.phone}
                    onChange={(e) => setLead({ ...lead, phone: e.target.value })}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
                    placeholder="e.g. 0803 000 0000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="calc-email" className="mb-1.5 block text-sm font-semibold text-deep-900">
                    Email (optional)
                  </label>
                  <input
                    id="calc-email"
                    type="email"
                    value={lead.email}
                    onChange={(e) => setLead({ ...lead, email: e.target.value })}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="calc-location" className="mb-1.5 block text-sm font-semibold text-deep-900">
                    Location (area/city)
                  </label>
                  <input
                    id="calc-location"
                    value={lead.location}
                    onChange={(e) => setLead({ ...lead, location: e.target.value })}
                    className="h-12 w-full rounded-xl border border-slate-300 px-4 text-sm focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30"
                    placeholder="e.g. Lugbe, Abuja"
                  />
                </div>

                {formMsg && !sent && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{formMsg}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" aria-hidden /> Back
                  </Button>
                  <Button type="submit" size="lg" className="flex-1" disabled={sending}>
                    {sending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
                      </>
                    ) : (
                      <>
                        <CalcIcon className="h-4 w-4" aria-hidden /> Send my quote request
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}
