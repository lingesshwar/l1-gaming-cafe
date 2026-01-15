import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(data) {
  const seat = (data.seatType || "UNKNOWN").toUpperCase();

  await resend.emails.send({
    from: "L1 Gaming Cafe <onboarding@resend.dev>",
    to: process.env.STAFF_EMAIL,
    subject: `New booking – ${seat} – ${data.date} ${data.time}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #111;">
        <h2>🎮 New booking request</h2>

        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Seat type:</strong> ${seat}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Start time:</strong> ${data.time}</p>
        <p><strong>Duration:</strong> ${data.duration} hours</p>
        <p><strong>Players:</strong> ${data.players}</p>

        <p style="margin-top: 16px;">
          You can reply to this email to confirm with the guest.
        </p>
      </div>
    `,
  });
}
