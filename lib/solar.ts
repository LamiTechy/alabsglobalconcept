/**
 * Solar system sizing engine.
 *
 * Formulas (documented per EN standards practice and tuned for Nigeria):
 *
 * 1. Daily energy (Wh/day)
 *      E = Σ (watts × hours × qty) per appliance
 *
 * 2. Peak surge (W)
 *      S = Σ (watts × surgeFactor × qty) for loads flagged with surge factors
 *      (compressors/motors: fridge 3×, AC 3.5×, pump 3× etc.)
 *      The inverter must exceed S with margin.
 *
 * 3. Inverter size (kVA)
 *      We take max(E_simultaneous_peak, S) and divide by power factor 0.9,
 *      then round UP to the next standard size: 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20 kVA.
 *
 * 4. Battery bank
 *      Usable energy needed (Wh) = E × (backupHours / average discharge window)
 *      Simpler model: assume the daily load is spread across the backup window,
 *      so required usable kWh ≈ E/1000 × (backupHours / 24 × cyclesAdjust).
 *      For outage-style use (all energy from battery each day), required
 *      usable ≈ E (one full day) scaled by autonomy days = backupHours/24 (min 0.5).
 *      Nameplate kWh = usable / DoD  (lithium DoD 0.8, tubular DoD 0.5)
 *      Battery count = ceil(nameplate / unit kWh) then reconcile to series/parallel
 *      config per system voltage (48V preferred for ≥3kVA).
 *
 * 5. Panel array (Wp)
 *      P = E (Wh/day) / (peakSunHours × derate)
 *      peakSunHours default 4.5 (Abuja conservative annual average; rainy-season
 *      designs may use 3.8). Derate 0.75 accounts for soiling, wiring, MPPT,
 *      temperature and mismatch.
 *      Panel count = ceil(P / 550) using 550W modules; rounded to even numbers
 *      for balanced strings.
 *
 * DISCLAIMER: estimates only — final design follows a site survey.
 */

export type AppliancePreset = {
  key: string;
  name: string;
  watts: number;
  hours: number;
  qty?: number;
  surge?: number;
  group: string;
};

