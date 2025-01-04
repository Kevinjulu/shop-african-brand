import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { performanceMonitor } from './services/monitoring/PerformanceMonitor';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Initialize performance monitoring
performanceMonitor.recordMetric('app_init', performance.now());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);