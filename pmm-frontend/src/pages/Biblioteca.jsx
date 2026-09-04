import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

// 🚩 HELPER: Tooltip de Ayuda Contextual (Heurísticas #6 y #10)
const InfoTooltip = ({ text }) => (
    <div className="group relative inline-flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 cursor-help ml-1 transition-colors group-hover:text-[#0A3D62]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-slate-800 text-white text-[11px] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 text-center leading-relaxed scale-95 group-hover:scale-100">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
        </div>
    </div>
);

const Biblioteca = () => {
    const [pergaminos, setPergaminos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarBiblioteca = async () => {
            try {
                const res = await api.get('/api/estudiante/biblioteca');
                setPergaminos(res.data);
            } catch (err) {
                console.error("Error cargando biblioteca:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarBiblioteca();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando recursos" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Cargando recursos de aprendizaje...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-10 lg:p-16 text-slate-800 relative overflow-hidden">
            {/* Elementos decorativos de fondo sutiles */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0A3D62]/5 blur-[100px] rounded-full -z-10"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                
                <button 
                    onClick={() => navigate('/estudiante/dashboard')}
                    className="mb-8 flex items-center gap-2 text-[#0A3D62] hover:text-[#2E5AAC] transition-all font-bold text-[10px] uppercase tracking-[0.2em] group"
                >
                    <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                    Volver al Panel
                </button>

                <header className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center gap-3 mb-3 justify-center md:justify-start">
                            <div className="h-[2px] w-8 bg-[#FBE000]"></div>
                            <span className="text-[#0A3D62] font-bold text-xs tracking-[0.3em] uppercase opacity-80 flex items-center">
                                Centro de Recursos
                                <InfoTooltip text="El acceso a los recursos se desbloquea progresivamente según tu rango académico y los módulos que hayas completado." />
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight">
                            Biblioteca de <span className="text-[#0A3D62]">Aprendizaje</span>
                        </h1>
                        <p className="text-slate-500 text-sm md:text-base mt-4 max-w-2xl leading-relaxed mx-auto md:mx-0">
                            "El conocimiento es la herramienta más poderosa. Estudia los materiales disponibles para fortalecer tus fundamentos antes de avanzar al siguiente módulo."
                        </p>
                    </div>
                    
                    {/* Mascota 3D de Biblioteca */}
                    <img 
                        src="/leyendo un libro robot.png" 
                        alt="Mascota estudiando" 
                        className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-xl block mx-auto md:mx-0"
                    />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {pergaminos.length > 0 ? (
                        pergaminos.map((p) => {
                            const esVideo = p.tipo_recurso?.toLowerCase() === 'video' || p.url_recurso?.includes('youtube');

                            return (
                                <div 
                                    key={p.id_pergamino} 
                                    className="group relative bg-white border border-slate-200 p-6 md:p-8 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-lg overflow-hidden flex flex-col h-full border-t-4 border-t-[#FBE000]"
                                >
                                    <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${esVideo ? 'bg-[#2E5AAC]' : 'bg-[#FBE000]'}`}></div>

                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-5">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                                                esVideo 
                                                    ? 'bg-[#2E5AAC]/10 text-[#2E5AAC] border-[#2E5AAC]/20' 
                                                    : 'bg-[#FBE000]/10 text-[#0A3D62] border-[#FBE000]/30'
                                            }`}>
                                                {esVideo ? '▶ Video Tutorial' : '📄 Material de Lectura'}
                                            </span>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                                {p.nivel_requerido || 'General'}
                                            </div>
                                        </div>

                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-3 group-hover:text-[#0A3D62] transition-colors leading-tight line-clamp-2">
                                            {p.titulo}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-500 mb-6 leading-relaxed line-clamp-4 italic flex-1">
                                            "{p.descripcion}"
                                        </p>
                                    </div>

                                    {/* 🚩 HEURÍSTICA #1 y #2: Ícono de enlace externo para indicar salida de la plataforma */}
                                    <button 
                                        onClick={() => window.open(p.url_recurso, '_blank')}
                                        className={`w-full py-3.5 rounded-xl font-bold text-[10px] md:text-xs tracking-[0.15em] uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95
                                            ${esVideo 
                                                ? 'bg-[#2E5AAC] text-white hover:bg-[#1e4a8a]' 
                                                : 'bg-[#0A3D62] text-white hover:bg-[#083252]'}`}
                                        title="Se abrirá en una nueva pestaña"
                                    >
                                        {esVideo ? (
                                            <>
                                                <span>▶</span> 
                                                <span>Ver Video</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                <span>📄</span> 
                                                <span>Abrir Recurso</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full bg-white border-2 border-dashed border-slate-300 p-12 md:p-20 text-center rounded-3xl shadow-sm">
                            <img src="/estudiando.png" alt="Sin recursos" className="w-24 h-24 object-contain mx-auto mb-4 opacity-60" />
                            <p className="text-slate-700 font-bold uppercase text-sm tracking-widest mb-2">No hay recursos disponibles para tu nivel actual.</p>
                            <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                                ¡Sigue completando módulos y mejorando tu rango para desbloquear nuevo material de estudio!
                            </p>
                        </div>
                    )}
                </div>

                <footer className="mt-16 md:mt-24 mb-8">
                    <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
                        <img src="/idea.png" alt="Información" className="w-12 h-12 object-contain flex-shrink-0" />
                        <div>
                            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider leading-relaxed">
                                <span className="text-[#0A3D62] font-black">Protocolo de Curaduría:</span> Los recursos vinculados son propiedad de sus respectivos creadores 
                                (<span className="text-slate-700 font-medium">Khan Academy, YouTube, WolframAlpha</span>). 
                                La <span className="text-[#0A3D62] font-black">Plataforma PMM</span> facilita el acceso al conocimiento con fines educativos y no reclama derechos sobre el material externo.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Biblioteca;