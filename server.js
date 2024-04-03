const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

// Initialize Express app
const app = express();
app.use(cors()); // Use CORS to avoid cross-origin issues if your frontend is on a different port during development

// Connect to SQLite database
const db = new sqlite3.Database('./myfinanceapp.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the myfinanceapp database.');
});

app.get('/api/stocks/:ticker', (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    // Updated SQL query to fetch additional data
    const sql = `SELECT date, openPrice AS open, dayHigh AS high, dayLow AS low, closePrice AS close, companyName AS companyName
                 FROM stocks WHERE ticker = ? ORDER BY date`;
  
    db.all(sql, [ticker], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      res.json({
        "message": "success",
        "data": rows
      });
    });
  });
  

// Specify the port to listen on
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close(() => {
    console.log('Database connection closed.');
    process.exit(0);
  });
});
