import "server-only";
import nodemailer from "nodemailer";

type LeadAlertInput = {
  name: string;
  phone: string;
  email?: string | null;
  location?: string | null;
  propertyType?: string | null;
  serviceNeeded?: string | null;
  monthlySpend?: number | null;
  preferredContact?: string | null;
  message?: string | null;
  source?: string;
  calculatorSummary?: string | null;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Sends a lead alert email via Brevo SMTP relay. Silently skips when
 * BREVO_SMTP_USER / BREVO_SMTP_PASS are unset so local development never
 * blocks form submissions.
 */
export async function sendLeadAlertEmail(input: LeadAlertInput): Promise<{ sent: boolean; error?: string }> {
  const user = process.env.BREVO_SMTP_USER;
  const pass = process.env.BREVO_SMTP_PASS;
  const from = process.env.BREVO_API_FROM || "Alabsglobalconcept <noreply@alabsglobalconcept.com>";
  const to = process.env.ADMIN_EMAIL_ALERTS || process.env.ADMIN_EMAIL;
  if (!user || !pass || !to) return { sent: false, error: "Brevo SMTP not configured" };

  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });

  const rows: Array<[string, string]> = [
    ["Name", input.name],
    ["Phone", input.phone],
    ["Email", input.email || "—"],
    ["Location", input.location || "—"],
    ["Property type", input.propertyType || "—"],
    ["Service needed", input.serviceNeeded || "—"],
    ["Monthly power spend", input.monthlySpend ? `₦${input.monthlySpend.toLocaleString()}` : "—"],
    ["Preferred contact", input.preferredContact || "—"],
    ["Source", input.source || "quote_form"],
    ["Message", input.message || "—"],
  ];
  if (input.calculatorSummary) rows.push(["Calculator details", input.calculatorSummary]);

  const html = `
  <div style="font-family:Inter,Arial,sans-serif;background:#F7F9FB;padding:24px">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #DBE2EA;overflow:hidden">
      <div style="background:#0B1F3A;color:#fff;padding:18px 24px">
        <strong style="font-size:16px">New lead — Alabsglobalconcept</strong>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827">
          ${rows
            .map(
              ([k, v]) => `
            <tr>
              <td style="padding:8px 0;color:#5A6678;width:40%">${escapeHtml(k)}</td>
              <td style="padding:8px 0"><strong>${escapeHtml(String(v))}</strong></td>
            </tr>`
            )
            .join("")}
        </table>
        <p style="margin-top:20px;font-size:12px;color:#5A6678">Reply directly or call the customer promptly — hot leads convert fastest.</p>
      </div>
    </div>
  </div>`;

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: input.email || undefined,
      subject: `New ${input.source === "calculator" ? "calculator" : "quote"} lead: ${input.name} (${input.phone})`,
      html,
    });
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
