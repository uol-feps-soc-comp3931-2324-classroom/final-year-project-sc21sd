import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import GrowthMatrix from './GrowthMatrix';
import Benchmarkvisualization from './Benchmarkvisualization';
import Stockdata from './Stockdata';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stocks/:ticker" element={<Home />} />
        {/* <Route path="/growthmatrixvis/:ticker" element={<GrowthMatrix />} /> */}
        <Route path="/matrixvis/:ticker" element={<Benchmarkvisualization />} />
        <Route path="/stockdata/:ticker" element={<Stockdata />} />
      </Routes>
    </Router>
  );
}

export default App;
