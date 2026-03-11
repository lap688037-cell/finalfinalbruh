import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI!);
  isConnected = true;
}

const newsletterSchema = new mongoose.Schema({
  email:      { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
});

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    const entry = new Newsletter({ email });
    await entry.save();
    return res.status(201).json({ success: true });
  } catch (err: any) {
    if (err.code === 11000) return res.status(400).json({ error: 'Already subscribed' });
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
