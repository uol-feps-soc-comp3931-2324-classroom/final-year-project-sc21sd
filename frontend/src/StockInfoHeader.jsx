import React from 'react';
import { FaRegListAlt } from 'react-icons/fa';

const StockInfoHeader = ({ companyName, ticker, currentPrice, priceChange, percentageChange }) => {
  const priceChangeColor = priceChange >= 0 ? 'green' : 'red';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      {/* Search Bar */}
      <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search stocks..."
          style={{
            padding: '10px',
            width: '30%', // Adjust width as necessary
            borderRadius: '5px',
            border: '1px solid #ddd',
            textAlign: 'center',
          }}
          disabled // This makes the input non-functional
        />
      </div>

      {/* Horizontal Line */}
      <div style={{ width: '100%', borderTop: '1px solid #ddd', marginBottom: '20px' }}></div>

      {/* Stock Information and Trade Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90%' }}>
        <div>
          <h2>{companyName} ({ticker})</h2>
          {/* Price and percentage change on the same line */}
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <h2 style={{ marginRight: '10px' }}>${currentPrice}</h2>
            <p style={{ color: priceChangeColor }}>
              ${priceChange} ({percentageChange}%)
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaRegListAlt size={25} style={{ marginRight: '10px', cursor: 'pointer' }} />
          <button style={{ backgroundColor: priceChange >= 0 ? 'green' : 'red', color: 'white', padding: '10px 20px', fontSize: '16px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            Trade
          </button>
        </div>
      </div>
      <div style={{ width: '100%', borderTop: '1px solid #ddd', marginBottom: '20px' }}></div>
    </div>
  );
};

export default StockInfoHeader;
