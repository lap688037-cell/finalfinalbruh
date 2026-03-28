const Database = require('better-sqlite3');

const dbPath = process.env.RENDER ? "/data/cafe.db" : "/tmp/cafe.db";
const db = new Database(dbPath);

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = async (req, res) => {
  const { method } = req;

  try {
    if (method === 'POST') {
      const { email } = req.body;
      const stmt = db.prepare("INSERT INTO newsletter (email) VALUES (?)");
      stmt.run(email);
      return res.status(200).json({ success: true });
    }

    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: "Already subscribed" });
    }
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
