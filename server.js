import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { Resend } from "resend";

const isVercel = !!process.env.VERCEL;
const isRender = !!process.env.RENDER;
const dbPath = isRender ? "/data/cafe.db" : (isVercel ? "/tmp/cafe.db" : "cafe.db");
const db = new Database(dbPath);

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

  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

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

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/bookings", async (req, res) => {
    const { name, email, date, time, guests } = req.body;
    try {
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

      res.json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.patch("/api/bookings/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
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

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.delete("/api/bookings/:id", (req, res) => {
    const { id } = req.params;
    try {
      const stmt = db.prepare("DELETE FROM bookings WHERE id = ?");
      stmt.run(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  app.get("/api/bookings", (req, res) => {
    try {
      const bookings = db.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    const { email } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO newsletter (email) VALUES (?)");
      stmt.run(email);

      // Send welcome email
      await sendEmail(
        email,
        'Welcome to Verdant Brew Newsletter',
        'Thank you for joining our newsletter! Stay tuned for seasonal specials and events.',
        '<h1>Welcome to the Sanctuary</h1><p>Thank you for joining our newsletter! Stay tuned for seasonal specials and events.</p>'
      );

      res.json({ success: true });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        return res.status(400).json({ error: "Already subscribed" });
      }
      res.status(500).json({ error: "Failed to subscribe" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && !isVercel) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  if (!isVercel) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  
  return app;
}

export default startServer();
