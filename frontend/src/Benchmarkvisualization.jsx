import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import heatmap from 'highcharts/modules/heatmap';

heatmap(Highcharts);

// Assuming the API returns an array of {date, close} objects for each ticker
const fetchData = async (ticker) => {
  const response = await axios.get(`/api/matrixvis/${ticker}`);
  return response.data.data;
};

// Calculates Growth Indices
const calculateGrowthIndices = (data) => {
    const points = [];
    data.forEach((startPoint, rowIndex) => {
      data.forEach((endPoint, colIndex) => {
        if (colIndex > rowIndex) {
          const growthIndex = (endPoint.close - startPoint.close) / startPoint.close;
          points.push([rowIndex, colIndex, growthIndex]);
        }
      });
    });
    return points;
  };

// Calculates Rank Indices for assetData against marketData
const calculateRankIndices = (assetGrowthIndices, marketGrowthIndices) => {
  // Placeholder: Implement rank calculation based on your specific criteria
  // This function should compare each asset GI with the corresponding market GI and produce rank indices
  return assetGrowthIndices.map(([, , assetGI]) => {
    const rank = marketGrowthIndices.filter(([, , marketGI]) => assetGI > marketGI).length / marketGrowthIndices.length;
    return rank;
  });
};

const determineColor = (value) => {
    // Define your threshold values and corresponding colors
    if (value < 0) return '#ff4d4d'; // dark red for significant loss
       // light red for loss
    if (value === 0) return '#ffff99';  // yellow for no change
  //   if (value <= 0.1) return '#99ff99'; // light green for gain
    return '#00b300';                   // dark green for significant gain
  };

// Visualize Indices with Highcharts
const VisualizeIndices = ({ marketTicker = 'FIN500', assetTicker = 'FIN1' }) => {
  const [growthChartOptions, setGrowthChartOptions] = useState({});
  const [rankChartOptions, setRankChartOptions] = useState({});

  useEffect(() => {
    Promise.all([fetchData(marketTicker), fetchData(assetTicker)]).then(([marketData, assetData]) => {
      const marketGrowthIndices = calculateGrowthIndices(marketData);
      const assetGrowthIndices = calculateGrowthIndices(assetData);
      const assetRankIndices = calculateRankIndices(assetGrowthIndices, marketGrowthIndices);
      
      const coloredData = marketGrowthIndices.map((point) => {
        const color = determineColor(point[2]);
      return { x: point[0], y: point[1], color };
      }
      );

      // Configure Highcharts options for Growth Index visualization
      // Placeholder: configure your Highcharts options for Growth Index
      setGrowthChartOptions({
        chart: {
          type: 'heatmap',
          plotBorderWidth: 1,
        },
        title: {
          text: 'Growth Index of FIN500',
        },
        xAxis: {
          categories: marketData.map((data) => data.date),
          title: {
            text: 'Start Date',
          },
        },
        yAxis: {
          categories: marketData.map((data) => data.date),
          title: {
            text: 'End Date',
          },
        },
        colorAxis: {
          min: -1,
          max: 1,
          stops: [
            [0, '#FF0000'], // Red for negative growth
            [0.5, '#FFFF00'], // Yellow for no growth
            [1, '#00FF00'], // Green for positive growth
          ],
        },
        series: [{
          name: 'Growth Index',
          borderWidth: 1,
          data: coloredData,
          dataLabels: {
            enabled: false,
          }
        }],
        tooltip: {
          formatter: function () {
            return `<b>${this.series.xAxis.categories[this.point.x]}</b> to <b>${this.series.yAxis.categories[this.point.y]}</b>: <b>${this.point.value}</b>`;
          },
        },
      });

      // Configure Highcharts options for Rank Index visualization
      // Placeholder: configure your Highcharts options for Rank Index
      setRankChartOptions({
        chart: {
          type: 'heatmap',
          plotBorderWidth: 1,
        },
        title: {
          text: 'Rank Index of FIN1 Against FIN500',
        },
        xAxis: {
          categories: assetData.map((data) => data.date),
          title: {
            text: 'Start Date',
          },
        },
        yAxis: {
          categories: assetData.map((data) => data.date),
          title: {
            text: 'End Date',
          },
        },
        colorAxis: {
          min: 0,
          max: 1,
          stops: [
            [0, '#FF0000'], // Red for worse performance compared to market
            [0.5, '#FFFF00'], // Yellow for average performance
            [1, '#00FF00'], // Green for outperforming the market
          ],
        },
        series: [{
          name: 'Rank Index',
          borderWidth: 1,
          data: calculateRankIndices(assetGrowthIndices, marketGrowthIndices),
          dataLabels: {
            enabled: false,
          }
        }],
        tooltip: {
          formatter: function () {
            return `<b>${this.series.xAxis.categories[this.point.x]}</b> to <b>${this.series.yAxis.categories[this.point.y]}</b>: <b>${(this.point.value * 100).toFixed(2)}%</b>`;
          },
        },
      });
    });
  }, [marketTicker, assetTicker]);

  return (
    <div>
      <h2>Growth Index of {marketTicker}</h2>
      <HighchartsReact highcharts={Highcharts} options={growthChartOptions} />
      <h2>Rank Index of {assetTicker} Against {marketTicker}</h2>
      <HighchartsReact highcharts={Highcharts} options={rankChartOptions} />
    </div>
  );
};

export default VisualizeIndices;
