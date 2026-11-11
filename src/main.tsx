import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initCloud } from './cloud/supabase';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

initCloud();

// Offline support (production builds only): register the service worker, then hand it every file this page
// has already loaded so the whole app is available offline after the first visit.
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(() => navigator.serviceWorker.ready).then((reg) => {
      const urls = performance.getEntriesByType('resource').map((e) => e.name).filter((u) => u.startsWith(window.location.origin));
      reg.active?.postMessage({ type: 'CACHE_URLS', urls: [window.location.href.split('#')[0], ...urls] });
    }).catch(() => { /* offline cache is optional */ });
  });
}
