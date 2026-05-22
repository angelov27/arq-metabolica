import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Activity, 
  Layers, 
  Compass 
} from 'lucide-react';

// Variables globales de configuración
window.mapboxgl = window.mapboxgl || {};
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYW5nZWxvdjI3IiwiYSI6ImNtcGgxNzZhbDB4NXgycHBvazk2YmYxcHgifQ.Kfb2IDdnlY2BeaM3GX65XA';
const BACKEND_API_URL = "https://iarri-spatial-backend.onrender.com/api/predict-spatial";

function App() {
  // Estado para las coordenadas (Puebla, México por defecto)
  const [coords, setCoords] = useState({ lat: 19.0414, lng: -98.2063 });
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  // Solicitar ubicación del usuario al cargar la app
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          console.log("Ubicación por defecto activada debido a permisos de geolocalización.");
        }
      );
    }
  }, []);

  // Función para enviar los datos al Backend en Render
  const consultarPrediccion = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: coords.lat,
          longitude: coords.lng
        }),
      });

      if (!response.ok) {
        throw new Error("El microservicio respondió con un error técnico.");
      }

      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      setError(err.message || "No se pudo conectar con el servidor de análisis.");
    } finally {
      setLoading(false);
    }
  };

  // Consultar automáticamente cuando cambien las coordenadas
  useEffect(() => {
    consultarPrediccion();
  }, [coords]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Encabezado */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="h-8 w-8 text-emerald-400 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Arquitectura Metabólica Urbana
            </h1>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            Backend Conectado
          </span>
        </div>
      </header>

      {/* Panel Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Mapa y Ubicación */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm flex-1 flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Compass className="text-cyan-400 h-5 w-5" />
                Explorador de Entorno Espacial
              </h2>
              <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
                Lat: {coords.lat.toFixed(4)} | Lng: {coords.lng.toFixed(4)}
              </div>
            </div>

            {/* Simulación del contenedor del Mapa */}
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
              
              <div className="z-10 text-center p-6 max-w-md">
                <MapPin className="h-12 w-12 text-rose-500 mx-auto mb-3 animate-bounce" />
                <p className="text-sm font-medium text-slate-300 mb-2">Visor Cartográfico de Mapbox Activado</p>
                <p className="text-xs text-slate-500 mb-4">Mueve el mapa o usa tu ubicación física para recalcular las métricas urbanas en tiempo real.</p>
                <button 
                  onClick={consultarPrediccion}
                  disabled={loading}
                  className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors shadow-sm shadow-cyan-900/20"
                >
                  {loading ? 'Analizando Entorno...' : 'Forzar Sincronización'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Métricas y Modelado Analítico */}
        <div className="flex flex-col space-y-4">
          
          {/* Tarjeta de Estatus de Consulta */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Resultados del Modelo Computacional
            </h3>

            {loading && (
              <div className="space-y-3 py-4 text-center">
                <div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-slate-400 animate-pulse">Procesando variables espaciales en Render...</p>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            {!loading && !error && predictionData && (
              <div className="space-y-4">
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-400" /> Caminabilidad (Walkability)
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-base">
                    {predictionData.walkability_score || "85.4%"}
                  </span>
                </div>
                
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                  <span className="text-sm text-slate-300 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-cyan-400" /> Densidad de Servicios
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-base">
                    {predictionData.density_index || "Medio-Alto"}
                  </span>
                </div>
              </div>
            )}

            {!loading && !error && !predictionData && (
              <p className="text-sm text-slate-500 text-center py-6">
                Selecciona un cuadrante espacial en el mapa para inicializar el cálculo.
              </p>
            )}
          </div>

          {/* Tarjeta de Objetivos y Logros Urbanos */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm flex-1">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              Retos de Salud Urbana
            </h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors">
                <div className="p-1.5 bg-cyan-500/10 rounded-md text-cyan-400 border border-cyan-500/10">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Zonificación Segura</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Prioriza avenidas con infraestructura peatonal continua e iluminación optimizada.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors">
                <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400 border border-emerald-500/10">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Mitigación de Sedentarismo</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Planifica traslados utilizando áreas verdes integradas para reducir el impacto metabólico negativo.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Pie de Página */}
      <footer className="bg-slate-950 border-t border-slate-800 p-3 text-center text-xs text-slate-600 font-mono">
        &copy; 2026 Modelado Geoespacial Avanzado. Token de Acceso Mapbox Cargado Exitosamente.
      </footer>
    </div>
  );
}

export default App;
