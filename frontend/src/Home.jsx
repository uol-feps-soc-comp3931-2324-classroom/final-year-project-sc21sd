import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import SimplifiedCandlestickChart from "./SimplifiedCandlestickChart.jsx"; 

const StockVisualization = ({ ticker = 'FIN2' }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/stocks/${ticker}`)
      .then(response => response.json())
      .then(result => {
        if (result.data) {
          const formattedData = result.data.map(item => ({
            ...item,
            date: new Date(item.date).toLocaleDateString(),
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
          }));
          setData(formattedData);
        }
      })
      .catch(error => console.error('Failed to fetch stock data:', error));
  }, [ticker]);

  return (
    <div>
      <h2>Line Chart for {ticker}</h2>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="close" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>

      <h2>Candlestick Chart for {ticker}</h2>
      <SimplifiedCandlestickChart data={data}/>
    </div>
  );
};

export default StockVisualization;
