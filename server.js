import express from 'express';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// MySQL Connection Pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test_db',
});

// API Routes
app.get('/api/data', async (req, res) => {
  try {
    // const [rows] = await db.query('SELECT * FROM users');
    res.json({ message: "Hello from the Express backend!", data: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve Vite build preview in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
