import sendMail from "./_sendMail.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  try {
    await sendMail({
      subject: "Newsletter Signup",
      html: `<p>${req.body.email}</p>`,
    });

    res.status(200).json({ ok: true });
  } catch {
    res.status(500).json({ ok: false });
  }
}
