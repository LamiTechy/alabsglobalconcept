import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(16).optional(),
  JWT_EXPIRES_IN: z.coerce.number().int().positive().default(604800),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  BREVO_SMTP_HOST: z.string().optional(),
  BREVO_SMTP_PORT: z.coerce.number().int().positive().default(587),
  BREVO_SMTP_USER: z.string().optional(),
  BREVO_SMTP_PASS: z.string().optional(),
  BREVO_API_FROM: z.string().optional(),
  ADMIN_EMAIL_ALERTS: z.string().email().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.warn("⚠️  Invalid environment variables:", parsed.error.flatten().fieldErrors);
}

export const env = parsed.success ? parsed.data : ({} as z.infer<typeof envSchema>);

export const isDbConfigured = Boolean(process.env.DATABASE_URL);
