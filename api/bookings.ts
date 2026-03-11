import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI!);
  isConnected = true;
}

const bookingSchema = new mongoose.Schema({
  name:       String,
  email:      String,
  date:       String,
  time:       String,
  guests:     Number,
  status:     { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await connectDB();

    if (req.method === 'POST') {
      const { name, email, date, time, guests } = req.body;
      if (!name || !email || !date || !time || !guests) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const booking = new Booking({ name, email, date, time, guests });
      await booking.save();
      return res.status(201).json({ id: booking._id, success: true });
    }

    if (req.method === 'GET') {
      const bookings = await Booking.find().sort({ created_at: -1 });
      return res.status(200).json(bookings);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
