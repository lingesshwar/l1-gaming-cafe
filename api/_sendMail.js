import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(data) {
  const seat = data.seatType?.toUpperCase() || "UNKNOWN";

  return await resend.emails.send({
    from: "L1 Gaming Cafe <sec24sc020@sairamtap.edu.in>",
    to: process.env.STAFF_EMAIL,

    subject: `New booking – ${seat} – ${data.date} ${data.time}`,

    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #111;">
        <h2 style="margin-bottom: 8px;">🎮 New Booking Request</h2>
        <p style="margin-top: 0;">
          New booking request from <strong>L1 Gaming Cafe</strong> website:
        </p>

        <table style="margin-top: 16px; border-collapse: collapse;">
          <tr><td><strong>Name:</strong></td><td style="padding-left:8px;">${data.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td style="padding-left:8px;">${data.email}</td></tr>
          <tr><td><strong>Seat type:</strong></td><td style="padding-left:8px;">${seat}</td></tr>
          <tr><td><strong>Date:</strong></td><td style="padding-left:8px;">${data.date}</td></tr>
          <tr><td><strong>Start time:</strong></td><td style="padding-left:8px;">${data.time}</td></tr>
          <tr><td><strong>Duration:</strong></td><td style="padding-left:8px;">${data.duration} hours</td></tr>
          <tr><td><strong>Players:</strong></td><td style="padding-left:8px;">${data.players}</td></tr>
        </table>

        <p style="margin-top: 20px;">
          You can reply to this email to confirm with the guest.
        </p>
      </div>
    `,
  });
}
