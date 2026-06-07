import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { LangueProvider } from './LangueContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <LangueProvider>
    <App />
  </LangueProvider>
);