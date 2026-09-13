import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { parseContact } from "@/lib/contact-schema";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function allow(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return false;
  }
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

export async function POST(request: NextRequest) {
  if (!allow(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "Please wait before sending another message." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const parsed = parseContact(body);
  if (!parsed.ok) {
    return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  }
  if (parsed.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Email is not configured yet. Use the address below, or add RESEND_API_KEY and CONTACT_TO.",
      },
      { status: 503 },
    );
  }

  const { name, email, message } = parsed.data;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Booking · ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "Could not deliver your message." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Could not deliver your message." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
