// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TiposDeEvaluacion from './components/TiposDeEvaluacion/TiposDeEvaluacion.jsx';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />  {/* Agrega el Navbar aquí */}
        <Routes>
          <Route path="/tiposDeEvaluacion" element={<TiposDeEvaluacion />} />
        </Routes>
      </div>
    </Router>
  );
};
//esto es una prueba de que mi trabajo esta bien prueba boris repositorio chevere
export default App;

