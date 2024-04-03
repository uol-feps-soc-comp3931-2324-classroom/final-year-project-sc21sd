const express = require('express');
const db = require('./database.js'); // Import the database connection

const app = express();
const port = 5000;

app.get('/api/stocks', (req, res) => {
  const sql = "SELECT * FROM stocks";
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
      "message":"success",
      "data":rows
    });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
