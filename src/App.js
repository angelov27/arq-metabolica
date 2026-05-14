import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import { 
  Trees, Footprints, Utensils, BookOpen, Home, Map as MapIcon, 
  Activity, ClipboardList, ChevronRight, Trophy, Wind, Sun, Leaf 
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Generador de datos aleatorios según ubicación para simular el análisis territorial
const generarDatos = (lat, lng) => ({
  av: (Math.abs(Math.sin(lat)) * 0.8 + 0.1).toFixed(2),
  ic: (Math.abs(Math.cos(lng)) * 0.7 + 0.2).toFixed(2),
  ear: (Math.abs(Math.sin(lat + lng)) * 0.6 + 0.3).toFixed(2)
});

export default function App() {
  const [seccion, setSeccion] = useState('cuestionario');
  const [pos, setPos] = useState([19.0413, -98.2062]); // Puebla
  const [datos, setDatos] = useState({ av: 0.80, ic: 0.60, ear: 0.45 });
  const [puntosQuiz, setPuntosQuiz] = useState(0);
  const [insignias, setInsignias] = useState(0);

  useEffect(() => {
    setDatos(generarDatos(pos[0], pos[1]));
  }, [pos]);

  const iarri = ((0.2 * (1 - datos.av)) + (0.3 * (1 - datos.ic)) + (0.5 * datos.ear)).toFixed(2);
  const nivelRiesgo = iarri < 0.40 ? "BAJO" : iarri < 0.70 ? "MEDIO" : "ALTO";
  const colorRiesgo = iarri < 0.40 ? "#4ADE80" : iarri < 0.70 ? "#FACC15" : "#F87171";

  return (
    <div style={{ backgroundColor: '#F1F5F9', minHeight: '100vh', paddingBottom: '100px', fontFamily: 'sans-serif' }}>
      
      <header style={{ backgroundColor: '#005B96', color: 'white', padding: '18px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>ARQ-METABÓLICA MX</h1>
        <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.9 }}>Agente Metabólico: Angel López</p>
      </header>

      <main style={{ maxWidth: '500px', margin: 'auto', padding: '15px' }}>
        
        {/* SECCIÓN 1: SALUD (Cuestionario) */}
        {seccion === 'cuestionario' && (
          <div className="fade-in">
            <h2 style={{ fontSize: '1.1rem', color: '#1E293B', marginBottom: '12px' }}>Tamizaje de Riesgo (FINDRISC)</h2>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
               <QuizItem label="¿Realiza al menos 30 min de ejercicio?" puntos={2} onAdd={(p) => setPuntosQuiz(puntosQuiz + p)} />
               <QuizItem label="¿Consume verduras y frutas diario?" puntos={1} onAdd={(p) => setPuntosQuiz(puntosQuiz + p)} />
               <QuizItem label="¿Tiene familiares con diabetes?" puntos={5} onAdd={(p) => setPuntosQuiz(puntosQuiz + p)} />
               <QuizItem label="¿Su cintura mide más de 94cm (H)?" puntos={4} onAdd={(p) => setPuntosQuiz(puntosQuiz + p)} />
               
               <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#F8FAFC', borderRadius: '15px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.8rem', margin: 0 }}>Puntaje Acumulado</p>
                  <h3 style={{ fontSize: '2rem', margin: '5px 0', color: '#005B96' }}>{puntosQuiz}</h3>
                  <p style={{ fontSize: '0.7rem', color: puntosQuiz > 10 ? '#F87171' : '#64748B' }}>
                    {puntosQuiz > 10 ? "RIESGO ELEVADO: Revisa el mapa de tu entorno." : "Riesgo bajo. Mantén tus hábitos activos."}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* SECCIÓN 2: MAPA E IARRI */}
        {seccion === 'mapa' && (
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#64748B', margin: 0 }}>Índice IARRI</p>
                    <h3 style={{ fontSize: '2rem', margin: 0, color: colorRiesgo }}>{iarri}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: colorRiesgo, color: 'white', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 'bold' }}>RIESGO {nivelRiesgo}</span>
                  </div>
               </div>
               <MiniBar label="Áreas Verdes" val={datos.av} color="#22C55E" />
               <MiniBar label="Caminabilidad" val={datos.ic} color="#3B82F6" />
               <MiniBar label="Entorno Alimentario" val={datos.ear} color="#F97316" />
            </div>

            <div style={{ height: '50vh', borderRadius: '25px', overflow: 'hidden', border: '4px solid white', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
              <MapContainer center={pos} zoom={15} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapClickEvents setPos={setPos} />
                <Circle center={pos} pathOptions={{ color: colorRiesgo, fillColor: colorRiesgo, fillOpacity: 0.3 }} radius={400} />
                <Marker position={pos}><Popup>Zona de Análisis</Popup></Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* SECCIÓN 3: RETOS (Gamificación) */}
        {seccion === 'retos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
               <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Retos de Agente</h3>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#FEF3C7', padding: '4px 10px', borderRadius: '15px' }}>
                  <Trophy size={14} color="#D97706" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#D97706' }}>{insignias} Logros</span>
               </div>
            </div>
            
            <CategoryTitle title="Hogar Saludable" />
            <RetoItem icon={<Wind />} title="Ventilación Cruzada" desc="Abre ventanas opuestas 15 min." xp="+30" onDone={() => setInsignias(insignias + 1)} />
            <RetoItem icon={<Home />} title="Rincón de Luz" desc="Estudia junto a luz natural hoy." xp="+20" onDone={() => setInsignias(insignias + 1)} />
            
            <CategoryTitle title="Entorno Activo" />
            <RetoItem icon={<Footprints />} title="Ruta con Sombra" desc="Camina por calles arboladas." xp="+50" onDone={() => setInsignias(insignias + 1)} />
            <RetoItem icon={<Trees />} title="Guardia del Parque" desc="Visita un área verde local." xp="+60" onDone={() => setInsignias(insignias + 1)} />
          </div>
        )}

        {/* SECCIÓN 4: GUÍA (Arquitectura) */}
        {seccion === 'arquitectura' && (
          <div style={{ display: 'grid', gap: '15px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Guía de Arquitectura Preventiva</h3>
            <InfoCard icon={<Leaf color="#22C55E"/>} title="Huertos Verticales" desc="Instala plantas como la 'Lengua de Suegra' para purificar el aire en espacios cerrados." />
            <InfoCard icon={<Sun color="#FACC15"/>} title="Ritmo Circadiano" desc="La exposición a luz solar matutina regula la producción de insulina. Mantén cortinas abiertas." />
            <InfoCard icon={<Wind color="#38BDF8"/>} title="Calidad del Aire" desc="El CO2 acumulado aumenta el estrés oxidativo. La ventilación natural es tu mejor aliada." />
            <button style={{ backgroundColor: '#005B96', color: 'white', padding: '16px', borderRadius: '15px', border: 'none', fontWeight: 'bold', marginTop: '10px', boxShadow: '0 4px 10px rgba(0,91,150,0.3)' }}>
               GENERAR REPORTE PDF
            </button>
          </div>
        )}

      </main>

      {/* BARRA DE NAVEGACIÓN DE ALTO CONTRASTE */}
      <nav style={{ position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#0F172A', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 1000, borderTop: '2px solid #334155' }}>
        <NavBtn icon={<ClipboardList />} label="Salud" active={seccion === 'cuestionario'} onClick={() => setSeccion('cuestionario')} />
        <NavBtn icon={<MapIcon />} label="Mapa" active={seccion === 'mapa'} onClick={() => setSeccion('mapa')} />
        <NavBtn icon={<Activity />} label="Retos" active={seccion === 'retos'} onClick={() => setSeccion('retos')} />
        <NavBtn icon={<BookOpen />} label="Guía" active={seccion === 'arquitectura'} onClick={() => setSeccion('arquitectura')} />
      </nav>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---

const MapClickEvents = ({ setPos }) => {
  useMapEvents({ click(e) { setPos([e.latlng.lat, e.latlng.lng]); } });
  return null;
};

const QuizItem = ({ label, puntos, onAdd }) => {
  const [done, setDone] = useState(false);
  return (
    <div onClick={() => { if(!done){ onAdd(puntos); setDone(true); }}} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #F1F5F9', cursor: 'pointer', opacity: done ? 0.4 : 1 }}>
      <span style={{ fontSize: '0.85rem', color: '#334155' }}>{label}</span>
      <ChevronRight size={18} color="#94A3B8" />
    </div>
  );
};

const MiniBar = ({ label, val, color }) => (
  <div style={{ marginBottom: '10px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', marginBottom: '3px', fontWeight: 'bold' }}>
      <span>{label}</span><span>{Math.round(val * 100)}%</span>
    </div>
    <div style={{ height: '6px', backgroundColor: '#F1F5F9', borderRadius: '10px' }}>
      <div style={{ height: '100%', width: `${val * 100}%`, backgroundColor: color, borderRadius: '10px' }}></div>
    </div>
  </div>
);

const RetoItem = ({ icon, title, desc, xp, onDone }) => {
  const [check, setCheck] = useState(false);
  return (
    <div onClick={() => { if(!check){ setCheck(true); onDone(); }}} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.03)', opacity: check ? 0.6 : 1 }}>
      <div style={{ color: '#005B96' }}>{icon}</div>
      <div style={{ flex: 1 }}><h4 style={{ margin: 0, fontSize: '0.85rem' }}>{title}</h4><p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B' }}>{desc}</p></div>
      <span style={{ fontWeight: 'bold', color: '#059669', fontSize: '0.75rem' }}>{xp} XP</span>
    </div>
  );
};

const CategoryTitle = ({ title }) => <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#64748B', textTransform: 'uppercase', margin: '15px 0 10px 5px' }}>{title}</p>;

const InfoCard = ({ icon, title, desc }) => (
  <div style={{ backgroundColor: 'white', padding: '18px', borderRadius: '20px', borderLeft: '6px solid #005B96', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>{icon} <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{title}</h4></div>
    <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.4' }}>{desc}</p>
  </div>
);

const NavBtn = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', color: active ? '#38BDF8' : '#94A3B8', cursor: 'pointer' }}>
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
    <span style={{ fontSize: '0.6rem', fontWeight: active ? 'bold' : '500' }}>{label}</span>
  </button>
);