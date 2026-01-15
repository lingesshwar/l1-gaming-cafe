import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail({ subject, html }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing");
  }

  return await resend.emails.send({
    from: "L1 Gaming Cafe <onboarding@resend.dev>",
    to: [process.env.STAFF_EMAIL],
    subject,
    html,
  });
}
