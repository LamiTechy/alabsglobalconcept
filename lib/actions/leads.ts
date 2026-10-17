"use server";

import { headers } from "next/headers";
import { db } from "@/db";
import { schema } from "@/db";
import { quoteFormSchema, type QuoteFormInput } from "@/lib/validation";
import { sendLeadAlertEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export type ActionResult = {
  ok: boolean;
  message: string;
  id?: string;
  errors?: Record<string, string[]>;
};

function fieldErrors(err: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }) {
  const flat = err.flatten().fieldErrors;
  const out: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(flat)) if (v) out[k] = v;
  return out;
}

function requestIp(): string {
  try {
    const h = headers();
    const fwd = h.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]!.trim();
    return h.get("x-real-ip") || "unknown";
  } catch {
    return "unknown";
  }
}

export async function submitQuoteForm(rawInput: QuoteFormInput): Promise<ActionResult> {
  return submitLead(rawInput, "quote_form");
}

export async function submitLead(
  rawInput: QuoteFormInput,
  source: "quote_form" | "contact" | "whatsapp" = "quote_form",
  calculatorPayload?: unknown
): Promise<ActionResult> {
  if (rawInput.website) {
    return { ok: true, message: "Thanks! We'll be in touch shortly." };
  }

  const ip = requestIp();
  const limit = rateLimit(`lead:${ip}`);
  if (!limit.ok) {
    return {
      ok: false,
      message: `Too many submissions. Please try again in ${limit.retryAfterSeconds}s or reach us on WhatsApp.`,
    };
  }

  const parsed = quoteFormSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the errors below.", errors: fieldErrors(parsed.error) };
  }

  const data = parsed.data;
  const monthlySpend =
    typeof data.monthlySpend === "number" && !Number.isNaN(data.monthlySpend)
      ? Math.round(data.monthlySpend)
      : null;

  let leadId: string | undefined;
  try {
    if (db) {
      const [row] = await db
        .insert(schema.leads)
        .values({
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          state: data.state,
          city: data.city,
          propertyType: data.propertyType,
          serviceNeeded: data.serviceNeeded || null,
          monthlySpend,
          preferredContact: data.preferredContact,
          message: data.message || null,
          status: "new",
          source,
          calculatorPayload: calculatorPayload ?? null,
        })
        .returning({ id: schema.leads.id });
      leadId = row?.id;
    } else {
      leadId = `local-${Date.now()}`;
      console.info("[lead:local]", { ...data, source, leadId });
    }
  } catch (err) {
    console.error("Lead insert failed", err);
    return {
      ok: false,
      message: "We couldn't save your request right now. Please try WhatsApp or call us.",
    };
  }

  // Fire-and-forget email alert; never block the user
  void sendLeadAlertEmail({
    name: data.name,
    phone: data.phone,
    email: data.email,
    location: `${data.city}, ${data.state}`,
    propertyType: data.propertyType,
    serviceNeeded: data.serviceNeeded,
    monthlySpend,
    preferredContact: data.preferredContact,
    message: data.message,
    source,
    calculatorSummary: calculatorPayload
      ? JSON.stringify(calculatorPayload).slice(0, 1500)
      : null,
  })
    .then((r) => console.info(`[lead-alert] sent=${r.sent}${r.error ? ` error=${r.error}` : ""}`))
    .catch((err) => console.error("[lead-alert] failed", err));

  return {
    ok: true,
    id: leadId,
    message:
      "Request received! Our team will contact you shortly. For faster response, message us on WhatsApp.",
  };
}

export async function submitCalculatorLead(input: {
  name: string;
  phone: string;
  email?: string;
  location?: string;
  appliances: unknown;
  totals: unknown;
  recommendation: unknown;
  backupHours: number;
}): Promise<ActionResult> {
  const limit = rateLimit(`calc:${input.phone}`);
  if (!limit.ok) {
    return { ok: false, message: `Too many submissions. Try again in ${limit.retryAfterSeconds}s.` };
  }

  try {
    if (db) {
      await db.insert(schema.calculatorSubmissions).values({
        name: input.name || null,
        phone: input.phone,
        email: input.email || null,
        location: input.location || null,
        appliances: input.appliances as never,
        totals: input.totals as never,
        recommendation: input.recommendation as never,
        backupHours: input.backupHours,
      });
      await db.insert(schema.leads).values({
        name: input.name || "Calculator user",
        phone: input.phone,
        email: input.email || null,
        city: input.location || null,
        state: "FCT",
        propertyType: "residential",
        serviceNeeded: "Solar system (from calculator)",
        message: `Calculator recommendation sent. Backup target: ${input.backupHours}h.`,
        status: "new",
        source: "calculator",
        calculatorPayload: {
          appliances: input.appliances,
          totals: input.totals,
          recommendation: input.recommendation,
        } as never,
      });
    } else {
      console.info("[calculator:local]", input);
    }
  } catch (err) {
    console.error("Calculator lead failed", err);
    return { ok: false, message: "Couldn't save your request. Please try again or contact us." };
  }

  void sendLeadAlertEmail({
    name: input.name || "Calculator user",
    phone: input.phone,
    email: input.email,
    location: input.location,
    serviceNeeded: "Solar system (from calculator)",
    preferredContact: "phone",
    source: "calculator",
    message: `Backup target ${input.backupHours}h`,
    calculatorSummary: JSON.stringify({
      totals: input.totals,
      recommendation: input.recommendation,
    }).slice(0, 1500),
  })
    .then((r) => console.info(`[lead-alert] sent=${r.sent}${r.error ? ` error=${r.error}` : ""}`))
    .catch((err) => console.error("[lead-alert] failed", err));

  return {
    ok: true,
    message: "Your quote request is in! We'll contact you to confirm the design after a site survey.",
  };
}

export async function subscribeNewsletter(email: string): Promise<ActionResult> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }
  // [CONFIRM] wire to your ESP; logged for now
  console.info("[newsletter]", email);
  return { ok: true, message: "You're subscribed. Thank you!" };
}

// Calculator schema lives in lib/validation.ts for shared client/server use.
