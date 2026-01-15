import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendMail(data) {
  return await resend.emails.send({
    from: "L1 Gaming Cafe <onboarding@resend.dev>",
    to: "lingesshwar@gmail.com",

    subject: `New booking – ${data.seatType?.toUpperCase()} – ${data.date} ${data.time}`,

    html: `
      <div style="font-family: Arial, sans-serif; padding: 16px;">
        <h2>New booking request from L1 Gaming Cafe</h2>

        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Seat type:</b> ${data.seatType?.toUpperCase()}</p>
        <p><b>Date:</b> ${data.date}</p>
        <p><b>Start time:</b> ${data.time}</p>
        <p><b>Duration:</b> ${data.duration} hours</p>
        <p><b>Players:</b> ${data.players}</p>

        <p style="margin-top:16px;">
          You can reply to this email to confirm with the guest.
        </p>
      </div>
    `,
  });
}
