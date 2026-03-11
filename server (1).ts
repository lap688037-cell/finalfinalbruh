import express, { Request, Response } from "express";
import path from "path";
import mongoose, { Schema, Document } from "mongoose";

const isVercel = !!process.env.VERCEL;

// ── MongoDB Connection ────────────────────────────────────────────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    console.warn("No MONGODB_URI set — database features disabled.");
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI as string);
  isConnected = true;
}

// ── Interfaces ────────────────────────────────────────────────────────────────
interface IBooking extends Document {
  name: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  created_at: Date;
}

interface INewsletter extends Document {
  email: string;
  created_at: Date;
}

// ── Schemas ───────────────────────────────────────────────────────────────────
const bookingSchema = new Schema<IBooking>({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  date:       { type: String, required: true },
  time:       { type: String, required: true },
  guests:     { type: Number, required: true },
  status:     { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
});

const newsletterSchema = new Schema<INewsletter>({
  email:      { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

const Booking    = mongoose.models.Booking    || mongoose.model<IBooking>("Booking", bookingSchema);
const Newsletter = mongoose.models.Newsletter || mongoose.model<INewsletter>("Newsletter", newsletterSchema);

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// POST /api/bookings
app.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { name, email, date, time, guests } = req.body;
    if (!name || !email || !date || !time || !guests) {
      res.status(400).json({ error: "All fields are required." });
      return;
    }
    const booking = new Booking({ name, email, date, time, guests });
    await booking.save();
    res.json({ id: booking._id, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET /api/bookings
app.get("/api/bookings", async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// POST /api/newsletter
app.post("/api/newsletter", async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { email } = req.body;
    const entry = new Newsletter({ email });
    await entry.save();
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Already subscribed" });
      return;
    }
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// Serve frontend in production (non-Vercel)
if (!isVercel) {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
