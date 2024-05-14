
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

  const calculateRankIndices = (assetGrowthIndices, marketGrowthIndices) => {
    let rankIndicesData = [];
    for (let i = 0; i < 29; i++) {
      for (let j = i+1; j <= 29; j++) {
        
        const assetGI = assetGrowthIndices[i][2]; // Assuming the third element is the growth index
        const marketGI = marketGrowthIndices[j][2]; // Assuming the third element is the growth index
        let rankIndex = assetGI > marketGI ? 1 : 0;
        rankIndicesData.push([i, j, rankIndex]); // This ensures we are comparing the current day with all subsequent days
      }
    }
    console.log(rankIndicesData);
    return rankIndicesData;
  };
  
  
const determineColor = (value) => {
    if (value < 0) return '#ff4d4d'; // dark red for significant loss
       // light red for loss
    if (value === 0) return '#ffff99';  // yellow for no change
  //   if (value <= 0.1) return '#99ff99'; // light green for gain
    return '#00b300';                   // dark green for significant gain
  };

  const determineColorrank = (value) => {
    if (value === 0) return '#ff4d4d';
    return '#00b300'; // dark green for significant gain
  };

// Visualize Indices with Highcharts
const VisualizeIndices = ({ marketTicker, assetTicker}) => {
  const [growthChartOptions, setGrowthChartOptions] = useState({});
  const [rankChartOptions, setRankChartOptions] = useState({});

  if (assetTicker === 'TECH1' || assetTicker === 'TECH2' || assetTicker === 'TECH3'){
    marketTicker = 'TECH100'
  }
  else if (assetTicker === 'ENGR1' || assetTicker === 'ENGR2' || assetTicker === 'ENGR3'){
    marketTicker = 'ENGR150'
  }
  else if (assetTicker === 'SERV1' || assetTicker === 'SERV2' || assetTicker === 'SERV3'){
    marketTicker = 'SERV200'
  }
  else if (assetTicker === 'FIN1' || assetTicker === 'FIN2' || assetTicker === 'FIN3'){
    marketTicker = 'FIN500'
  }

  console.log(marketTicker)

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
      const coloredData1 = assetGrowthIndices.map((point) => {
        const color = determineColor(point[2]);
      return { x: point[0], y: point[1], color };
      }
      );
      const coloredDatarank = assetRankIndices.map((point) => {
        const color = determineColorrank(point[2]);
      return { x: point[0], y: point[1], color };
      }
      );

        setGrowthChartOptions({
          chart: {
            type: 'heatmap',
            marginTop: 20,
            marginBottom: 150,
            plotBorderWidth: 1
          },
          title: {
            text: ' ',
          },
          
          xAxis: {
            categories: marketData.map((data) => data.date),
            title: {
              text: 'Date of Sale',
            },
            gridLineWidth: 0
          },
          yAxis: {
            categories: marketData.map((data) => data.date),
            title: {
              text: 'Date of Purchase',
            },
            gridLineWidth: 0
          },
          legend: {
            enabled: false
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
              return `<b>${this.series.xAxis.categories[this.point.x]}</b> and <b>${this.series.yAxis.categories[this.point.y]}</b>`;
            },
          },
        });
        setRankChartOptions({
          chart: {
            type: 'heatmap',
            marginTop: 20,
            marginBottom: 150,
            plotBorderWidth: 1
          },
          title: {
            text: ' ',
          },
          xAxis: {
            categories: assetData.map((data) => data.date),
            gridLineWidth: 0,
            min: 0,
            max: assetData.length - 1,
            tickInterval: 1, // Show every category
            title: {
              text: 'Date of Sale',
            },
            
          },
          legend: {
            enabled: false
          },
          yAxis: {
            categories: marketData.map(data => data.date),
            gridLineWidth: 0,
            min: 0,
            max: assetData.length - 1,
            tickInterval: 1, // Show every category
            labels: {
              rotation: 0 // Adjust as necessary
            },
            title: {
              text: 'Date of Purchase',
            },
          },          
          colorAxis: {
            min: 0,
            max: 1,
            stops: [
              [0, '#ff4d4d'], // Red for rank index 0
              [1, '#4dff4d']  // Green for rank index 1
            ]
          },
          series: [{
            name: 'Rank Index',
            borderWidth: 1,
            data: coloredDatarank,
            dataLabels: {
              enabled: true,
            }
          }],
          tooltip: {
            formatter: function () {
              return `<b>${this.series.xAxis.categories[this.point.x]}</b> and <b>${this.series.yAxis.categories[this.point.y]}</b>`;
            },
          },

        });
      
    })
    .catch(error => {
      console.error('Error fetching data:', error);
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
