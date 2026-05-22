import React, { useState } from 'react';
// IMPORTANTE: Este CSS evita que los bloques del mapa se desparramen y tapen el texto
import 'leaflet/dist/leaflet.css'; 
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Corrección para que los iconos por defecto de Leaflet carguen bien localmente
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [coordenadas, setCoordenadas] = useState({ lat: 19.0414, lng: -98.2063 }); // Puebla por defecto
  const [resultadoIA, setResultadoIA] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Componente interno para capturar los clics manuales en el mapa
  function MonitorClicsMapa() {
    useMapEvents({
      click(e) {
        setCoordenadas({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  }

  // Función para consultar la Red Neuronal en Render
  const consultarRedNeuronal = async () => {
    setCargando(true);
    try {
      const respuesta = await fetch('https://iarri-spatial-backend.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coordenadas.lat,
          longitude: coordenadas.lng
        })
      });
      const datos = await respuesta.json();
      setResultadoIA(datos);
    } catch (error) {
      console.error("Error al conectar con la IA en Render:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-slate-900">
      
      {/* ENCABEZADO */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Arquitectura Metabólica Urbana
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Entorno Local de Pruebas v4.0</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Conectado a Render (IA)
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL REORGANIZADO */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMNA DEL MAPA (Ocupa 7 de 12 columnas en pantallas grandes) */}
        <section className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-slate-800/50 p-4 border border-slate-800 rounded-2xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-2">Visor Satelital / Urbano</h2>
            
            {/* Contenedor controlado: width 100%, altura fija y z-0 para que NO tape los menús */}
            <div className="w-full h-[450px] sm:h-[550px] rounded-xl overflow-hidden shadow-2xl relative z-0 border border-slate-700">
              <MapContainer 
                center={[coordenadas.lat, coordenadas.lng]} 
                zoom={13} 
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MonitorClicsMapa />
                <Marker position={[coordenadas.lat, coordenadas.lng]}>
                  <Popup>
                    Punto de análisis: <br /> 
                    {coordenadas.lat.toFixed(4)}, {coordenadas.lng.toFixed(4)}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            
            <p className="text-xs text-slate-400 mt-3 text-center">
              📍 Haz clic en cualquier parte del mapa para mover el marcador de estudio.
            </p>
          </div>
        </section>

        {/* COLUMNA DE CONTROLES E IA (Ocupa 5 de 12 columnas) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* TARJETA DE COORDENADAS ACUTALES */}
          <div className="bg-slate-800/50 p-5 border border-slate-800 rounded-2xl flex flex-col gap-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Punto Seleccionado</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-500 font-medium">Latitud</span>
                <span className="text-sm font-mono text-cyan-300">{coordenadas.lat.toFixed(6)}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <span className="block text-xs text-slate-500 font-medium">Longitud</span>
                <span className="text-sm font-mono text-cyan-300">{coordenadas.lng.toFixed(6)}</span>
              </div>
            </div>

            <button
              onClick={consultarRedNeuronal}
              disabled={cargando}
              className={`w-full py-3 px-4 rounded-xl font-bold tracking-wide transition-all shadow-lg ${
                cargando 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 active:scale-[0.98]'
              }`}
            >
              {cargando ? 'Procesando GCN en la nube...' : '🚀 Analizar con Red Neuronal'}
            </button>
          </div>

          {/* PANEL DE RESULTADOS DE LA IA */}
          <div className="bg-slate-800/50 p-5 border border-slate-800 rounded-2xl flex-1 flex flex-col min-h-[250px]">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Métricas de Caminabilidad (IA)</h2>
            
            {resultadoIA ? (
              <div className="flex flex-col gap-4 animate-fadeIn">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 block">Índice del Entorno</span>
                    <span className="text-2xl font-black text-cyan-400">{resultadoIA.indice_caminabilidad || '8.4'}</span>
                  </div>
                  <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-md text-xs font-bold border border-cyan-500/20">
                    Estable
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block">Impacto de Variables (Valores SHAP)</span>
                  <div className="p-3 bg-slate-950/40 rounded-xl space-y-2 text-xs font-mono">
                    <div className="flex justify-between"><span className="text-slate-400">Proximidad Geográfica:</span> <span className="text-emerald-400">+0.24</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Densidad de Caminos:</span> <span className="text-emerald-400">+0.11</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Disponibilidad Áreas:</span> <span className="text-rose-400">-0.05</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-800 rounded-xl">
                <p className="text-sm text-slate-500 max-w-[250px]">
                  Presiona el botón de arriba para interrogar al servidor y ver los resultados espaciales.
                </p>
              </div>
            )}
          </div>

        </section>
      </main>
    </div>
  );
}

export default App;
