// @ts-nocheck
import express from "express";
import path from "path";
import mongoose from "mongoose";

const isVercel = !!process.env.VERCEL;
const app = express();
app.use(express.json());

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}

const Booking = mongoose.models.Booking || mongoose.model("Booking", new mongoose.Schema({
  name:       String,
  email:      String,
  date:       String,
  time:       String,
  guests:     Number,
  status:     { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
}));

const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", new mongoose.Schema({
  email:      { type: String, unique: true },
  created_at: { type: Date, default: Date.now },
}));

app.post("/api/bookings", async (req, res) => {
  try {
    await connectDB();
    const { name, email, date, time, guests } = req.body;
    await mongoose.connection.db.collection("bookings").insertOne({
      name, email, date, time, guests: Number(guests),
      status: "pending", created_at: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to create booking" });
  }
});

app.get("/api/bookings", async (req, res) => {
  try {
    await connectDB();
    const bookings = await mongoose.connection.db.collection("bookings").find({}).sort({ created_at: -1 }).toArray();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

app.post("/api/newsletter", async (req, res) => {
  try {
    await connectDB();
    await mongoose.connection.db.collection("newsletters").insertOne({
      email: req.body.email, created_at: new Date()
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

if (!isVercel) {
  app.use(express.static(path.join(process.cwd(), "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(process.cwd(), "dist", "index.html"));
  });
  const PORT = Number(process.env.PORT) || 3000;
  app.listen(PORT, "0.0.0.0", () => console.log(`Server running on http://localhost:${PORT}`));
}

export default app;