/** Common Nigerian household/commercial presets with typical watts & daily hours */
export const APPLIANCE_PRESETS: AppliancePreset[] = [
  { key: "bulb-led", name: "LED Bulb (10W)", watts: 10, hours: 6, qty: 8, group: "Lighting" },
  { key: "bulb-cfl", name: "CFL Bulb (20W)", watts: 20, hours: 5, qty: 4, group: "Lighting" },
  { key: "streetlight-indoor", name: "Emergency/Rechargeable Bulb", watts: 5, hours: 4, qty: 2, group: "Lighting" },
  { key: "fan-standing", name: "Standing/Pedestal Fan", watts: 75, hours: 8, qty: 2, group: "Cooling" },
  { key: "fan-ceiling", name: "Ceiling Fan", watts: 60, hours: 8, qty: 2, group: "Cooling" },
  { key: "ac-1hp", name: "1HP Air Conditioner", watts: 1200, hours: 6, surge: 3.5, group: "Cooling" },
  { key: "ac-1.5hp", name: "1.5HP Air Conditioner", watts: 1600, hours: 6, surge: 3.5, group: "Cooling" },
  { key: "ac-2hp", name: "2HP Air Conditioner", watts: 2200, hours: 5, surge: 3.5, group: "Cooling" },
  { key: "tv-32", name: 'TV 32"', watts: 70, hours: 5, group: "Entertainment" },
  { key: "tv-43", name: 'TV 43"', watts: 100, hours: 5, group: "Entertainment" },
  { key: "decoder", name: "Satellite Decoder", watts: 25, hours: 5, group: "Entertainment" },
  { key: "sound", name: "Home Theatre / Sound System", watts: 150, hours: 3, group: "Entertainment" },
  { key: "router", name: "Wi-Fi Router/Modem", watts: 12, hours: 24, group: "Office" },
  { key: "laptop", name: "Laptop", watts: 65, hours: 6, group: "Office" },
  { key: "desktop", name: "Desktop Computer + Monitor", watts: 180, hours: 6, group: "Office" },
  { key: "printer", name: "Printer (inkjet)", watts: 30, hours: 0.5, group: "Office" },
  { key: "fridge-small", name: "Small Fridge", watts: 120, hours: 24, surge: 3, group: "Kitchen" },
  { key: "fridge-large", name: "Large Fridge/Freezer Combo", watts: 180, hours: 24, surge: 3, group: "Kitchen" },
  { key: "freezer", name: "Chest Freezer", watts: 200, hours: 24, surge: 3, group: "Kitchen" },
  { key: "microwave", name: "Microwave (900W)", watts: 1400, hours: 0.3, surge: 1.5, group: "Kitchen" },
  { key: "blender", name: "Blender", watts: 400, hours: 0.3, surge: 1.5, group: "Kitchen" },
  { key: "kettle", name: "Electric Kettle (2L)", watts: 2000, hours: 0.3, surge: 1.2, group: "Kitchen" },
  { key: "cooker-plate", name: "Electric Cooking Plate", watts: 2000, hours: 1, surge: 1.1, group: "Kitchen" },
  { key: "pump-small", name: "Water Pump (0.5–1HP)", watts: 750, hours: 1, surge: 3, group: "Water" },
  { key: "pump-sub", name: "Submersible Pump (1.5HP+)", watts: 1500, hours: 1, surge: 3, group: "Water" },
  { key: "iron", name: "Steam Iron", watts: 1200, hours: 0.5, surge: 1.1, group: "Appliances" },
  { key: "washer", name: "Washing Machine", watts: 500, hours: 1, surge: 2, group: "Appliances" },
  { key: "sewing", name: "Industrial Sewing Machine", watts: 250, hours: 6, surge: 2, group: "Business" },
  { key: "deep-freezer-shop", name: "Shop Display Freezer", watts: 300, hours: 24, surge: 3, group: "Business" },
  { key: "cctv", name: "CCTV System (NVR + cameras)", watts: 80, hours: 24, group: "Security" },
  { key: "gate-motor", name: "Electric Gate Motor", watts: 300, hours: 0.3, surge: 3, group: "Security" },
];

export type ApplianceEntry = {
  key: string;
  name: string;
  watts: number;
  hours: number;
  qty: number;
  surge?: number;
};

export type SizingResult = {
  dailyEnergyWh: number;
  dailyEnergyKwh: number;
  continuousPeakW: number;
  surgeW: number;
  recommendedInverterKva: number;
  recommendedSystemVoltage: 24 | 48;
  batteryNameplateKwh: number;
  batteryUsableKwh: number;
  batteryBankAh: number;
  batteryUnits: number;
  batteryUnitSpec: string;
  panelWattageNeeded: number;
  panelCount: number;
  panelUnitW: number;
  arrayKwp: number;
  backupHours: number;
  assumptions: string[];
};

const INVERTER_STEPS_KVA = [1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30];
const PANEL_UNIT_W = 550;
const PEAK_SUN_HOURS = 4.5; // Abuja conservative annual average
const DERATE = 0.75; // temperature, soiling, wiring, MPPT, mismatch
const LITHIUM_DOD = 0.8;
const POWER_FACTOR = 0.9;

function roundUpToStep(value: number, steps: number[]) {
  for (const s of steps) if (value <= s) return s;
  return steps[steps.length - 1]!;
}

