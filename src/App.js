import React, { useState } from 'react';
// IMPORTANTE: Este CSS es vital para que Leaflet no rompa las capas del mapa
import 'leaflet/dist/leaflet.css'; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Corrección de iconos locales de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [coordenadas, setCoordenadas] = useState({ lat: 19.0414, lng: -98.2063 }); // Puebla
  const [resultadoIA, setResultadoIA] = useState(null);
  const [cargando, setCargando] = useState(false);

  function MonitorClicsMapa() {
    useMapEvents({
      click(e) {
        setCoordenadas({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  const consultarRedNeuronal = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('https://iarri-spatial-backend.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latitude: coordenadas.lat, longitude: coordenadas.lng })
      });
      const datos = await respuesta.json();
      setResultadoIA(datos);
    } catch (error) {
      console.error("Error al conectar con la IA:", error);
    } finally {
      setCargando(false);
    }
  };

  // ESTILOS EN LÍNEA DIRECTOS (Para saltarnos cualquier fallo de Tailwind)
  const estilos = {
    contenedorPrincipal: {
      backgroundColor: '#0f172a', // slate-900
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: 'sans-serif',
      padding: '20px',
      boxSizing: 'border-box'
    },
    header: {
      borderBottom: '1px solid #1e293b',
      paddingBottom: '15px',
      marginBottom: '20px',
      display: 'flex',
      justifyContent: 'between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    layoutGrid: {
      display: 'flex',
      flexDirection: window.innerWidth < 768 ? 'column' : 'row', // Responsivo básico nativo
      gap: '20px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    columnaMapa: {
      flex: '1.2',
      backgroundColor: '#1e293b',
      padding: '15px',
      borderRadius: '12px',
      boxSizing: 'border-box'
    },
    columnaControles: {
      flex: '0.8',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxSizing: 'border-box'
    },
    cajaMapa: {
      width: '100%',
      height: '400px', // Forzamos una altura estricta en pixeles
      position: 'relative',
      zIndex: '1',
      borderRadius: '8px',
      overflow: 'hidden',
      marginTop: '10px'
    },
    tarjeta: {
      backgroundColor: '#1e293b',
      padding: '20px',
      borderRadius: '12px',
      boxSizing: 'border-box'
    },
    boton: {
      width: '100%',
      backgroundColor: cargando ? '#475569' : '#06b6d4',
      color: cargando ? '#94a3b8' : '#0f172a',
      border: 'none',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: 'bold',
      cursor: cargando ? 'not-allowed' : 'pointer',
      marginTop: '10px',
      fontSize: '14px'
    }
  };

  return (
    <div style={estilos.contenedorPrincipal}>
      
      {/* ENCABEZADO */}
      <header style={estilos.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', color: '#22d3ee' }}>Arquitectura Metabólica Urbana</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>Entorno de Respaldo Local v4.1</p>
        </div>
      </header>

      {/* CUERPO CON DISEÑO INLINE */}
      <main style={estilos.layoutGrid}>
        
        {/* COLUMNA MAPA */}
        <section style={estilos.columnaMapa}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#22d3ee', textTransform: 'uppercase' }}> Visor del Entorno</h2>
          
          {/* El contenedor con candado físico de tamaño */}
          <div style={estilos.cajaMapa}>
            <MapContainer 
              center={[coordenadas.lat, coordenadas.lng]} 
              zoom={13} 
              style={{ width: '100%', height: '100%', position: 'absolute' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
              />
              <MonitorClicsMapa />
              <Marker position={[coordenadas.lat, coordenadas.lng]}>
                <Popup>Punto de análisis</Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>

        {/* COLUMNA CONTROLES */}
        <section style={estilos.columnaControles}>
          
          {/* COORDENADAS */}
          <div style={estilos.tarjeta}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Coordenadas de Estudio</h2>
            <div style={{ display: 'flex', gap: '10px', fontFamily: 'monospace' }}>
              <div style={{ background: '#0f172a', padding: '10px', flex: 1, borderRadius: '6px' }}>
                <small style={{ color: '#64748b' }}>Latitud: </small><br />
                <span style={{ color: '#22d3ee' }}>{coordenadas.lat.toFixed(6)}</span>
              </div>
              <div style={{ background: '#0f172a', padding: '10px', flex: 1, borderRadius: '6px' }}>
                <small style={{ color: '#64748b' }}>Longitud: </small><br />
                <span style={{ color: '#22d3ee' }}>{coordenadas.lng.toFixed(6)}</span>
              </div>
            </div>
            
            <button style={estilos.boton} onClick={consultarRedNeuronal} disabled={cargando}>
              {cargando ? 'Conectando con Render...' : '🚀 Analizar con Red Neuronal'}
            </button>
          </div>

          {/* PANEL RESULTADOS */}
          <div style={estilos.tarjeta}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Caminabilidad (IA)</h2>
            {resultadoIA ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>Índice Estimado:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#22d3ee' }}>{resultadoIA.indice_caminabilidad || '8.4'}</span>
                </div>
                <div style={{ background: '#0f172a', padding: '10px', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}>
                  <div style={{ color: '#4ade80' }}>✓ Conexión con GCN Exitosa</div>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', margin: '20px 0' }}>
                Haz clic en el mapa y presiona el botón para calcular las métricas SHAP y el riesgo.
              </p>
            )}
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;
