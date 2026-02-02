import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HospitalProvider } from './context/HospitalContext';
import { ThemeProvider } from './context/ThemeContext';
import reportWebVitals from './reportWebVitals';

// Fallback inline global styles: appended at runtime if external CSS doesn't load
try {
  const existing = document.getElementById('fallback-global-styles');
  if (!existing) {
    const fallbackCss = `body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0} .navbar{display:flex;align-items:center;gap:12px;padding:12px 18px;background:#fff;border-bottom:1px solid #eee} .navbar .brand{font-weight:700;color:#2563eb} h1{color:#111}`;
    const styleEl = document.createElement('style');
    styleEl.id = 'fallback-global-styles';
    styleEl.appendChild(document.createTextNode(fallbackCss));
    document.head.appendChild(styleEl);
  }
} catch (e) {
  // ignore in non-browser environments
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <HospitalProvider>
        <App />
      </HospitalProvider>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();