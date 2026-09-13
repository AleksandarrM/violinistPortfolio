"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus({ kind: "loading" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.ok) {
        setStatus({
          kind: "error",
          message: payload.error ?? "Could not send your message.",
        });
        return;
      }

      form.reset();
      setStatus({
        kind: "success",
        message: "Thank you — your message is on its way.",
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Could not send your message. Please try email instead.",
      });
    }
  };

  return (
    <section className="contact" id="contact">
      <p className="contact__kicker">
        <span className="contact__line" />
        Get in touch
        <span className="contact__line" />
      </p>
      <h2 className="contact__title">Book a performance</h2>
      <p className="contact__intro">
        For bookings, collaborations, or press inquiries, reach out directly —
        every message is answered personally.
      </p>

      <form className="contact__form" onSubmit={onSubmit}>
        <label className="contact__hp">
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <label className="contact__field">
          <span className="contact__label">Name</span>
          <input
            className="contact__input"
            name="name"
            type="text"
            required
            maxLength={120}
          />
        </label>
        <label className="contact__field">
          <span className="contact__label">Email</span>
          <input
            className="contact__input"
            name="email"
            type="email"
            required
            maxLength={200}
          />
        </label>
        <label className="contact__field">
          <span className="contact__label">Message</span>
          <textarea
            className="contact__textarea"
            name="message"
            required
            minLength={10}
            maxLength={4000}
          />
        </label>
        <button
          className="contact__submit"
          type="submit"
          disabled={status.kind === "loading"}
        >
          {status.kind === "loading" ? "Sending…" : "Send message"}
        </button>
        {status.kind === "error" || status.kind === "success" ? (
          <p
            className={`contact__status is-${status.kind}`}
            role={status.kind === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        ) : null}
      </form>

      <a className="contact__email" href={`mailto:${site.email}`}>
        {site.email}
        <span className="contact__arrow">→</span>
      </a>
    </section>
  );
}
