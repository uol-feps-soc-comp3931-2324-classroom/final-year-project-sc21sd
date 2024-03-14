import React, { useState, useEffect } from 'react';
import './Header.css'; // Ensure your CSS is correctly set up

function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

const SearchBar = ({ onSearchChange, value }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        value={value}
        onChange={onSearchChange}
        placeholder="Search for stocks..."
      />
    </div>
  );
};

const SuggestionsList = ({ suggestions }) => {
  return (
    <ul className="suggestions-list">
      {suggestions.map((suggestion, index) => (
        <li key={index}>{suggestion.ticker} - {suggestion.name}</li>
      ))}
    </ul>
  );
};

const Header = () => {
  return (
    <header className="header">
      <div className="logo">STOCK SEARCH</div>
      <nav>
        <button>Search</button>
        <button>Watchlist</button>
        <button>Portfolio</button>
      </nav>
    </header>
  );
};

const Home = () => {
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSuggestions(data); // Directly use Tiingo's response data
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = debounce(fetchSuggestions, 500);

  useEffect(() => {
    if (searchInput.trim()) {
      debouncedFetchSuggestions(searchInput);
    } else {
      setSuggestions([]);
    }
  }, [searchInput]);

  return (
    <div>
      <Header />
      <div className="search-area"> {/* This will center the search bar and suggestion list */}
        <div className="search-container"> {/* This holds the search bar and suggestions list */}
          <SearchBar value={searchInput} onSearchChange={(e) => setSearchInput(e.target.value)} />
          <SuggestionsList suggestions={suggestions} />
        </div>
      </div>
    </div>
  );
};

export default Home;
