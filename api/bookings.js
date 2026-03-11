import mongoose from 'mongoose';

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();
    const db = mongoose.connection.db;

    if (req.method === 'POST') {
      const { name, email, date, time, guests } = req.body;
      if (!name || !email || !date || !time || !guests) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      await db.collection('bookings').insertOne({
        name, email, date, time,
        guests: Number(guests),
        status: 'pending',
        created_at: new Date()
      });
      return res.status(201).json({ success: true });
    }

    if (req.method === 'GET') {
      const bookings = await db.collection('bookings').find({}).sort({ created_at: -1 }).toArray();
      return res.status(200).json(bookings);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
