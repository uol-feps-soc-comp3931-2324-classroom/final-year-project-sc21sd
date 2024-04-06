const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./myfinanceapp.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the myfinanceapp database.');
});

db.serialize(() => {
  // Create User Table
  db.run(`CREATE TABLE IF NOT EXISTS user (
    userId INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // Create User Stock Information Table
  db.run(`CREATE TABLE IF NOT EXISTS userStockInfo (
    userStockId INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    ticker TEXT NOT NULL,
    openPrice REAL,
    currentPrice REAL,
    totalInvested REAL,
    percentageChanged REAL,
    FOREIGN KEY (userId) REFERENCES user (userId)
  )`);

  // Create Stocks Database Table
  db.run(`CREATE TABLE IF NOT EXISTS stocks (
    ticker TEXT,
    companyName TEXT,
    date TEXT,
    openPrice REAL,
    closePrice REAL,
    dayHigh REAL,
    dayLow REAL,
    sector TEXT,
    PRIMARY KEY (ticker, date)
  )`);
  
  const insertStockData = (ticker, companyName, openPrice, trend, sector) => {
    let dayHigh, dayLow, closePrice;
  
    for (let i = 0; i < 30; i++) {
      const randomFactor = Math.random();
      const volatility = trend === 'index' ? 5 : 2; // Increased volatility for indexes
  
      // Adding randomness to the price changes
      const priceChange = (Math.random() - 0.5) * volatility;
      const minorFluctuation = (Math.random() - 0.5) * 2; // Small fluctuation to introduce on "up" and "down" trends
  
      if (trend === 'up') {
        dayHigh = parseFloat((openPrice + randomFactor * volatility).toFixed(2));
        dayLow = parseFloat((openPrice - randomFactor * volatility).toFixed(2));
        closePrice = openPrice + priceChange + minorFluctuation; // Allow for occasional drops
      }  
      else if (trend === 'down') { 
        dayHigh = parseFloat((openPrice + randomFactor * volatility).toFixed(2));
        dayLow = parseFloat((openPrice - randomFactor * volatility).toFixed(2));
        closePrice = openPrice - priceChange - minorFluctuation; // Allow for occasional rises
      }
      else if (trend === 'side') {
        dayHigh = parseFloat((openPrice + randomFactor * 2).toFixed(2));
        dayLow = parseFloat((openPrice - randomFactor * 2).toFixed(2));
        closePrice = parseFloat((openPrice + (Math.random() - 0.5) * 2).toFixed(2));
      }
      else if (trend === 'index'){
        dayHigh = parseFloat((openPrice + Math.random() * volatility).toFixed(2));
        dayLow = parseFloat((openPrice - Math.random() * volatility).toFixed(2));
        closePrice = parseFloat((openPrice + (Math.random() - 0.5) * volatility).toFixed(2));
      }
  
      // Ensure dayLow is less than dayHigh
      if (dayLow > dayHigh) {
        let temp = dayHigh;
        dayHigh = dayLow;
        dayLow = temp;
      }
  
      // Ensure closePrice is within the high-low range
      closePrice = Math.max(dayLow, Math.min(dayHigh, closePrice));
  
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
  
      const sql = `INSERT INTO stocks (ticker, companyName, date, openPrice, closePrice, dayHigh, dayLow, sector) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      db.run(sql, [ticker, companyName, dateString, openPrice, closePrice, dayHigh, dayLow, sector], (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log(`A row has been inserted for ${ticker} on ${dateString}.`);
      });
  
      // Adjust openPrice for next day
      openPrice = closePrice;
    }
  };
  
  
  // Populate the database
  insertStockData('TECH1', 'Technology Company 1', 100.00, 'up', 'Technology');
  insertStockData('TECH2', 'Technology Company 2', 200.00, 'down', 'Technology');
  insertStockData('TECH3', 'Technology Company 3', 500.00, 'side', 'Technology');
  insertStockData('TECH100', 'Technology Index 100', 1000.00, 'index', 'Technology');

  insertStockData('SERV1', 'Service Company 1', 320.00, 'up', 'Services');
  insertStockData('SERV2', 'Service Company 2', 320.00, 'down', 'Services');
  insertStockData('SERV3', 'Service Company 3', 400.00, 'side', 'Services');
  insertStockData('SERV300', 'Service Index 300', 4000.00, 'index', 'Services');

  insertStockData('ENRG1', 'Energy Company 1', 400.00, 'up', 'Energy');
  insertStockData('ENRG2', 'Energy Company 2', 389.00, 'down', 'Energy');
  insertStockData('ENRG3', 'Energy Company 3', 366.00, 'side', 'Energy');
  insertStockData('ENRG150', 'Energy Index 150', 2660.00, 'index', 'Energy');

  insertStockData('FIN1', 'Finance Company 1', 249.00, 'up', 'Finance');
  insertStockData('FIN2', 'Finance Company 2', 600.00, 'down', 'Finance');
  insertStockData('FIN3', 'Finance Company 3', 500.00, 'side', 'Finance');
  insertStockData('FIN500', 'Finance Index 500', 500.00, 'index', 'Finance');
  
  db.close();

});

module.exports = db;
