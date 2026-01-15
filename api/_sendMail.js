import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(data) {
  return await resend.emails.send({
    from: "L1 Gaming Cafe <onboarding@resend.dev>",
    to: process.env.STAFF_EMAIL,

    subject: "New Booking Request",

    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Booking Request</h2>

        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Seat Type:</strong> ${data.seatType}</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
        <p><strong>Duration:</strong> ${data.duration} hours</p>
        <p><strong>Players:</strong> ${data.players}</p>
      </div>
    `,
  });
}
