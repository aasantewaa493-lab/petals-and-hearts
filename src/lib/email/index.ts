import { getEnv } from "@/lib/env";

export type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(message: EmailMessage) {
  const env = getEnv();
  if (!env.resendApiKey) {
    console.info("[email:dev]", message.subject, "→", message.to);
    return { delivered: false, reason: "EMAIL_PROVIDER_NOT_CONFIGURED" as const };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    }),
  });
  if (!response.ok) {
    throw new Error("The email provider rejected this message.");
  }
  return { delivered: true as const };
}

export function orderEmail(input: {
  to: string;
  reference: string;
  title: string;
  intro: string;
  total: string;
}) {
  return {
    to: input.to,
    subject: `${input.title} — ${input.reference}`,
    text: `${input.intro}\n\nOrder ${input.reference}\nTotal ${input.total}\n`,
    html: `<div style="font-family:Georgia,serif;color:#241C29;padding:24px">
      <h1 style="color:#43135F">${input.title}</h1>
      <p>${input.intro}</p>
      <p>Reference <strong>${input.reference}</strong></p>
      <p>Total <strong>${input.total}</strong></p>
    </div>`,
  };
}
