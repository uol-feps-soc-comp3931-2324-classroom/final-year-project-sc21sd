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

  app.get('/api/searchCompanies', (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }
  
    // Use parameterized query to prevent SQL injection
    const sql = `SELECT DISTINCT companyName,ticker FROM stocks WHERE companyName LIKE ? LIMIT 10;`;
  
    // '%' symbols are used to indicate partial match before and after the query
    db.all(sql, [`%${query}%`], (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error retrieving data from the database');
      } else {
        res.json(rows);
      }
    });
  });
  

  app.get('/api/growthmatrixvis/:ticker', (req, res) => {
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
  app.get('/api/matrixvis/:ticker', (req, res) => {
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
  function calculateVolatility(dailyReturns) {
    const mean = dailyReturns.reduce((acc, val) => acc + val, 0) / dailyReturns.length;
    const variances = dailyReturns.map(returnValue => Math.pow(returnValue - mean, 2));
    const variance = variances.reduce((acc, val) => acc + val, 0) / variances.length;
    const volatility = Math.sqrt(variance * 252); // Annualizing the volatility
    return volatility;
  }
  
  function calculateHighLow(stockData) {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
    const last52WeeksData = stockData.filter(data => new Date(data.date) >= oneYearAgo);
    const high = Math.max(...last52WeeksData.map(data => data.close));
    const low = Math.min(...last52WeeksData.map(data => data.close));
    
    return { high, low };
  }
  
  function calculateRSI(closingPrices, period = 14) {
    let gains = 0;
    let losses = 0;
  
    for (let i = closingPrices.length - period; i < closingPrices.length - 1; i++) {
      const difference = closingPrices[i + 1] - closingPrices[i];
      if (difference >= 0) {
        gains += difference;
      } else {
        losses -= difference;
      }
    }
  
    const averageGain = gains / period;
    const averageLoss = losses / period;
  
    const rs = averageGain / averageLoss;
    const rsi = 100 - (100 / (1 + rs));
  
    return rsi;
  }

  function calculateMovingAverage(closingPrices, period = 20) {
    // This function calculates a simple moving average
    const movingAverages = [];
    for (let i = period - 1; i < closingPrices.length; i++) {
      const slice = closingPrices.slice(i + 1 - period, i + 1);
      const average = slice.reduce((acc, val) => acc + val, 0) / slice.length;
      movingAverages.push(average);
    }
    return movingAverages[movingAverages.length -1];
  }

  app.get('/api/stockdata/:ticker', (req, res) => {
    const ticker = req.params.ticker.toUpperCase();
    // Updated SQL query to fetch additional data
    const sql = `SELECT date, openPrice AS open, dayHigh AS high, dayLow AS low, closePrice AS close, companyName AS companyName
                 FROM stocks WHERE ticker = ? ORDER BY date`;
  
    db.all(sql, [ticker], (err, rows) => {
      if (err) {
        res.status(400).json({ "error": err.message });
        return;
      }
      const closingPrices = rows.map(row => row.close);
      const dailyReturns = closingPrices.map((close, i, arr) => i === 0 ? null : (close - arr[i - 1]) / arr[i - 1]);
      const volatility = calculateVolatility(dailyReturns);
      const highLow = calculateHighLow(rows);
      const rsi = calculateRSI(closingPrices);
      const movingAverage = calculateMovingAverage(closingPrices,20);
  

      const responseData = {
        dailyReturn: dailyReturns[dailyReturns.length - 1],
        volatility,
        highLow,
        rsi,
        movingAverage
      };
      res.json(responseData);
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
