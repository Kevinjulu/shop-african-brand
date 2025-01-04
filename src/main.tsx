import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { performanceMonitor } from './services/monitoring/PerformanceMonitor';
import { supabase } from './integrations/supabase/client';

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

// Initialize performance monitoring after checking auth state
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('Auth state checked, initializing performance monitoring');
  performanceMonitor.recordMetric('app_init', performance.now());
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
);