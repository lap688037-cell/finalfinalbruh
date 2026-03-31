import Database from 'better-sqlite3';
import path from 'path';
import nodemailer from 'nodemailer';

const dbPath = process.env.RENDER ? "/data/cafe.db" : "/tmp/cafe.db";
const db = new Database(dbPath);

// Email Transporter setup
let transporter = null;

function getTransporter() {
  if (!transporter) {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS). Emails will not be sent.');
      return null;
    }
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

async function sendEmail(to, subject, text, html) {
  const mailTransporter = getTransporter();
  if (!mailTransporter) return;

  try {
    await mailTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
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
