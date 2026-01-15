import sendMail from "./_sendMail.js";

export default async function handler(req, res) {
  try {
    const data = req.body;

    await sendMail(data);

    return res.status(200).json({
      success: true,
      message: "Booking sent successfully",
    });
  } catch (err) {
    console.error("Booking error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send booking",
    });
  }
}
