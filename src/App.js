import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HistoriaHU from './components/CreacionAct/HistoriaHU';
import DetalleHistoria from './components/CreacionAct/DetalleHistoria';

const App = () => {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/historiaHU" element={<HistoriaHU />} />
          <Route path="/detalle/:id" element={<DetalleHistoria />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
