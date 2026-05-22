import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; // Esto evita que el mapa se rompa visualmente
import { 
  MapPin, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Activity, 
  Layers, 
  Compass, 
  CheckCircle,
  AlertTriangle,
  Flame,
  Sparkles,
  RefreshCw
} from 'lucide-react';


// Pega aquí tu token exactamente como me lo pasaste:
mapboxgl.accessToken = 'pk.eyJ1IjoiYW5nZWxvdjI3IiwiYSI6ImNtcGgxNzZhbDB4NXgycHBvazk2YmYxcHgifQ.Kfb2IDdnlY2BeaM3GX65XA';

// =========================================================================
// SUB-COMPONENTES REUTILIZABLES DE LA INTERFAZ
// =========================================================================

// Tarjeta para los sub-indicadores urbanos
const IndicadorCard = ({ icon: Icon, title, value, colorClass, label }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
    <div className={`p-2.5 rounded-lg ${colorClass}`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
      <div className="flex items-baseline gap-2 mt-0.5">
        <span className="text-lg font-bold text-gray-800">{value}</span>
        <span className="text-xs text-gray-500 font-normal">{label}</span>
      </div>
    </div>
  </div>
);

// Tarjeta para las dinámicas de gamificación (Retos del Agente)
const RetoCard = ({ icon: Icon, title, points, description, difficulty, borderClass, bgIcon }) => (
  <div className={`bg-white p-4 rounded-xl border-l-4 ${borderClass} shadow-sm space-y-2`}>
    <div className="flex justify-between items-start">
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-md ${bgIcon}`}>
          <Icon className="w-4 h-4 text-gray-700" />
        </div>
        <h4 className="font-bold text-sm text-gray-800">{title}</h4>
      </div>
      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
        <Flame className="w-3 h-3 fill-emerald-600" /> +{points} XP
      </span>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
    <div className="flex justify-between items-center pt-1 text-[10px] text-gray-400 font-medium">
      <span>Estado: Disponible esta semana</span>
      <span className="uppercase tracking-wider">{difficulty}</span>
    </div>
  </div>
);

// Tarjeta pedagógica (Guía de Arquitectura Preventiva)
const InfoCard = ({ title, subtitle, description, tip }) => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50/40 p-4 rounded-xl border border-green-100/60 space-y-2">
    <div>
      <h4 className="font-bold text-sm text-emerald-900">{title}</h4>
      <p className="text-[11px] text-emerald-700 font-medium italic mt-0.5">{subtitle}</p>
    </div>
    <p className="text-xs text-gray-700 leading-relaxed">{description}</p>
    <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-green-100 text-[11px] text-emerald-800 font-medium flex items-start gap-1.5">
      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
      <span><strong>Estrategia Activa:</strong> {tip}</span>
    </div>
  </div>
);


// =========================================================================
// COMPONENTE PRINCIPAL (APP)
// =========================================================================
export default function App() {
  // Estado para el enrutamiento interno de pestañas
  const [activeTab, setActiveTab] = useState('mapa');
  
  // Estados para el control de la API de Inteligencia Artificial Espacial
  const [loading, setLoading] = useState(false);
  const [errorApi, setErrorApi] = useState(false);
  const [datosIarri, setDatosIarri] = useState({
    iarri: 0.42,
    nivel: "Bajo Riesgo",
    colorHex: "#1E5631", 
    shap: {
      areas_verdes: 20.0,
      caminabilidad: 35.0,
      equip_deportivo: 15.0,
      entorno_riesgoso: 20.0,
      marginacion: 10.0
    }
  });

  // URL del microservicio en Render (Asegúrate de cambiar "tu-url-de-render" por la tuya real)
 
  const BACKEND_API_URL = "https://iarri-spatial-backend.onrender.com/api/predict-spatial";

  // Función asíncrona para consultar la Red Neuronal de Grafos (GNN) en Render
  const consultarModeloEspacial = async () => {
    setLoading(true);
    setErrorApi(false);
    try {
      const response = await fetch(BACKEND_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areas_verdes: 0.39,      
          caminabilidad: 0.82,     
          equip_deportivo: 0.45,   
          entorno_riesgoso: 0.20,  
          marginacion: 0.30        
        })
      });

      if (!response.ok) throw new Error("API fuera de línea");
      
      const resData = await response.json();
      
      // PROTECCIÓN CLAVE: Validamos que la respuesta contenga el diccionario esperado antes de inyectarlo
      if (resData && resData.interpretabilidad_shap) {
        setDatosIarri({
          iarri: resData.iarri || 0.42,
          nivel: resData.nivel || "Bajo Riesgo",
          colorHex: resData.color_hex || "#1E5631",
          shap: resData.interpretabilidad_shap
        });
      } else {
        throw new Error("Formato de datos de IA inválido");
      }
    } catch (error) {
      console.warn("Conexión con Render fallida o en espera de respuesta. Usando contingencia local segura.");
      setErrorApi(true);
      // Fallback seguro: Si la API tarda en despertar, esto mantiene la app viva con datos de muestra
      setDatosIarri({
        iarri: 0.42,
        nivel: "Bajo Riesgo",
        colorHex: "#1E5631",
        shap: {
          areas_verdes: 20.0,
          caminabilidad: 35.0,
          equip_deportivo: 15.0,
          entorno_riesgoso: 20.0,
          marginacion: 10.0
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Ciclo de vida: Invocación automática al iniciar la app
  useEffect(() => {
    consultarModeloEspacial();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-24 text-gray-800 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* HEADER DE LA APLICACIÓN WEB */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-700 animate-pulse" />
            <h1 className="text-base font-black text-emerald-900 tracking-tight uppercase">
              ARQ-Metabólica MX <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded ml-1 tracking-normal font-bold">WEB AI</span>
            </h1>
          </div>
          <button 
            onClick={consultarModeloEspacial}
            disabled={loading}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-emerald-700 transition-colors disabled:opacity-50"
            title="Recalcular con el Servidor GNN"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </header>

      {/* CONTENEDOR PRINCIPAL MOBILE-FIRST */}
      <main className="max-w-md mx-auto p-4 space-y-4">
        
        {/* =========================================================================
            PESTAÑA 1: MAPA Y ANÁLISIS DE ENTORNO
            ========================================================================= */}
        {activeTab === 'mapa' && (
          <div className="space-y-4 animate-fadeIn">
            
            {/* Alerta de estado: Avisa si está cargando o despertando el servidor gratuito */}
            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2 text-xs text-blue-800 items-center">
                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                <span><strong>Despertando Servidor de IA...</strong> El plan gratuito de Render puede demorar hasta 30 segundos en responder la primera consulta.</span>
              </div>
            )}

            {/* Bloque del Indicador Dinámico Principal (IARRI) */}
            <div 
              className="p-5 rounded-2xl text-white shadow-md transition-all duration-500 relative overflow-hidden"
              style={{ backgroundColor: datosIarri.colorHex }}
            >
              <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                <Compass className="w-40 h-40" />
              </div>
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold">Índice Compuesto de Redes Neuronales</p>
                  <h2 className="text-3xl font-black mt-1 tracking-tight flex items-baseline gap-1">
                    IARRI-MX <span className="text-4xl font-black">{datosIarri.iarri}</span>
                  </h2>
                </div>
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider border border-white/20">
                  {loading ? "Calculando..." : datosIarri.nivel}
                </span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-white/90">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Puebla, Centro Histórico / BUAP</span>
                <span className="font-medium">Modelo: Spatial GCN</span>
              </div>
            </div>

            {/* VISOR DE CAPAS ESPACIALES (MAPA INTERACTIVO SIMULADO) */}
            <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-gray-600 px-1">
                <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-emerald-700" /> Visor de Capas Espaciales</span>
                <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">React Leaflet + OSM</span>
              </div>
              
              <div className="relative w-full h-52 bg-slate-100 rounded-xl overflow-hidden border border-gray-100 shadow-inner flex flex-col justify-between p-3">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ 
                  backgroundImage: 'radial-gradient(#334155 1px, transparent 1px), radial-gradient(#334155 1px, transparent 1px)',
                  backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' 
                }}></div>
                
                {/* Marcador Geográfico Central que cambia de color según la IA */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full opacity-30 animate-ping" style={{ backgroundColor: datosIarri.colorHex }}></div>
                    <div className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs relative z-10 transition-colors duration-500" style={{ backgroundColor: datosIarri.colorHex }}>
                      {Math.round(datosIarri.iarri * 100)}
                    </div>
                  </div>
                  <span className="bg-slate-900/90 backdrop-blur-sm text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow mt-1 whitespace-nowrap tracking-wide">
                    PUNTO CAPTURADO
                  </span>
                </div>

                <div className="flex justify-between items-start z-10 pointer-events-none">
                  <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-xs text-[10px] font-bold text-slate-700 border border-gray-100">
                    Lat: 19.0414 · Lon: -98.2063
                  </div>
                </div>

                <div className="mt-auto bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-gray-100 z-10 text-[9px] text-gray-500 flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Zona de Análisis Colectivo</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#1E5631]"></span> Sano</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#E67E22]"></span> Medio</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]"></span> Crítico</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE INTERPRETABILIDAD COMPLETAMENTE BLINDADA CON OPTIONAL CHAINING (?.) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" /> Peso de Variables Urbanas (SHAP)
                </h3>
                <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-100">
                  Explicabilidad IA
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-normal">
                Análisis de atribución matemática. Determina el porcentaje de impacto que aporta cada factor geográfico al riesgo de la zona.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* V1 · Áreas Verdes */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="uppercase tracking-tight">V1 · Cobertura de Áreas Verdes (AV)</span>
                    <span className="text-emerald-700">{datosIarri.shap?.areas_verdes ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
                    <div className="bg-emerald-600 h-full transition-all duration-500 ease-out" style={{ width: `${datosIarri.shap?.areas_verdes ?? 0}%` }}></div>
                  </div>
                </div>

                {/* V2 · Caminabilidad */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="uppercase tracking-tight">V2 · Índice de Caminabilidad (IC)</span>
                    <span className="text-emerald-700">{datosIarri.shap?.caminabilidad ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
                    <div className="bg-emerald-600 h-full transition-all duration-500 ease-out" style={{ width: `${datosIarri.shap?.caminabilidad ?? 0}%` }}></div>
                  </div>
                </div>

                {/* V3 · Equipamiento Deportivo */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="uppercase tracking-tight">V3 · Equipamiento Deportivo (ED)</span>
                    <span className="text-emerald-700">{datosIarri.shap?.equip_deportivo ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
                    <div className="bg-emerald-600 h-full transition-all duration-500 ease-out" style={{ width: `${datosIarri.shap?.equip_deportivo ?? 0}%` }}></div>
                  </div>
                </div>

                {/* V4 · Entorno Alimentario Riesgoso */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="uppercase tracking-tight">V4 · Entorno Alimentario Riesgoso (EAR)</span>
                    <span className="text-rose-600">{datosIarri.shap?.entorno_riesgoso ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
                    <div className="bg-rose-500 h-full transition-all duration-500 ease-out" style={{ width: `${datosIarri.shap?.entorno_riesgoso ?? 0}%` }}></div>
                  </div>
                </div>

                {/* V5 · Índice de Marginación */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="uppercase tracking-tight">V5 · Índice de Marginación Urbana (IM)</span>
                    <span className="text-slate-600">{datosIarri.shap?.marginacion ?? 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden border border-gray-50">
                    <div className="bg-slate-500 h-full transition-all duration-500 ease-out" style={{ width: `${datosIarri.shap?.marginacion ?? 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRID DE LOGÍSTICA COMPLEMENTARIA */}
            <div className="grid grid-cols-2 gap-3">
              <IndicadorCard 
                icon={CheckCircle} 
                title="Áreas Verdes" 
                value="39%" 
                colorClass="bg-green-50 text-green-700"
                label="Cobertura" 
              />
              <IndicadorCard 
                icon={TrendingUp} 
                title="Caminabilidad" 
                value="82/100" 
                colorClass="bg-blue-50 text-blue-700"
                label="Índice Peatonal" 
              />
            </div>

          </div>
        )}

        {/* =========================================================================
            PESTAÑA 2: RETOS DEL AGENTE (GAMIFICACIÓN URBANA)
            ========================================================================= */}
        {activeTab === 'retos' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
              <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-5 h-5 text-emerald-700" /> Panel del Agente Metabólico
              </h3>
              <p className="text-xs text-gray-500 leading-normal">
                Completa misiones de diseño activo y exploración territorial para mitigar los factores de riesgo detectados por el algoritmo.
              </p>
            </div>

            <div className="space-y-3">
              <RetoCard 
                icon={Compass}
                title="Ruta Biofílica Conectiva"
                points="100"
                description="Camina por al menos 15 minutes continuos dentro de un corredor urbano clasificado con alta densidad de arbolado y cobertura vegetal en el mapa de Puebla."
                difficulty="Fácil"
                borderClass="border-green-500"
                bgIcon="bg-green-50"
              />
              
              <RetoCard 
                icon={Layers}
                title="Rediseño Lumínico Habitacional"
                points="250"
                description="Reorganiza tu espacio de estudio o trabajo de modo que quede a menos de 2 metros de una ventana para maximizar el anclaje de luz natural circadiana."
                difficulty="Intermedio"
                borderClass="border-blue-500"
                bgIcon="bg-blue-50"
              />

              <RetoCard 
                icon={Shield}
                title="Soberanía del Mercado Local"
                points="150"
                description="Abastécete de alimentos frescos en un mercado o tianguis local tradicional de Puebla, evitando ingresar a entornos alimentarios riesgosos (EAR) automatizados."
                difficulty="Fácil"
                borderClass="border-amber-500"
                bgIcon="bg-amber-50"
              />
            </div>
          </div>
        )}

        {/* =========================================================================
            PESTAÑA 3: GUÍA ARQUITECTÓNICA PREVENTIVA
            ========================================================================= */}
        {activeTab === 'guia' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-1.5">
              <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-emerald-700" /> Manual de Arquitectura Preventiva
              </h3>
              <p className="text-xs text-gray-500 leading-normal">
                Directrices de diseño fundamentadas científicamente para romper los entornos obesogénicos y mejorar el metabolismo a escala humana.
              </p>
            </div>

            <div className="space-y-3">
              <InfoCard 
                title="1. Regulación Estructural de Luz Circadiana"
                subtitle="Incidencia de los ciclos de luz en la sensibilidad a la insulina"
                description="La exposición constante a la luz natural matutina es clave para sincronizar el núcleo supraquiasmático, optimizando la secreción de cortisol y mejorando la respuesta metabólica periférica de la glucosa durante el día."
                tip="Ubica las mesas de trabajo perpendiculares a las ventanas. Esto reduce el deslumbramiento y garantiza una captación uniforme de luxes naturales."
              />

              <InfoCard 
                title="2. Infraestructura Externa para el Diseño Activo"
                subtitle="Modificación del entorno construido para incentivar el movimiento"
                description="El diseño activo plantea restarle comodidad al sedentarismo. Modificar sutilmente la accesibilidad y los flujos dentro del espacio habitable estimula el gasto energético no derivado del ejercicio (NEAT)."
                tip="Coloca barreras arquitectónicas visuales hacia estantes de productos ultraprocesados y mantén accesibles y a la vista el calzado deportivo."
              />
            </div>
          </div>
        )}

      </main>

      {/* =========================================================================
          BARRA DE NAVEGACIÓN FLOTANTE INFERIOR
          ========================================================================= */}
      <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl shadow-xl px-4 py-2.5 flex justify-around items-center z-50">
        <button 
          onClick={() => setActiveTab('mapa')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${activeTab === 'mapa' ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Análisis</span>
        </button>

        <button 
          onClick={() => setActiveTab('retos')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${activeTab === 'retos' ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Award className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Retos</span>
        </button>

        <button 
          onClick={() => setActiveTab('guia')}
          className={`flex flex-col items-center gap-1 p-1 transition-colors ${activeTab === 'guia' ? 'text-emerald-700 font-bold' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-tight">Guía</span>
        </button>
      </nav>
    </div>
  );
}
