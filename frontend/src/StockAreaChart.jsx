import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StockAreaChart = ({ data }) => {
  // Sort data by date for consistent rendering
  const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <ResponsiveContainer  width={'100%'} height={300}>
      <AreaChart data={sortedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        {/* Define the area between low and high prices */}
        <Area type="monotone" dataKey="high" stroke="#5ACF59" fill="#92E491" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StockAreaChart;
