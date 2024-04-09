import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import heatmap from 'highcharts/modules/heatmap';

// Apply the Heatmap module
heatmap(Highcharts);

// Calculate Growth Indices
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

// Function to determine color based on growth index value
const determineColor = (value) => {
  // Define your threshold values and corresponding colors
  if (value < 0) return '#ff4d4d'; // dark red for significant loss
     // light red for loss
  if (value === 0) return '#ffff99';  // yellow for no change
//   if (value <= 0.1) return '#99ff99'; // light green for gain
  return '#00b300';                   // dark green for significant gain
};

const GrowthMatrixVisualization = ({ticker}) => {
  const [options, setOptions] = useState({});

  useEffect(() => {
    axios.get(`/api/growthmatrixvis/${ticker}`)
      .then((response) => {
        // Assume `data` is an array of { date, close }
        const processedData = calculateGrowthIndices(response.data.data);

        // Map the data points to the corresponding color based on the growth index
        const coloredData = processedData.map((point) => {
          const color = determineColor(point[2]);
        return { x: point[0], y: point[1], color };
        }
        );

        // Setup Highcharts options
        const chartOptions = {
          chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
          },
          title: {
            text: ' '
          },
          xAxis: {
            categories: response.data.data.map((point) => point.date),
            gridLineWidth: 0
          },
          yAxis: {
            categories: response.data.data.map((point) => point.date),
            gridLineWidth: 0
          },
          
          colorAxis: {
            min: -0.1,
            max: 0.1,
            stops: [
              [0, '#ff4d4d'],
              [0.5, '#ffff99'],
              [1, '#00b300']
            ]
          },
          series: [{
            name: 'Growth Index',
            borderWidth: -0.1,
            data: coloredData,
          }],
          legend: {
            enabled: false
          },
          tooltip: {
            formatter: function () {
                
            return `<b>${this.series.xAxis.categories[this.point.x]}</b> and <b>${this.series.yAxis.categories[this.point.y]}</b>`;
            }
          },
        };

        setOptions(chartOptions);
      })
      .catch((error) => {
        console.error('Error fetching growth matrix data:', error);
      });
  }, [ticker]);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default GrowthMatrixVisualization;