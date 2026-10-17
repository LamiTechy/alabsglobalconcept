DO $$ BEGIN
 CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'site_survey', 'quoted', 'won', 'lost');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."property_type" AS ENUM('residential', 'commercial', 'industrial', 'institutional', 'estate', 'other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."lead_source" AS ENUM('quote_form', 'calculator', 'contact', 'whatsapp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "admins" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" varchar(32) DEFAULT 'admin' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blog_posts" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" varchar(240) NOT NULL,
	"slug" varchar(260) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"cover_image" text,
	"author" varchar(160) DEFAULT 'Alabsglobalconcept',
	"tags" jsonb DEFAULT '[]'::jsonb,
	"published" boolean DEFAULT true NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "calculator_submissions" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" varchar(160),
	"phone" varchar(40),
	"email" varchar(255),
	"location" varchar(160),
	"appliances" jsonb,
	"totals" jsonb,
	"recommendation" jsonb,
	"backup_hours" integer,
	"converted_to_lead_id" varchar(36),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "faqs" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"category" varchar(80) DEFAULT 'general',
	"published" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lead_notes" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"lead_id" varchar(36) NOT NULL,
	"body" text NOT NULL,
	"author" varchar(120) DEFAULT 'admin',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "leads" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" varchar(160) NOT NULL,
	"phone" varchar(40) NOT NULL,
	"email" varchar(255),
	"state" varchar(80),
	"city" varchar(120),
	"property_type" "property_type" DEFAULT 'residential' NOT NULL,
	"service_needed" varchar(160),
	"monthly_spend" integer,
	"preferred_contact" varchar(20) DEFAULT 'phone',
	"message" text,
	"file_url" text,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"source" "lead_source" DEFAULT 'quote_form' NOT NULL,
	"calculator_payload" jsonb,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_categories" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"description" text,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(220) NOT NULL,
	"category_id" varchar(36),
	"brand" varchar(120),
	"capacity" varchar(80),
	"short_description" text,
	"description" text,
	"features" jsonb DEFAULT '[]'::jsonb,
	"specs" jsonb DEFAULT '{}'::jsonb,
	"warranty" varchar(160),
	"price_naira" integer,
	"show_price" boolean DEFAULT false NOT NULL,
	"image_url" text,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"featured" boolean DEFAULT false NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"title" varchar(220) NOT NULL,
	"slug" varchar(240) NOT NULL,
	"category" varchar(40) DEFAULT 'residential' NOT NULL,
	"location" varchar(160),
	"system_size_kw" text,
	"equipment" jsonb DEFAULT '[]'::jsonb,
	"challenge" text,
	"solution" text,
	"summary" text,
	"cover_image" text,
	"gallery" jsonb DEFAULT '[]'::jsonb,
	"testimonial" text,
	"testimonial_author" varchar(160),
	"featured" boolean DEFAULT false NOT NULL,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "site_settings" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'singleton' NOT NULL,
	"announcement_text" text,
	"announcement_link" text,
	"announcement_enabled" boolean DEFAULT false NOT NULL,
	"hero_headline" text,
	"hero_subheadline" text,
	"stat_projects" integer,
	"stat_clients" integer,
	"stat_kw_installed" integer,
	"stat_years" integer,
	"contact_phone" varchar(40),
	"contact_whatsapp" varchar(40),
	"contact_email" varchar(255),
	"contact_address" text,
	"business_hours" varchar(120),
	"social_instagram" text,
	"social_facebook" text,
	"social_x" text,
	"social_linkedin" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "testimonials" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
	"name" varchar(160) NOT NULL,
	"location" varchar(160),
	"system_size" varchar(80),
	"quote" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "calculator_submissions" ADD CONSTRAINT "calculator_submissions_converted_to_lead_id_leads_id_fk" FOREIGN KEY ("converted_to_lead_id") REFERENCES "public"."leads"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lead_notes" ADD CONSTRAINT "lead_notes_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "products" ADD CONSTRAINT "products_category_id_product_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "admins_email_idx" ON "admins" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blog_published_idx" ON "blog_posts" USING btree ("published");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "calc_subs_created_idx" ON "calculator_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lead_notes_lead_idx" ON "lead_notes" USING btree ("lead_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_status_idx" ON "leads" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "leads_created_at_idx" ON "leads" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "products_featured_idx" ON "products" USING btree ("featured");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "projects_category_idx" ON "projects" USING btree ("category");