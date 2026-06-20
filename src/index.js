import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { LangueProvider } from './LangueContext';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <LangueProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LangueProvider>
    </ThemeProvider>
  </BrowserRouter>
);