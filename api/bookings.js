import Database from 'better-sqlite3';
import path from 'path';

let db;

function getDb() {
  if (!db) {
    const dbPath = process.env.RENDER ? "/data/cafe.db" : "/tmp/cafe.db";
    db = new Database(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        guests INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }
  return db;
}

export default async function handler(req, res) {
  const { method } = req;
  const database = getDb();

  try {
    if (method === 'GET') {
      const bookings = database.prepare("SELECT * FROM bookings ORDER BY created_at DESC").all();
      return res.status(200).json(bookings);
    }

    if (method === 'POST') {
      const { name, email, date, time, guests } = req.body;
      
      const countStmt = database.prepare("SELECT COUNT(*) as count FROM bookings WHERE date = ? AND time = ? AND status != 'cancelled'");
      const { count } = countStmt.get(date, time);

      if (count >= 5) {
        return res.status(400).json({ error: "This time slot is fully booked. Please choose another time." });
      }

      const stmt = database.prepare("INSERT INTO bookings (name, email, date, time, guests) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(name, email, date, time, guests);
      return res.status(200).json({ id: info.lastInsertRowid, success: true });
    }

    if (method === 'PATCH') {
      const { id } = req.query;
      const { status } = req.body;
      const stmt = database.prepare("UPDATE bookings SET status = ? WHERE id = ?");
      stmt.run(status, id);
      return res.status(200).json({ success: true });
    }

    if (method === 'DELETE') {
      const { id } = req.query;
      const stmt = database.prepare("DELETE FROM bookings WHERE id = ?");
      stmt.run(id);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
