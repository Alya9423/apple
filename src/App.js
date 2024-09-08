import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './FolderList'; // example Home component
import RasterPage from './RasterPage'; // your RasterPage component

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/raster/:rasterId" element={<RasterPage />} />
      </Routes>
    </div>
  );
}

export default App;
