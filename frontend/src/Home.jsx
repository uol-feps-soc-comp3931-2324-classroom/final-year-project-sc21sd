import React, { useState, useEffect, useRef } from 'react';
import { FaRegChartBar, FaTools} from 'react-icons/fa';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import StockInfoHeader from "./StockInfoHeader.jsx";
import SimplifiedCandlestickChart from "./SimplifiedCandlestickChart.jsx";
import StockAreaChart from "./StockAreaChart.jsx";
import ChartIcons from './ChartIcons.jsx';


const StockVisualization = ({ ticker = 'FIN3' }) => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
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
            x: new Date(item.date).getTime(),
            y: item.close,
            open: Number(item.open),
            high: Number(item.high),
            low: Number(item.low),
            close: Number(item.close),
            name: item.companyName
          }));
          setData(formattedData);

          // Assuming the last entry is the most recent
          if (formattedData.length > 0) {
            const latestData = formattedData[formattedData.length - 1];
            const firstData = formattedData[formattedData.length - 2];
            const priceChange = latestData.close - firstData.close;
            const percentageChange = (priceChange / firstData.close) * 100;

            setCompanyInfo({
              companyName: 'Tech Company 3',
              currentPrice: latestData.y,
              priceChange: priceChange.toFixed(2),
              percentageChange: percentageChange.toFixed(2),
            });
          }
        }
      })
      .catch(error => console.error('Failed to fetch stock data:', error));
  }, [ticker]);

  const getChartOptions = () => {
    return {
      title: {
        text: `     `
      },
      series: [{
        data: data,
        name: ticker,
        tooltip: {
          valueDecimals: 2
        },
        color:'#008800',
      }],
      xAxis: {
        type: 'datetime'
      },
      chart: {
        zoomType: 'x'
      },
      navigator: {
        enabled: true
      },
      scrollbar: {
        enabled: true
      },
      rangeSelector: {
        selected: 1
      }
    };
  };
  const renderChart = () => {
    switch(chartType) {
      case 'line':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={'stockChart'}
            options={getChartOptions()}
            containerProps={{ style: { height: '100%', minHeight: '500px' } }}
          />
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
      <StockInfoHeader
        companyName={companyInfo.companyName}
        ticker={ticker}
        currentPrice={companyInfo.currentPrice}
        priceChange={companyInfo.priceChange}
        percentageChange={companyInfo.percentageChange}
      />
      <ChartIcons setChartType={setChartType}/>
      {renderChart()}
    </div>
  );
};

export default StockVisualization;
