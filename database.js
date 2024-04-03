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
  
    for (let i = 0; i < 15; i++) {
      
      if (trend === 'up') {
        dayHigh = openPrice + 6 + (i * 0.5); // Gradual increase
        dayLow = openPrice - 2 + (i * 0.5);
        closePrice = openPrice + 5 + (i * 0.5);
      }  
      else if (trend === 'down')
      { 
        dayHigh = openPrice + 6 - (i * 0.5);
        dayLow = openPrice - 2 - (i * 0.5); // Gradual decrease
        closePrice = openPrice + 5 - (i * 0.5);
      }
      else if (trend === 'side')
      {
        dayHigh = parseFloat((openPrice + Math.random() * 2).toFixed(2));
        dayLow = parseFloat((openPrice - Math.random() * 2).toFixed(2));
        closePrice = parseFloat((openPrice + (Math.random() - 0.5) * 2).toFixed(2));
      }

  
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
  insertStockData('TECH1', 'Technology Company 1', 10.00, 'up', 'Technology');
  insertStockData('TECH2', 'Technology Company 2', 20.00, 'down', 'Technology');
  insertStockData('TECH3', 'Technology Company 3', 50.00, 'side', 'Technology');

  insertStockData('SERV1', 'Service Company 1', 32.00, 'up', 'Services');
  insertStockData('SERV2', 'Service Company 2', 320.00, 'down', 'Services');
  insertStockData('SERV3', 'Service Company 3', 400.00, 'side', 'Services');

  insertStockData('ENRG1', 'Energy Company 1', 40.00, 'up', 'Energy');
  insertStockData('ENRG2', 'Energy Company 2', 389.00, 'down', 'Energy');
  insertStockData('ENRG3', 'Energy Company 3', 266.00, 'side', 'Energy');

  insertStockData('FIN1', 'Finance Company 1', 249.00, 'up', 'Finance');
  insertStockData('FIN2', 'Finance Company 2', 600.00, 'down', 'Finance');
  insertStockData('FIN3', 'Finance Company 3', 500.00, 'side', 'Finance');
  
  db.close();

});

module.exports = db;
