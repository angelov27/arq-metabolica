import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Heart, Map as MapIcon, ChevronRight, Info, 
  CheckCircle, Zap, Shield, AlertTriangle, Home, 
  Navigation, ShoppingCart, Award, User
} from 'lucide-react';

// --- COMPONENTES AUXILIARES ---

const Indicador = ({ label, valor, color }) => (
  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
    <p className="text-xs text-gray-500 uppercase font-bold">{label}</p>
    <p className={`text-xl font-black ${color}`}>{valor}</p>
  </div>
);

const RetoCard = ({ titulo, puntos, dificultad, icono: Icono, color }) => (
  <div className="bg-white p-4 rounded-xl border-l-4 shadow-sm mb-3 flex items-center justify-between" style={{ borderLeftColor: color }}>
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
        <Icono size={20} style={{ color: color }} />
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-sm">{titulo}</h4>
        <p className="text-xs text-gray-500">{dificultad} • {puntos} XP</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-gray-300" />
  </div>
);

const InfoCard = ({ titulo, descripcion, icono: Icono }) => (
  <div className="bg-green-50 p-4 rounded-xl mb-3 flex gap-3">
    <div className="text-green-600"><Icono size={24} /></div>
    <div>
      <h4 className="font-bold text-green-800 text-sm">{titulo}</h4>
      <p className="text-xs text-green-700 leading-relaxed">{descripcion}</p>
    </div>
  </div>
);

// --- VISTA DE MAPA ---
const MapaPuebla = ({ zona }) => {
  const position = [19.0414, -98.2063]; // Centro de Puebla
  
  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden shadow-inner relative">
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle 
          center={position} 
          pathOptions={{ color: zona.riesgo === 'Bajo' ? '#22c55e' : '#ef4444', fillColor: zona.riesgo === 'Bajo' ? '#22c55e' : '#ef4444' }} 
          radius={500}
        >
          <Popup>Zona: {zona.nombre}<br/>Riesgo: {zona.riesgo}</Popup>
        </Circle>
      </MapContainer>
      <div className="absolute top-2 right-2 z-[1000] bg-white/90 p-2 rounded-lg text-[10px] font-bold shadow-md">
        ZONA: {zona.nombre.toUpperCase()}
      </div>
    </div>
  );
};

// --- APLICACIÓN PRINCIPAL ---
export default function App() {
  const [tab, setTab] = useState('mapa');
  const [userXP, setUserXP] = useState(1250);

  const datosZona = {
    nombre: "Centro Histórico / BUAP",
    av: "65%",
    ic: "82%",
    ear: "Alto",
    riesgo: "Bajo"
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white p-6 pt-12 rounded-b-[32px] shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-black text-blue-900">ARQ-Metabólica <span className="text-green-500 text-sm">MX</span></h1>
            <p className="text-gray-500 text-xs font-medium">Arquitectura Preventiva • Puebla</p>
          </div>
          <div className="bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
            <Award size={14} className="text-green-600" />
            <span className="text-xs font-bold text-green-700">{userXP} XP</span>
          </div>
        </div>
      </header>

      <main className="p-5">
        {tab === 'mapa' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black flex items-center gap-2">
              <MapIcon size={20} className="text-blue-600" /> Análisis de Entorno
            </h2>
            <MapaPuebla zona={datosZona} />
            <div className="grid grid-cols-3 gap-3">
              <Indicador label="Áreas Verdes" valor={datosZona.av} color="text-green-600" />
              <Indicador label="Peatonal" valor={datosZona.ic} color="text-blue-600" />
              <Indicador label="Riesgo" valor={datosZona.riesgo} color="text-green-500" />
            </div>
            <div className="bg-blue-900 p-4 rounded-2xl text-white flex items-center justify-between shadow-lg shadow-blue-200">
              <div>
                <p className="text-[10px] opacity-80 font-bold uppercase">Tu Índice IARRI</p>
                <p className="text-2xl font-black">0.42 <span className="text-sm font-normal opacity-70">Sano</span></p>
              </div>
              <Shield size={32} className="opacity-50" />
            </div>
          </div>
        )}

        {tab === 'retos' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Zap size={20} className="text-yellow-500" /> Retos del Agente
            </h2>
            <RetoCard titulo="Ruta Biofílica" puntos="100" dificultad="Fácil" icono={Navigation} color="#22c55e" />
            <RetoCard titulo="Rediseño Lumínico" puntos="250" dificultad="Medio" icono={Home} color="#3b82f6" />
            <RetoCard titulo="Mercado Local" puntos="150" dificultad="Fácil" icono={ShoppingCart} color="#f59e0b" />
          </div>
        )}

        {tab === 'guia' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black flex items-center gap-2">
              <Info size={20} className="text-green-600" /> Guía Arquitectónica
            </h2>
            <InfoCard 
              titulo="Luz Circadiana" 
              descripcion="Ubica tu escritorio a menos de 2 metros de una ventana para regular tu insulina." 
              icono={Zap} 
            />
            <InfoCard 
              titulo="Diseño Activo" 
              descripcion="Crea obstáculos visuales hacia la cocina y deja tus tenis a la vista." 
              icono={Heart} 
            />
          </div>
        )}
      </main>

      {/* Navegación Inferior */}
      <nav className="fixed bottom-6 left-5 right-5 bg-white/90 backdrop-blur-md h-16 rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-around px-2 z-[2000]">
        <button onClick={() => setTab('mapa')} className={`flex flex-col items-center ${tab === 'mapa' ? 'text-blue-600' : 'text-gray-400'}`}>
          <MapIcon size={20} />
          <span className="text-[10px] font-bold mt-1">Mapa</span>
        </button>
        <button onClick={() => setTab('retos')} className={`flex flex-col items-center ${tab === 'retos' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Zap size={20} />
          <span className="text-[10px] font-bold mt-1">Retos</span>
        </button>
        <button onClick={() => setTab('guia')} className={`flex flex-col items-center ${tab === 'guia' ? 'text-blue-600' : 'text-gray-400'}`}>
          <Info size={20} />
          <span className="text-[10px] font-bold mt-1">Guía</span>
        </button>
      </nav>
    </div>
  );
}