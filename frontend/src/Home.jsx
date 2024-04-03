import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SimplifiedCandlestickChart from "./SimplifiedCandlestickChart.jsx"; 
import StockAreaChart from "./StockAreaChart.jsx"; 
import StockInfoHeader from "./StockInfoHeader.jsx"; 

const StockVisualization = ({ ticker = 'ENRG1' }) => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('line'); // Default to line chart
  const [companyInfo, setCompanyInfo] = useState({
    companyName: 'Tech Company 3',
    currentPrice: null,
    priceChange: null,
    percentageChange: null
  });

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
  
          if (formattedData.length > 0) {
            const latestData = formattedData[formattedData.length - 1];
            const firstData = formattedData[formattedData.length - 2];
            const priceChange = latestData.close - firstData.close;
            const percentageChange = (priceChange / firstData.close) * 100;
  
            setCompanyInfo({
              companyName: 'Tech Company 3', // You would get this from somewhere else if it's dynamic
              currentPrice: latestData.close,
              priceChange: priceChange.toFixed(2),
              percentageChange: percentageChange.toFixed(2),
            });
          }
        }
      })
      .catch(error => console.error('Failed to fetch stock data:', error));
  }, [ticker]);
  

  const renderChart = () => {
    switch(chartType) {
      case 'line':
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="close" stroke="#5ACF59" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      );
      case 'candlestick':
        return <SimplifiedCandlestickChart data={data}/>;
      case 'area':
        return <StockAreaChart data={data}/>;
      default:
        return null;
    }
  };

  return (
    <div>
      <div>
      <StockInfoHeader
        companyName={companyInfo.companyName}
        ticker={ticker}
        currentPrice={companyInfo.currentPrice}
        priceChange={companyInfo.priceChange}
        percentageChange={companyInfo.percentageChange}
      />
        
        <button onClick={() => setChartType('line')}>Line Chart</button>
        <button onClick={() => setChartType('candlestick')}>Candlestick Chart</button>
        <button onClick={() => setChartType('area')}>Area Chart</button>
      </div>
      <h2>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart for {ticker}</h2>
      {renderChart()}
    </div>
  );
};

export default StockVisualization;
