import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(data) {
  return await resend.emails.send({
    from: "L1 Gaming Cafe <sec24sc020@sairamtap.edu.in>",
    to: process.env.STAFF_EMAIL,
    subject: `New booking – ${data.seatType.toUpperCase()} – ${data.date} ${data.time}`,

    html: `
      <div style="font-family: Arial, sans-serif; padding: 16px; color: #111;">
        <h2>🎮 New Booking Request</h2>
        <p><strong>L1 Gaming Cafe website</strong> received a new booking:</p>

        <table style="border-collapse: collapse; margin-top: 12px;">
          <tr><td><strong>Name:</strong></td><td>${data.name}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${data.email}</td></tr>
          <tr><td><strong>Seat type:</strong></td><td>${data.seatType.toUpperCase()}</td></tr>
          <tr><td><strong>Date:</strong></td><td>${data.date}</td></tr>
          <tr><td><strong>Start time:</strong></td><td>${data.time}</td></tr>
          <tr><td><strong>Duration:</strong></td><td>${data.duration} hours</td></tr>
          <tr><td><strong>Players:</strong></td><td>${data.players}</td></tr>
        </table>

        <p style="margin-top: 16px;">
          You can reply to this email to confirm with the guest.
        </p>
      </div>
    `,
  });
}
