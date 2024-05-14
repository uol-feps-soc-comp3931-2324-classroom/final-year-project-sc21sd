import React, { useState, useEffect, useRef } from 'react';
import { useParams,useNavigate  } from 'react-router-dom';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import StockInfoHeader from "./StockInfoHeader.jsx";
import SimplifiedCandlestickChart from "./SimplifiedCandlestickChart.jsx";
import StockAreaChart from "./StockAreaChart.jsx";
import ChartIcons from './ChartIcons.jsx';
import GrowthMatrix from './GrowthMatrix.jsx';
import Benchmarkvisualization from './Benchmarkvisualization';
import Stockdata from './Stockdata';


const StockVisualization = ({}) => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [simplifiedData, setSimplifiedData] = useState([]);
  const [dataCounts, setDataCounts] = useState({
    originalCount: 0,
    reducedCount: 0
  });
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    currentPrice: null,
    priceChange: null,
    percentageChange: null
  });

  useEffect(() => {
    
    let fetchURL;
  if (chartType === 'matrix') {
    fetchURL = `/api/growthmatrixvis/${ticker}`;
  }
  else if (chartType === 'benchmarking'){
    fetchURL = `/api/matrixvis/${ticker}`;
  }
  else if (chartType === 'data'){
    fetchURL = `/api/stockdata/${ticker}`;
  }
   else {
    fetchURL = `/api/stocks/${ticker}`;
  }

  fetch(fetchURL)
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
          setOriginalData(formattedData);
          setDataCounts(prevCounts => ({ ...prevCounts, originalCount: formattedData.length }));
          const epsilon = 1.40; 
          let simplifiedData = ramerDouglasPeucker(formattedData, epsilon);
          let pips = identifyPIPs(formattedData);
          simplifiedData = integratePIPs(formattedData, simplifiedData, pips);
          setSimplifiedData(simplifiedData);
          setDataCounts(prevCounts => ({ ...prevCounts, reducedCount: simplifiedData.length }));

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

  function identifyPIPs(data) {
    const pips = [];
    for (let i = 1; i < data.length - 1; i++) {
      if ((data[i - 1].y < data[i].y && data[i + 1].y < data[i].y) ||
          (data[i - 1].y > data[i].y && data[i + 1].y > data[i].y)) {
        pips.push(data[i]);
      }
    }
    return pips;
  }
  
  function integratePIPs(originalData, simplifiedData, pips) {
    const dataMap = new Map(simplifiedData.map(point => [point.x, point]));
    // Ensure all PIPs are included
    pips.forEach(point => {
      if (!dataMap.has(point.x)) {
        dataMap.set(point.x, point);
      }
    });
    // Convert map back to array and sort by the x value to maintain order
    return Array.from(dataMap.values()).sort((a, b) => a.x - b.x);
  }

  function calculatePerpendicularDistance(point, lineStart, lineEnd) {
    const area = Math.abs(
      0.5 * (lineStart.x * lineEnd.y + lineEnd.x * point.y + point.x * lineStart.y - lineEnd.x * lineStart.y - point.x * lineEnd.y - lineStart.x * point.y)
    );
    const lineLength = Math.sqrt(Math.pow(lineStart.x - lineEnd.x, 2) + Math.pow(lineStart.y - lineEnd.y, 2));
    return (2 * area) / lineLength;
  }
  
  function ramerDouglasPeucker(points, epsilon) {
    const findMaxDistance = (points) => {
      let maxDistance = 0;
      let index = 0;
      for (let i = 1; i < points.length - 1; i++) {
        const distance = calculatePerpendicularDistance(points[i], points[0], points[points.length - 1]);
        if (distance > maxDistance) {
          maxDistance = distance;
          index = i;
        }
      }
      return [maxDistance, index];
    };
  
    const [maxDistance, index] = findMaxDistance(points);
    if (maxDistance > epsilon) {
      const leftSide = ramerDouglasPeucker(points.slice(0, index + 1), epsilon);
      const rightSide = ramerDouglasPeucker(points.slice(index), epsilon);
      
      return leftSide.slice(0, -1).concat(rightSide);
    } else {
      return [points[0], points[points.length - 1]];
    }
  }
  

  const getChartOptions = () => {
    return {
      title: {
        text: `     `
      },
      series: [
      //   {
      //   name: 'Original Data',
      //   data: originalData,
      //   type: 'line',
      //   color: '#FF0000',
      //   tooltip: {
      //     valueDecimals: 2
      //   }
      // }, 
      {
        name: 'Simplified Data',
        data: simplifiedData,
        type: 'line',
        color: '#008800',
        tooltip: {
          valueDecimals: 2
        }
      }
    ],
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
      
      case 'matrix':
        return <GrowthMatrix ticker={ticker}/>;

        case 'benchmarking':
          return <Benchmarkvisualization assetTicker={ticker}/>;
        
        case 'data':
          return <Stockdata ticker={ticker}/>;
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
      <div>
      {/* <h3>Data Points Information</h3>
      <p>Original Data Points: {dataCounts.originalCount}</p>
      <p>Reduced Data Points: {dataCounts.reducedCount}</p>
      <p>Reduction: {((1 - dataCounts.reducedCount / dataCounts.originalCount) * 100).toFixed(2)}%</p> */}
      </div>
      <ChartIcons setChartType={setChartType}/>
      {renderChart()}
    </div>
  );
};

export default StockVisualization;