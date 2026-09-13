export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export type ContactBody = ContactPayload & {
  website?: string;
};

export type ParseContactResult =
  | { ok: true; honeypot: true }
  | { ok: true; honeypot: false; data: ContactPayload }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

export function parseContact(body: unknown): ParseContactResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request." };
  }

  const record = body as Record<string, unknown>;
  const website = asString(record.website).trim();
  if (website) {
    return { ok: true, honeypot: true };
  }

  const name = asString(record.name).trim();
  const email = asString(record.email).trim();
  const message = asString(record.message).trim();

  if (!name || name.length > 120) {
    return { ok: false, error: "Please enter your name." };
  }
  if (!email || email.length > 200 || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (!message || message.length < 10) {
    return { ok: false, error: "Please write a short message." };
  }
  if (message.length > 4000) {
    return { ok: false, error: "Message is too long." };
  }

  return { ok: true, honeypot: false, data: { name, email, message } };
}
