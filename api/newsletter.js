import sendMail from "./_sendMail.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  try {
    await sendMail({
      to: process.env.STAFF_EMAIL,
      subject: "New Newsletter Signup",
      html: `<p>Email: ${req.body.email}</p>`,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false });
  }
}
