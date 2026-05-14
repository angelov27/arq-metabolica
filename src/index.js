import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration'; // <--- ESTA ES LA LÍNEA QUE TE FALTA
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Cambia 'unregister()' a 'register()' para activar la PWA
serviceWorkerRegistration.register(); // <--- ESTO ACTIVA LA INSTALACIÓN EN MÓVIL

reportWebVitals();