import sendMail from "./_sendMail.js";

export default async function handler(req, res) {
  try {
    const {
      seatType,
      date,
      time,
      duration,
      players,
      name,
      email,
    } = req.body;

    // 🔴 IMPORTANT: pass data correctly
    await sendMail({
      seatType,
      date,
      time,
      duration,
      players,
      name,
      email,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("BOOK API ERROR:", error);
    return res.status(500).json({ error: "Booking failed" });
  }
}
