require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(express.json());

app.get('/api/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  const url = `https://api.tiingo.com/tiingo/utilities/search?query=${encodeURIComponent(query)}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${process.env.TIINGO_API_KEY}`
  };

  try {
    const response = await axios.get(url, { headers });
    // Assuming the response from Tiingo matches the structure you provided
    res.json(response.data); // Send Tiingo's response directly to the frontend
  } catch (error) {
    console.error('Error fetching data from Tiingo:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
