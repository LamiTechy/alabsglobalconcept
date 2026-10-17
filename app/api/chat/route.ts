import { NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { CHAT_SYSTEM_PROMPT } from "@/lib/ai-chat";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MAX_HISTORY = 12;
const MAX_CONTENT_LENGTH = 2000;

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI chat is not configured yet. Please use WhatsApp or the contact form." },
      { status: 503 }
    );
  }

  const ip = clientIp(request);
  const limited = rateLimit(`ai-chat:${ip}`, 15, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: `Too many messages — try again in ${limited.retryAfterSeconds}s.` },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > 20) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages: ChatMessage[] = [];
  for (const item of rawMessages.slice(-MAX_HISTORY)) {
    if (!item || typeof item !== "object") continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if (
      (role === "user" || role === "assistant") &&
      typeof content === "string" &&
      content.trim().length > 0 &&
      content.length <= MAX_CONTENT_LENGTH
    ) {
      messages.push({ role, content: content.slice(0, MAX_CONTENT_LENGTH) });
    }
  }

  if (messages.length === 0 || messages[messages.length - 1]!.role !== "user") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
        messages: [{ role: "system", content: CHAT_SYSTEM_PROMPT }, ...messages],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!res.ok) {
      console.error("[ai-chat] Groq error:", res.status, await res.text());
      return NextResponse.json(
        { error: "The AI assistant is busy right now — please try again shortly." },
        { status: 502 }
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json(
        { error: "The AI assistant returned an empty reply — please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[ai-chat] fetch failed:", err);
    return NextResponse.json(
      { error: "Could not reach the AI service — please try again." },
      { status: 502 }
    );
  }
}
