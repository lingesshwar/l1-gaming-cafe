// Simple backend for L1 Gaming Cafe – handles booking/contact/newsletter emails

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files (HTML, CSS, JS) from the current directory
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(__dirname));

const PORT = process.env.PORT || 4000;


// Configure mail transport using environment variables
// Make sure to provide at least SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and STAFF_EMAIL
const requiredEnv = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "STAFF_EMAIL",
];

const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) {
  console.warn(
    "[L1] Warning: missing env vars for email transport:",
    missing.join(", ")
  );
}

const transporter =
  missing.length === 0
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 465,
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for others
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })
    : null;

async function sendMail(options) {
  if (!transporter) {
    console.error("[L1] Transporter not configured – email not sent.");
    throw new Error("Email service not configured on server");
  }
  return transporter.sendMail(options);
}

// Routes

app.get("/health", (req, res) => {
  res.json({ ok: true, message: "L1 Gaming Cafe backend up" });
});

// Booking email
app.post("/api/book", async (req, res) => {
  const { date, time, duration, seatType, players, name, email } = req.body || {};

  if (!date || !time || !duration || !seatType || !players || !name || !email) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  const seatLabel = seatType.toUpperCase();
  const subject = `New booking – ${seatLabel} – ${date} ${time} – ${name}`;

  const text = [
    `New booking request from L1 Gaming Cafe website:`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Seat type: ${seatLabel}`,
    `Date: ${date}`,
    `Start time: ${time}`,
    `Duration: ${duration} hours`,
    `Players: ${players}`,
    "",
    "You can reply to this email to confirm with the guest.",
  ].join("\n");

  try {
    await sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.STAFF_EMAIL,
      subject,
      text,
      replyTo: email,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("[L1] Error sending booking mail:", err);
    res
      .status(500)
      .json({ ok: false, error: "Failed to send booking email to staff." });
  }
});

// Contact form email
app.post("/api/contact", async (req, res) => {
  const { name, email, subject, phone, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  const mailSubject = `Contact form – ${subject || "General"} – ${name}`;
  const text = [
    `New message from L1 Gaming Cafe contact form:`,
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    "",
    "Message:",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.STAFF_EMAIL,
      subject: mailSubject,
      text,
      replyTo: email,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("[L1] Error sending contact mail:", err);
    res
      .status(500)
      .json({ ok: false, error: "Failed to send contact email to staff." });
  }
});

// Newsletter registration – just forwards the email to staff for now
app.post("/api/newsletter", async (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ ok: false, error: "Email is required" });
  }

  const subject = `New newsletter signup – ${email}`;
  const text = `A user subscribed to the L1 Gaming Cafe newsletter: ${email}`;

  try {
    await sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.STAFF_EMAIL,
      subject,
      text,
      replyTo: email,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("[L1] Error sending newsletter mail:", err);
    res
      .status(500)
      .json({ ok: false, error: "Failed to register newsletter email." });
  }
});

app.listen(PORT, () => {
  console.log(`[L1] Backend listening on http://localhost:${PORT}`);
});
