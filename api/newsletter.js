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
  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'POST') {
      const { email } = req.body;
      const stmt = db.prepare("INSERT INTO newsletter (email) VALUES (?)");
      stmt.run(email);

      // Send welcome email
      await sendEmail(
        email,
        'Welcome to Verdant Brew Newsletter',
        'Thank you for joining our newsletter! Stay tuned for seasonal specials and events.',
        '<h1>Welcome to the Sanctuary</h1><p>Thank you for joining our newsletter! Stay tuned for seasonal specials and events.</p>'
      );

      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: "Already subscribed" });
    }
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
