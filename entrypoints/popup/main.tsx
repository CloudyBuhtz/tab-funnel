import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Popup.tsx';
import '@/assets/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
