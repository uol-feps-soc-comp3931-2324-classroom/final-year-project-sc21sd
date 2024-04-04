import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const StockAreaChart = ({ data }) => {
  // Prepare data for Highcharts
  const areaChartData = data.map(item => ([
    item.x,
    item.high,
  ]));

  const options = {
    chart: {
      type: 'area'
    },
    title: {
      text: '  '
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
      title: {
        text: 'Price'
      }
    },
    series: [{
      name: '   ',
      data: areaChartData,
      lineColor: '#228B22', // Green line on top of the area
      color: '#228B22',
      fillColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, 'rgba(34, 139, 34, 1)'],  
          [1, 'rgba(34, 139, 34, 0)']   
        ]
      },
      threshold: null
    }],
    tooltip: {
      valueDecimals: 2
    },

  };
  

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      containerProps={{ style: { height: '100%', minHeight: '500px' } }} //
    />
  );
};

export default StockAreaChart;
