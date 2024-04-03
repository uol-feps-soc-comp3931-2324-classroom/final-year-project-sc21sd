import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Custom shape for candlesticks
const renderCandleShape = (props) => {
  const { x, width, scale, payload } = props;
  const { open, close, high, low } = payload;
  
  const isRising = open < close;
  const fill = isRising ? '#228B22' : '#ff0000';

  // Calculate the coordinates for each part of the candlestick
  const y1 = scale(open);
  const y2 = scale(close);
  const highToY = scale(high);
  const lowToY = scale(low);

  return (
    <g>
      {/* Draw the high to low line (wick) */}
      <line x1={x + width / 2} x2={x + width / 2} y1={highToY} y2={lowToY} stroke="#000" />
      {/* Draw the open to close rectangle (body) */}
      <rect x={x} y={Math.min(y1, y2)} width={width} height={Math.max(1, Math.abs(y1 - y2))} fill={fill} />
    </g>
  );
};

// Your chart component
const SimplifiedCandlestickChart = ({ data }) => {
  // Preprocess data to sort by date and calculate scale for y values
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
  const yValues = sortedData.flatMap(d => [d.open, d.close, d.high, d.low]);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  // Calculate the padding for Y-axis domain
  const padding = (maxY - minY) * 0.05; // 5% padding on each side
  // Scale function for converting value to y-coordinates
  const scaleY = value => (1 - (value - (minY)) / ((maxY + padding) - (minY - padding))) * 300; 

  return (
    <ResponsiveContainer width={'100%'} height={400}>
      <BarChart data={sortedData} barCategoryGap={1}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis 
          type="number" 
          domain={[0, maxY + padding]}
          tickFormatter={tick => Math.round(tick)}
        />
        <Tooltip />
        <Bar dataKey="high" shape={(props) => renderCandleShape({ ...props, scale: scaleY })} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimplifiedCandlestickChart;
