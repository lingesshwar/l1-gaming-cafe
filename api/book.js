export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  // ✅ TEMP SUCCESS RESPONSE (EMAIL DISABLED)
  return res.status(200).json({
    ok: true,
    message: "Booking received successfully",
  });
}
