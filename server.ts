import express from "express";
import path from "path";
import mongoose from "mongoose";

const isVercel = !!process.env.VERCEL;

// ── MongoDB Connection ────────────────────────────────────────────────────────
let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) {
    console.warn("No MONGODB_URI set — database features disabled.");
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

// ── Schemas ───────────────────────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true },
  date:       { type: String, required: true },
  time:       { type: String, required: true },
  guests:     { type: Number, required: true },
  status:     { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
});

const newsletterSchema = new mongoose.Schema({
  email:      { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
});

const Booking    = mongoose.models.Booking    || mongoose.model("Booking",    bookingSchema);
const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// API Routes
app.post("/api/bookings", async (req, res) => {
  try {
    await connectDB();
    const { name, email, date, time, guests } = req.body;
    if (!name || !email || !date || !time || !guests) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const booking = await Booking.create({ name, email, date, time, guests });
    res.json({ id: booking._id, success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find().sort({ created_at: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post("/api/newsletter", async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    await Newsletter.create({ email });
    res.json({ success: true });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Already subscribed" });
    }
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

// Serve frontend in production
if (!isVercel) {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });

  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
