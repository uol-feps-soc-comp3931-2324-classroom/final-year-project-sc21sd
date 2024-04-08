import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import 'chart.js/auto'; // Import to register the appropriate chart type

const StockData = ({ ticker = 'TECH3' }) => {
  const [stockMetrics, setStockMetrics] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/stockdata/${ticker}`);
        setStockMetrics(response.data);
      } catch (error) {
        console.error('Error fetching stock metrics:', error);
      }
    };

    fetchData();
  }, [ticker]);

  const radarChartData = {
    labels: ['Daily Return', 'Volatility', '52 Week High', '52 Week Low', 'RSI','Moving Average'],
    datasets: [
      {
        label: ticker,
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(34, 202, 236, 1)',
        data: [
          stockMetrics?.dailyReturn,
          stockMetrics?.volatility,
          stockMetrics?.highLow?.high,
          stockMetrics?.highLow?.low,
          stockMetrics?.rsi,
          stockMetrics?.movingAverage,
        ].map(val => val || 0), // Ensure we have fallback values
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: false,
        },
        suggestedMin: 0,
        suggestedMax: 100, // Adjust according to your data range
      },
    },
  };

  // Wrap the Radar component in a div with inline styles to control its size
  return (
    <div style={{ width: '500px', height: '500px' }}> {/* Adjust these values as needed */}
      <h2>Radar Chart for {ticker}</h2>
      {stockMetrics ? (
        <Radar data={radarChartData} options={options} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default StockData;
