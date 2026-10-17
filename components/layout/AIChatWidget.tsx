"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, X, Send, MessageCircle } from "lucide-react";
import { whatsappLink, DEFAULT_WHATSAPP_MESSAGE } from "@/lib/site";
import { cn } from "@/lib/utils";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "How much does a 5kVA system cost?",
  "Do you install CCTV cameras?",
  "What areas do you serve?",
];

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-ai-chat", onOpen);
    return () => window.removeEventListener("open-ai-chat", onOpen);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError(null);
    setInput("");
    const next: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setBusy(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12) }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error || "Something went wrong — please try again.");
      } else {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply! }]);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with our AI assistant"
        aria-expanded={open}
        className={cn(
          "fixed bottom-24 right-4 z-50 inline-flex items-center gap-2.5 rounded-full py-3 pl-4 pr-5 text-sm font-semibold shadow-card-hover transition hover:scale-[1.03] md:bottom-6 md:right-6",
          open ? "bg-deep-800 text-white" : "bg-deep-900 text-sun-400 hover:bg-deep-800"
        )}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <span className="relative">
            <Bot className="h-5 w-5" aria-hidden />
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 animate-pulse rounded-full bg-sun-400" aria-hidden />
          </span>
        )}
        <span className="hidden sm:inline">
          {open ? "Close" : "Need fast reply? Chat with AI"}
        </span>
        <span className="sm:hidden">{open ? "Close" : "Chat with AI"}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-44 right-4 z-50 flex h-[26rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card-hover md:bottom-24 md:right-6">
          <div className="flex items-center gap-3 bg-deep-950 px-4 py-3.5 text-white">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sun-400/15 text-sun-400">
              <Bot className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="font-display text-sm font-bold">AI Assistant</p>
              <p className="text-xs text-white/60">Answers about solar &amp; CCTV in Abuja</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4.5 w-4.5" aria-hidden />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-muted">
                  Hi! I can answer questions about our solar and CCTV services, sizing, delivery
                  and how to get started. What would you like to know?
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-deep-900 transition hover:border-sun-400 hover:text-sun-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "ml-auto rounded-br-md bg-deep-900 text-white"
                    : "rounded-bl-md border border-slate-200 bg-white text-muted"
                )}
              >
                {m.content}
              </div>
            ))}
            {busy && (
              <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-3">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                    style={{ animationDelay: `${d * 0.15}s` }}
                    aria-hidden
                  />
                ))}
              </div>
            )}
            {error && (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                {error}
              </p>
            )}
          </div>

          <div className="border-t border-slate-100 bg-white px-4 py-2.5">
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-energy-600 hover:text-energy-700"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Need a quote? WhatsApp us instead →
            </a>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about solar or CCTV…"
              maxLength={500}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-surface px-3.5 py-2.5 text-sm text-deep-900 placeholder:text-slate-400 focus:border-sun-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-deep-900 text-sun-400 transition hover:bg-deep-800 disabled:opacity-40"
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
