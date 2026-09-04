import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';

const VisualizadorModulo = () => {
    const { id_modulo } = useParams();
    const navigate = useNavigate();
    const [lecciones, setLecciones] = useState([]);
    const [leccionActual, setLeccionActual] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarLecciones = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/estudiante/modulo/${id_modulo}`);
                setLecciones(res.data);
            } catch (err) {
                console.error("Error al cargar el módulo:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarLecciones();
    }, [id_modulo]);

    const marcarCompletada = async () => {
        try {
            await api.post('/api/estudiante/completar-leccion', {
                id_leccion: lecciones[leccionActual].id_leccion
            });
            
            if (leccionActual < lecciones.length - 1) {
                setLeccionActual(leccionActual + 1);
                // Scroll suave al inicio del contenido al cambiar de lección
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                alert("¡Has terminado este módulo! 🎉");
                navigate('/estudiante/dashboard');
            }
        } catch (err) {
            console.error("Error al marcar lección como completada:", err);
            alert("Hubo un error al guardar tu progreso.");
        }
    };

    if (loading || lecciones.length === 0) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
                <img src="/estudiando.png" alt="Cargando módulo" className="w-32 h-32 object-contain animate-bounce mb-4" />
                <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Preparando material de estudio...</div>
            </div>
        );
    }

    const actual = lecciones[leccionActual];

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row relative overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            
            {/* 🚩 SIDEBAR: LISTA DE LECCIONES */}
            <aside className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex-shrink-0 z-20">
                <div className="p-6 md:p-8">
                    <button 
                        onClick={() => navigate('/estudiante/dashboard')}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-[#0A3D62] transition-all font-bold text-[10px] uppercase tracking-[0.2em] group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver
                    </button>
                    
                    <h2 className="text-[#0A3D62] font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                        <span>📚</span> Contenido del Módulo
                    </h2>
                    
                    <div className="space-y-2 max-h-[60vh] md:max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {lecciones.map((lec, index) => {
                            const isActive = leccionActual === index;
                            return (
                                <button 
                                    key={lec.id_leccion}
                                    onClick={() => setLeccionActual(index)}
                                    className={`w-full text-left p-4 rounded-xl text-sm transition-all duration-300 flex items-start gap-3 border
                                        ${isActive 
                                            ? 'bg-[#0A3D62] text-white border-[#0A3D62] shadow-md' 
                                            : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100 hover:border-slate-300'}`}
                                >
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black mt-0.5
                                        ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {index + 1}
                                    </span>
                                    <span className="font-medium leading-tight line-clamp-2">{lec.titulo}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </aside>

            {/* 🚩 ÁREA DE ESTUDIO PRINCIPAL */}
            <main className="flex-1 p-4 md:p-10 lg:p-16 overflow-y-auto">
                <div className="max-w-4xl mx-auto">
                    {/* Indicador de progreso */}
                    <div className="mb-6 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Lección {leccionActual + 1} de {lecciones.length}
                        </span>
                        <div className="flex-1 mx-4 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#FBE000] transition-all duration-500 ease-out"
                                style={{ width: `${((leccionActual + 1) / lecciones.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight leading-tight">
                        {actual.titulo}
                    </h1>
                    
                    {/* Contenedor de Video / Contenido Multimedia */}
                    <div className="aspect-video bg-slate-900 rounded-3xl mb-8 border border-slate-200 shadow-xl flex items-center justify-center relative overflow-hidden group">
                        {/* Patrón de fondo sutil para el placeholder */}
                        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 to-slate-900"></div>
                        
                        <div className="relative z-10 text-center p-6">
                            <img src="/estudiando.png" alt="Estudiando" className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-4 opacity-80 group-hover:scale-105 transition-transform duration-500" />
                            <p className="text-slate-300 font-medium italic text-sm md:text-base">
                                [ Reproductor de video para: {actual.titulo} ]
                            </p>
                        </div>
                    </div>

                    {/* Tarjeta de Contenido Teórico */}
                    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-10 mb-10 border-t-4 border-t-[#FBE000]">
                        <h3 className="text-sm font-bold text-[#0A3D62] uppercase tracking-widest mb-4 flex items-center gap-2">
                            <span>📝</span> Material de Lectura
                        </h3>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap">
                                {actual.contenido_texto}
                            </p>
                        </div>
                    </div>

                    {/* Botón de Acción */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                        <button 
                            onClick={() => setLeccionActual(Math.max(0, leccionActual - 1))}
                            disabled={leccionActual === 0}
                            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-500 hover:text-[#0A3D62] hover:bg-slate-200/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            ← Lección Anterior
                        </button>

                        <button 
                            onClick={marcarCompletada}
                            className="w-full sm:w-auto bg-[#0A3D62] hover:bg-[#083252] text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-3"
                        >
                            <span>Marcar como Completada</span>
                            <span className="text-lg">✓</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VisualizadorModulo;