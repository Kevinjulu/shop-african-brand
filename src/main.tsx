import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { performanceMonitor } from '@/services/monitoring/PerformanceMonitor';

// Initialize performance monitoring
window.addEventListener('load', () => {
  console.log('App: Window loaded, recording initial performance metric');
  performanceMonitor.recordMetric('app_init', performance.now());
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);