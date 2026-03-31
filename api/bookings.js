import Database from 'better-sqlite3';
import path from 'path';
import { Resend } from 'resend';

const dbPath = process.env.RENDER ? "/data/cafe.db" : "/tmp/cafe.db";
const db = new Database(dbPath);

// Email Setup (Resend)
let resendClient = null;

function getResend() {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      console.warn('Email configuration missing (RESEND_API_KEY). Emails will not be sent.');
      return null;
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

async function sendEmail(to, subject, text, html) {
  const resend = getResend();
  if (!resend) return;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to,
      subject,
      text,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const bookings = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
      return res.status(200).json(bookings);
    }

    if (method === 'POST') {
      const { name, email, date, time, guests } = req.body;
      
      // Check if the slot is full (max 5 bookings per time slot)
      const countStmt = db.prepare("SELECT COUNT(*) as count FROM bookings WHERE date = ? AND time = ? AND status != 'cancelled'");
      const { count } = countStmt.get(date, time);

      if (count >= 5) {
        return res.status(400).json({ error: "This time slot is fully booked. Please choose another time." });
      }

      const stmt = db.prepare("INSERT INTO bookings (name, email, date, time, guests) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(name, email, date, time, guests);

      // Send confirmation email
      await sendEmail(
        email,
        'Booking Received - Verdant Brew Cafe',
        `Hi ${name}, we've received your booking for ${date} at ${time} for ${guests} guests. We'll confirm it shortly!`,
        `<h1>Booking Received</h1><p>Hi ${name},</p><p>We've received your booking for <strong>${date}</strong> at <strong>${time}</strong> for <strong>${guests}</strong> guests.</p><p>We'll confirm it shortly!</p>`
      );

      return res.status(200).json({ id: info.lastInsertRowid, success: true });
    }

    if (method === 'PATCH') {
      const { id } = req.query;
      const { status } = req.body;

      // Get booking details for email
      const booking = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      const stmt = db.prepare("UPDATE bookings SET status = ? WHERE id = ?");
      stmt.run(status, id);

      // Send status update email
      if (status === 'confirmed') {
        await sendEmail(
          booking.email,
          'Booking Confirmed! - Verdant Brew Cafe',
          `Hi ${booking.name}, your booking for ${booking.date} at ${booking.time} has been confirmed. See you soon!`,
          `<h1>Booking Confirmed!</h1><p>Hi ${booking.name},</p><p>Your booking for <strong>${booking.date}</strong> at <strong>${booking.time}</strong> has been <strong>confirmed</strong>.</p><p>See you soon!</p>`
        );
      } else if (status === 'cancelled') {
        await sendEmail(
          booking.email,
          'Booking Cancelled - Verdant Brew Cafe',
          `Hi ${booking.name}, your booking for ${booking.date} at ${booking.time} has been cancelled.`,
          `<h1>Booking Cancelled</h1><p>Hi ${booking.name},</p><p>Your booking for <strong>${booking.date}</strong> at <strong>${booking.time}</strong> has been <strong>cancelled</strong>.</p>`
        );
      }

      return res.status(200).json({ success: true });
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      const stmt = db.prepare("DELETE FROM bookings WHERE id = ?");
      stmt.run(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
