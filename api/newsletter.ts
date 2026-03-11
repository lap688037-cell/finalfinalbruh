import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const mongoose = require('mongoose');

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }

    const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', new mongoose.Schema({
      email:      { type: String, unique: true },
      created_at: { type: Date, default: Date.now },
    }));

    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    await Newsletter.create({ email });
    return res.status(201).json({ success: true });

  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'Already subscribed' });
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
