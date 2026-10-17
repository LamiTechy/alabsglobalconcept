import { z } from "zod";

export const leadSourceEnum = z.enum(["quote_form", "calculator", "contact", "whatsapp"]);
export const propertyTypeEnum = z.enum([
  "residential",
  "commercial",
  "industrial",
  "institutional",
  "estate",
  "other",
]);
export const preferredContactEnum = z.enum(["phone", "whatsapp", "email"]);

export const quoteFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name").max(160),
  phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[\d\s+\-()]+$/, "Phone can only contain digits and + - ( )"),
  email: z.string().email("Enter a valid email").max(255).optional().or(z.literal("")),
  state: z.string().min(2, "Enter your state").max(80),
  city: z.string().min(2, "Enter your city/area").max(120),
  propertyType: propertyTypeEnum,
  serviceNeeded: z.string().max(160).optional().or(z.literal("")),
  monthlySpend: z.coerce
    .number()
    .int("Enter a whole number")
    .min(0)
    .max(100_000_000)
    .optional()
    .or(z.nan())
    .optional(),
  preferredContact: preferredContactEnum.default("phone"),
  message: z.string().max(3000).optional().or(z.literal("")),
  /** Honeypot — must stay empty */
  website: z.string().max(0, "Invalid submission").optional().or(z.literal("")),
});

export type QuoteFormInput = z.input<typeof quoteFormSchema>;
export type QuoteFormOutput = z.output<typeof quoteFormSchema>;

export const contactFormSchema = quoteFormSchema;
export type ContactFormInput = z.input<typeof contactFormSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const leadStatusEnum = z.enum([
  "new",
  "contacted",
  "site_survey",
  "quoted",
  "won",
  "lost",
]);

export const updateLeadSchema = z.object({
  id: z.string().min(1),
  status: leadStatusEnum.optional(),
  note: z.string().max(2000).optional(),
});

// --- Calculator -------------------------------------------------------------
export const applianceEntrySchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1).max(120),
  watts: z.number().positive().max(50000),
  hours: z.number().positive().max(24),
  qty: z.number().int().positive().max(50).default(1),
  surge: z.number().min(0).max(10).default(1),
});

export const calculatorSchema = z.object({
  appliances: z.array(applianceEntrySchema).min(1, "Select at least one appliance"),
  backupHours: z.number().min(1).max(48).default(6),
  gridChargesBattery: z.boolean().default(false),
});

export type CalculatorInput = z.infer<typeof calculatorSchema>;
