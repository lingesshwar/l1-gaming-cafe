import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail({ to, subject, html }) {
  await resend.emails.send({
    from: "L1 Gaming Cafe <onboarding@resend.dev>",
    to,
    subject,
    html,
  });
}
