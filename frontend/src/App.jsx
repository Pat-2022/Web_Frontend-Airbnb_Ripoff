import React from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Site from './components/Site';

function App () {
  return (
    <>
      <BrowserRouter>
        <Site />
      </BrowserRouter>
    </ >
  );
}

export default App;
