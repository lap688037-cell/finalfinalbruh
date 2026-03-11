import mongoose from 'mongoose';

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    await mongoose.connection.db.collection('newsletters').insertOne({ email, created_at: new Date() });
    return res.status(201).json({ success: true });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Already subscribed' });
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
