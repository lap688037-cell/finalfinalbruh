import express from "express";
import path from "path";

const isVercel = !!process.env.VERCEL;
const app = express();
app.use(express.json());

// Lazy load mongoose to avoid build issues
async function getModels() {
  const mongoose = await import("mongoose");
  
  if (mongoose.default.connection.readyState === 0) {
    await mongoose.default.connect(process.env.MONGODB_URI!);
  }

  const bookingSchema = new mongoose.Schema({
    name:       String,
    email:      String,
    date:       String,
    time:       String,
    guests:     Number,
    status:     { type: String, default: "pending" },
    created_at: { type: Date, default: Date.now },
  });

  const newsletterSchema = new mongoose.Schema({
    email:      { type: String, unique: true },
    created_at: { type: Date, default: Date.now },
  });

  const Booking    = mongoose.default.models["Booking"]    ?? mongoose.default.model("Booking",    bookingSchema);
  const Newsletter = mongoose.default.models["Newsletter"] ?? mongoose.default.model("Newsletter", newsletterSchema);

  return { Booking, Newsletter };
}

// POST /api/bookings
app.post("/api/bookings", async (req, res) => {
  try {
    const { Booking } = await getModels();
    const { name, email, date, time, guests } = req.body;
    const doc = await Booking.create({ name, email, date, time, guests });
    res.json({ id: doc._id, success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET /api/bookings
app.get("/api/bookings", async (_req, res) => {
  try {
    const { Booking } = await getModels();
    const bookings = await Booking.find().sort({ created_at: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// POST /api/newsletter
app.post("/api/newsletter", async (req, res) => {
  try {
    const { Newsletter } = await getModels();
    await Newsletter.create({ email: req.body.email });
    res.json({ success: true });
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(400).json({ error: "Already subscribed" });
    } else {
      res.status(500).json({ error: "Failed to subscribe" });
    }
  }
});

if (!isVercel) {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
