import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

// Opt this single route into on-demand (server) rendering — every other
// route in the site stays static. See https://docs.astro.build/en/guides/on-demand-rendering/
export const prerender = false;

interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO_EMAIL?: string;
}

interface ContactPayload {
  name?: string;
  email?: string;
  eventType?: string;
  eventDate?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = (payload.name ?? "").trim();
  const email = (payload.email ?? "").trim();
  const eventType = (payload.eventType ?? "").trim();
  const eventDate = (payload.eventDate ?? "").trim();
  const message = (payload.message ?? "").trim();

  if (!name || !email || !message || !EMAIL_RE.test(email)) {
    return json({ error: "Please fill in your name, a valid email, and a message." }, 400);
  }

  const { RESEND_API_KEY, CONTACT_TO_EMAIL } = env as unknown as ContactEnv;

  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error("Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL not configured.");
    return json({ error: "Contact form is not configured yet." }, 500);
  }

  const emailBody = [
    `Name: ${name}`,
    `Email: ${email}`,
    eventType && `Event type: ${eventType}`,
    eventDate && `Event date: ${eventDate}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    // NOTE: the "from" address's domain must be verified in Resend before this
    // will send in production. Use Resend's onboarding@resend.dev sender to
    // test before your domain is verified — see README.
    body: JSON.stringify({
      from: "Neil Johnson Events Website <contact@neiljohnsonevents.com>",
      to: [CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `New inquiry from ${name}${eventType ? ` — ${eventType}` : ""}`,
      text: emailBody,
    }),
  });

  if (!res.ok) {
    console.error("Resend API error:", await res.text());
    return json({ error: "Failed to send message." }, 502);
  }

  return json({ ok: true });
};
