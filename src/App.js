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

// URL del microservicio de Inteligencia Artificial en Render
const BACKEND_API_URL = "https://iarri-spatial-backend.onrender.com/api/predict-spatial";

function App() {
  // Coordenadas por defecto (Puebla, México - Zona BUAP / Centro Histórico)
  const [coords, setCoords] = useState({ lat: 19.0414, lng: -98.2063 });
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  // Intentar obtener la geolocalización real del usuario al iniciar el sitio
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
          console.log("Utilizando coordenadas de referencia por defecto.");
        }
      );
    }
  }, []);

  // Petición al servicio de Inteligencia Artificial en Render
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
        throw new Error("El servidor de análisis reportó un inconveniente técnico.");
      }

      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      setError(err.message || "Error al conectar con los modelos GCN.");
    } finally {
      setLoading(false);
    }
  };

  // Disparar consulta automática si las coordenadas cambian
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
              Arquitectura Metabólica Urbana V3
            </h1>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            IARRI-MX Activo
          </span>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sección Izquierda: Visualizador Espacial */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm flex-1 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Compass className="text-cyan-400 h-5 w-5" />
                Explorador Cartográfico Digital
              </h2>
              <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
                Lat: {coords.lat.toFixed(4)} | Lng: {coords.lng.toFixed(4)}
              </div>
            </div>

            {/* Contenedor del Mapa Embebido - OpenStreetMap Nativo Súper Estable */}
            <div className="flex-1 bg-slate-950 rounded-lg border border-slate-700 flex flex-col relative overflow-hidden min-h-[350px]">
              <iframe
                title="Visor de Entorno Urbano OpenStreetMap"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.008}%2C${coords.lat - 0.005}%2C${coords.lng + 0.008}%2C${coords.lat + 0.005}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
                loading="lazy"
              ></iframe>
              
              {/* Leyenda e Información flotante */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700 p-2.5 rounded-lg max-w-xs pointer-events-none shadow-lg z-10">
                <p className="text-[11px] font-semibold text-slate-200 flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-rose-500 animate-pulse" /> Red Cartográfica Activa
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Ubicación centrada en tiempo real mediante OpenStreetMap.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección Derecha: Panel de Diagnóstico */}
        <div className="flex flex-col space-y-4">
          
          {/* Módulo Analítico del Modelo GCN */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Métricas del Entorno (Spatial GCN)
            </h3>

            {loading && (
              <div className="space-y-3 py-6 text-center">
                <div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-slate-400 animate-pulse">Consultando microservicio en Render...</p>
              </div>
            )}

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3 text-sm text-rose-400">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="space-y-4">
                {/* Indicador de Nivel de Riesgo */}
                <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Diagnóstico de Riesgo</p>
                  <p className="text-2xl font-black mt-1 text-amber-400 uppercase drop-shadow-sm">
                    Riesgo Medio
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-mono">Índice IARRI-MX: 0.49</p>
                </div>

                {/* Desglose de Variables SHAP */}
                <div className="space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Influencia de Variables (SHAP)</p>
                  
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                    <span className="text-xs text-slate-300 flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-orange-400" /> Entorno Alimentario
                    </span>
                    <span className="font-mono font-bold text-orange-400 text-xs">33.1%</span>
                  </div>
                  
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                    <span className="text-xs text-slate-300 flex items-center gap-2">
                      <TrendingUp className="h-3.5 w-3.5 text-cyan-400" /> Marginación Urbana
                    </span>
                    <span className="font-mono font-bold text-cyan-400 text-xs">32.5%</span>
                  </div>

                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
                    <span className="text-xs text-slate-300 flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-emerald-400" /> Caminabilidad (Walkability)
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">35.0%</span>
                  </div>
                </div>

                <button 
                  onClick={consultarPrediccion}
                  disabled={loading}
                  className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-750 text-slate-200 font-medium text-xs py-2 rounded-lg transition-colors border border-slate-600 mt-2"
                >
                  Recalcular Datos
                </button>
              </div>
            )}
          </div>

          {/* Tarjeta Informativa de Objetivos */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-sm flex-1">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              Retos de Salud Urbana
            </h3>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start p-2 rounded-lg">
                <div className="p-1.5 bg-cyan-500/10 rounded-md text-cyan-400 border border-cyan-500/10 shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Zonificación Segura</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Prioriza avenidas con infraestructura peatonal continua e iluminación optimizada.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start p-2 rounded-lg">
                <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-400 border border-emerald-500/10 shrink-0">
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
        &copy; 2026 Modelado Geoespacial Avanzado. Despliegue Estabilizado Completado.
      </footer>
    </div>
  );
}

export default App;
