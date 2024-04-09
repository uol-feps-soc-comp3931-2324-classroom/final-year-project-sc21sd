import React, { useState, useEffect, useRef } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import { FaRegChartBar, FaTools} from 'react-icons/fa';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import StockInfoHeader from "./StockInfoHeader.jsx";
import SimplifiedCandlestickChart from "./SimplifiedCandlestickChart.jsx";
import StockAreaChart from "./StockAreaChart.jsx";
import ChartIcons from './ChartIcons.jsx';


const StockVisualization = ({}) => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    currentPrice: null,
    priceChange: null,
    percentageChange: null
  });

  useEffect(() => {
    
    const fetchURL = `/api/stocks/${ticker}`; // Fallback to 'TECH100' if no ticker is provided
    fetch(fetchURL)
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
            const name = latestData.name;

            setCompanyInfo({
              companyName: name,
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

  function debounce(func, wait) {
    let timeout;
  
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
  
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  

  const selectCompany = (company) => {
    setSearchQuery(company.companyName); // Set the search query to the company name
    setSuggestions([]); // Clear suggestions
    navigate(`/stocks/${company.ticker}`);
  };

  
  const fetchCompanyNames = debounce((query) => {
    if (!query.trim()) return;
  
    fetch(`/api/searchCompanies?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        setSuggestions(data); // Assuming the API returns an array of objects with a companyName property
      })
      .catch(error => {
        console.error("Error fetching company names:", error);
      });
  }, 300);
  
  

  
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    // Optionally debounce this call
    fetchCompanyNames(query); // Implement this method based on your API
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
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        suggestions={suggestions} 
        selectCompany={selectCompany}
      />
      <ChartIcons setChartType={setChartType}/>
      {renderChart()}
    </div>
  );
};

export default StockVisualization;