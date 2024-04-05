import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import GrowthMatrix from './GrowthMatrix'



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/stock/:ticker" element={<Home />} />
        <Route path="/growthmatrixvis/:ticker" element={<GrowthMatrix />} />
      </Routes>
    </Router>
  );
}

export default App;
