import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode> TODO: Restore this later - currently this makes double API calls
  <BrowserRouter>
    <App />
  </BrowserRouter>
  // </React.StrictMode>
);