export function sizeSystem(
  appliances: ApplianceEntry[],
  backupHours: number
): SizingResult {
  let dailyEnergyWh = 0;
  let continuousPeakW = 0;
  let surgeW = 0;
  const assumptions: string[] = [];

  for (const a of appliances) {
    const totalW = a.watts * a.qty;
    dailyEnergyWh += totalW * a.hours;
    // Peak simultaneous contribution (conservative: assume all could run together)
    continuousPeakW += totalW;
    const surgeFactor = a.surge && a.surge > 1 ? a.surge : 1;
    surgeW += totalW * surgeFactor;
  }

  // Inverter: worst of surge vs continuous, with PF headroom
  const inverterKvaRaw = Math.max(surgeW, continuousPeakW) / 1000 / POWER_FACTOR;
  const recommendedInverterKva = roundUpToStep(inverterKvaRaw * 1.1, INVERTER_STEPS_KVA);
  const recommendedSystemVoltage: 24 | 48 = recommendedInverterKva >= 3 ? 48 : 24;

  // Battery: cover the full daily energy from storage, plus autonomy scaling
  // Autonomy factor: backupHours beyond the "same-day" cycle adds extra capacity.
  // Same-day cycling ≈ full daily energy; each extra 12h of backup ≈ +50% day.
  const autonomyDays = Math.max(1, backupHours / 12); // 6h → 1, 12h → 1, 24h → 2, 48h → 4
  const usableKwhNeeded = (dailyEnergyWh / 1000) * autonomyDays;
  const batteryNameplateKwh = usableKwhNeeded / LITHIUM_DOD;

  // Unit selection: 48V 100Ah = 5.12kWh lithium modules for ≥3kVA; 12V 200Ah = 2.4kWh tubular-style below
  const lithiumUnitKwh = 5.12;
  const batteryUnits = Math.max(1, Math.ceil(batteryNameplateKwh / lithiumUnitKwh));
  const batteryBankAh = recommendedSystemVoltage === 48 ? 100 * batteryUnits : 200 * Math.ceil(batteryUnits / 2);

  // Panels
  const panelWattageNeeded = dailyEnergyWh / (PEAK_SUN_HOURS * DERATE);
  let panelCount = Math.ceil(panelWattageNeeded / PANEL_UNIT_W);
  if (panelCount % 2 !== 0) panelCount += 1; // even strings
  const arrayKwp = +((panelCount * PANEL_UNIT_W) / 1000).toFixed(2);

  assumptions.push(`Peak sun hours: ${PEAK_SUN_HOURS}h (Abuja average)`);
  assumptions.push(`System derate: ${Math.round((1 - DERATE) * 100)}% for temperature, soiling & wiring losses`);
  assumptions.push(`Battery depth of discharge: ${Math.round(LITHIUM_DOD * 100)}% (lithium)`);
  assumptions.push(`Power factor: ${POWER_FACTOR}`);
  assumptions.push(`Backup window: ${backupHours}h (≈ ${autonomyDays.toFixed(1)} day(s) of autonomy)`);

  return {
    dailyEnergyWh: Math.round(dailyEnergyWh),
    dailyEnergyKwh: +(dailyEnergyWh / 1000).toFixed(2),
    continuousPeakW: Math.round(continuousPeakW),
    surgeW: Math.round(surgeW),
    recommendedInverterKva,
    recommendedSystemVoltage,
    batteryNameplateKwh: +batteryNameplateKwh.toFixed(2),
    batteryUsableKwh: +usableKwhNeeded.toFixed(2),
    batteryBankAh,
    batteryUnits,
    batteryUnitSpec: `${recommendedSystemVoltage}V lithium modules ≈ ${lithiumUnitKwh}kWh each`,
    panelWattageNeeded: Math.round(panelWattageNeeded),
    panelCount,
    panelUnitW: PANEL_UNIT_W,
    arrayKwp,
    backupHours,
    assumptions,
  };
}

/** Rough Naira estimate range — [CONFIRM_PRICING_LOGIC] before production launch. */
export function estimatePriceRange(result: SizingResult): { low: number; high: number } | null {
  // Placeholder ballpark: ₦1.1M–1.5M per kWh of storage + ₦280k–400k per kWp of panels + inverter tier.
  // These are order-of-magnitude placeholders only — always request a real quote.
  const storage = result.batteryNameplateKwh * 1_100_000;
  const panels = result.arrayKwp * 320_000;
  const inverter = result.recommendedInverterKva * 350_000;
  const base = storage + panels + inverter;
  return {
    low: Math.round((base * 0.9) / 50_000) * 50_000,
    high: Math.round((base * 1.25) / 50_000) * 50_000,
  };
}
