"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { quoteFormSchema, type QuoteFormInput } from "@/lib/validation";
import { submitQuoteForm } from "@/lib/actions/leads";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { whatsappLink } from "@/lib/site";

const inputCls =
  "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-deep-900 placeholder:text-slate-400 transition focus:border-sun-400 focus:outline-none focus:ring-2 focus:ring-sun-400/30";
const labelCls = "mb-1.5 block text-sm font-semibold text-deep-900";
const errorCls = "mt-1 text-xs font-medium text-red-600";

export function QuoteForm({ source = "quote_form" }: { source?: "quote_form" | "contact" }) {
  const [done, setDone] = useState(false);
  const [serverMsg, setServerMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<QuoteFormInput>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      preferredContact: "phone",
      propertyType: "residential",
      state: "FCT",
      city: "",
      name: "",
      phone: "",
      email: "",
      serviceNeeded: "",
      message: "",
      website: "",
    },
  });

  async function onSubmit(values: QuoteFormInput) {
    const res = await submitQuoteForm(values);
    if (res.ok) {
      setDone(true);
      setServerMsg(res.message);
      reset();
    } else {
      setServerMsg(res.message);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-energy-200 bg-energy-50 p-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-energy-500" aria-hidden />
        <h3 className="mt-4 font-display text-xl font-bold text-deep-900">Request received!</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">{serverMsg}</p>
        <div className="mx-auto mt-6 max-w-sm rounded-xl bg-white p-4 text-left text-sm">
          <p className="font-semibold text-deep-900">What happens next</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-muted">
            <li>We review your requirements (usually within a few hours).</li>
            <li>A team member calls or messages you to confirm details.</li>
            <li>We schedule a free site survey where needed.</li>
            <li>You receive a clear, itemised quote — no pressure.</li>
          </ol>
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setDone(false)}>
            Submit another request
          </Button>
          <Button
            variant="whatsapp"
            size="sm"
            onClick={() =>
              window.open(
                whatsappLink("Hello! I just submitted a quote request on your website."),
                "_blank"
              )
            }
          >
            Message us on WhatsApp
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${source}-name`} className={labelCls}>
            Full name *
          </label>
          <input id={`${source}-name`} className={inputCls} placeholder="e.g. Chinedu Okafor" {...register("name")} />
          {errors.name && <p className={errorCls}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor={`${source}-phone`} className={labelCls}>
            Phone number *
          </label>
          <input
            id={`${source}-phone`}
            type="tel"
            className={inputCls}
            placeholder="e.g. 0803 000 0000"
            {...register("phone")}
          />
          {errors.phone && <p className={errorCls}>{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${source}-email`} className={labelCls}>
            Email (optional)
          </label>
          <input
            id={`${source}-email`}
            type="email"
            className={inputCls}
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && <p className={errorCls}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor={`${source}-state`} className={labelCls}>
            State *
          </label>
          <input id={`${source}-state`} className={inputCls} placeholder="e.g. FCT" {...register("state")} />
          {errors.state && <p className={errorCls}>{errors.state.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${source}-city`} className={labelCls}>
            City / Area *
          </label>
          <input
            id={`${source}-city`}
            className={inputCls}
            placeholder="e.g. Gwarinpa, Abuja"
            {...register("city")}
          />
          {errors.city && <p className={errorCls}>{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor={`${source}-property`} className={labelCls}>
            Property type *
          </label>
          <select id={`${source}-property`} className={inputCls} {...register("propertyType")}>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="institutional">Institutional</option>
            <option value="estate">Estate</option>
            <option value="other">Other</option>
          </select>
          {errors.propertyType && <p className={errorCls}>{errors.propertyType.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${source}-service`} className={labelCls}>
            Service needed
          </label>
          <select id={`${source}-service`} className={inputCls} {...register("serviceNeeded")}>
            <option value="">Select…</option>
            <option>Residential solar installation</option>
            <option>Commercial / industrial solar</option>
            <option>Solar equipment supply</option>
            <option>Maintenance / repairs</option>
            <option>Solar street lights</option>
            <option>Solar water pumps</option>
            <option>Not sure yet</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${source}-spend`} className={labelCls}>
            Est. monthly power spend (₦)
          </label>
          <input
            id={`${source}-spend`}
            type="number"
            min={0}
            className={inputCls}
            placeholder="e.g. 80000"
            {...register("monthlySpend")}
          />
          {errors.monthlySpend && <p className={errorCls}>{errors.monthlySpend.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor={`${source}-pref`} className={labelCls}>
          Preferred contact method
        </label>
        <select id={`${source}-pref`} className={inputCls} {...register("preferredContact")}>
          <option value="phone">Phone call</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${source}-message`} className={labelCls}>
          Tell us about your power needs
        </label>
        <textarea
          id={`${source}-message`}
          rows={4}
          className={cn(inputCls, "h-auto py-3")}
          placeholder="Appliances you want to power, outage frequency, roof type, timeline…"
          {...register("message")}
        />
        {errors.message && <p className={errorCls}>{errors.message.message}</p>}
      </div>

      <p className="flex items-start gap-2 text-xs text-muted">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-energy-500" aria-hidden />
        Your details are used only to prepare your quote. We don&apos;t sell data. Attach your electricity bill or roof photos on WhatsApp after submitting.
      </p>

      {serverMsg && !done && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverMsg}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
          </>
        ) : (
          "Request My Free Quote"
        )}
      </Button>
    </form>
  );
}
