import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(data) {
  return await resend.emails.send({
    from: "L1 Gaming Cafe <onboarding@resend.dev>", // VERIFIED
    to: "lingesshwar@gmail.com", // YOUR GMAIL (TEST)

    subject: "New Booking Request – L1 Gaming Cafe",

    html: `
      <h2>New Booking Request</h2>
      <p><b>Name:</b> ${data.name}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Seat:</b> ${data.seatType}</p>
      <p><b>Date:</b> ${data.date}</p>
      <p><b>Time:</b> ${data.time}</p>
      <p><b>Duration:</b> ${data.duration} hours</p>
      <p><b>Players:</b> ${data.players}</p>
    `,
  });
}
