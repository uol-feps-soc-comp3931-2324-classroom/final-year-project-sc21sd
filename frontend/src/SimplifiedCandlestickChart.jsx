import React from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

const SimplifiedCandlestickChart = ({ data }) => {
  const candlestickData = data.map(item => [
    item.x, // time
    item.open,
    item.high,
    item.low,
    item.close,
    item.name
  ]);

  const options = {
    rangeSelector: {
      selected: 1
    },
    title: {
      text: '   '
    },
    series: [{
      type: 'candlestick',
      name: '   ',
      data: candlestickData,
      tooltip: {
        valueDecimals: 2
      },
      color: '#ff0000', 
      upColor: '#008800', 
      lineColor: '#ff0000', 
      upLineColor: '#008800', 
    }]
  };
  

  return (
    <div>
      <HighchartsReact
      highcharts={Highcharts}
      constructorType={'stockChart'}
      options={options}
      containerProps={{ style: { height: '100%', minHeight: '500px' } }} //
    />
    </div>
  );
};

export default SimplifiedCandlestickChart;
