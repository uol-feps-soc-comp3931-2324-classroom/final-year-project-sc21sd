import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import GrowthMatrix from './GrowthMatrix';
import Benchmarkvisualization from './Benchmarkvisualization'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stock/:ticker" element={<Home />} />
        <Route path="/growthmatrixvis/:ticker" element={<GrowthMatrix />} />
        <Route path="/matrixvis/:ticker" element={<Benchmarkvisualization />} />
      </Routes>
    </Router>
  );
}

export default App;
