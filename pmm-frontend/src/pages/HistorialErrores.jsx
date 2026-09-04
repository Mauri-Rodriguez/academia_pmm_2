import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/api';

const HistorialErrores = () => {
    const [errores, setErrores] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const cargarErrores = async () => {
            try {
                const res = await api.get('/api/estudiante/errores-recientes');
                setErrores(res.data);
            } catch (err) {
                console.error("Error al cargar el historial de aprendizaje:", err);
            } finally {
                setLoading(false);
            }
        };
        cargarErrores();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando historial" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">
                Cargando historial de aprendizaje...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 relative selection:bg-[#FBE000]/30 pb-20 overflow-hidden">
            {/* Decoración de fondo sutil */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0A3D62]/5 blur-[100px] rounded-full -z-10"></div>
            
            {/* 🚩 NAVBAR INSTITUCIONAL */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-4 shadow-sm mb-8 md:mb-12">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button 
                            onClick={() => navigate('/estudiante/dashboard')}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#FBE000]/20 hover:text-[#0A3D62] text-[#0A3D62] transition-all border border-slate-200 group"
                            title="Regresar al Panel"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-base md:text-xl font-bold text-[#0A3D62] tracking-tight uppercase">
                            PMM <span className="text-[#FBE000] drop-shadow-sm">Interactivo</span>
                        </h1>
                    </div>
                    
                    <div className="bg-[#0A3D62]/5 border border-[#0A3D62]/10 px-3 md:px-4 py-1.5 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#0A3D62] animate-pulse"></div>
                        <span className="text-[#0A3D62] font-bold text-[9px] md:text-[10px] uppercase tracking-wider">
                            Historial de Aprendizaje
                        </span>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 md:px-6">
                <header className="mb-10 md:mb-16 relative">
                    <div className="flex items-start md:items-center gap-4 md:gap-6 flex-col md:flex-row">
                        <img src="/idea.png" alt="Mejora continua" className="w-20 h-20 md:w-24 md:h-24 object-contain drop-shadow-lg" />
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-[2px] w-8 bg-[#FBE000]"></div>
                                <span className="text-[#0A3D62] font-bold text-xs tracking-[0.3em] uppercase opacity-80">
                                    Oportunidades de Mejora
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight mb-3">
                                Revisión de <span className="text-[#0A3D62]">Conceptos</span>
                            </h1>
                            <p className="text-slate-500 text-sm md:text-base italic leading-relaxed max-w-2xl">
                                "Aprender de los errores es el primer paso para dominar cualquier concepto matemático. Analiza la retroalimentación y fortalece tus conocimientos."
                            </p>
                        </div>
                    </div>
                </header>

                <div className="space-y-6 md:space-y-8">
                    {errores.length > 0 ? (
                        errores.map((error, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                key={index} 
                                className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-lg border-t-4 border-t-[#FBE000] relative overflow-hidden group hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6 border-b border-slate-100 pb-5">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-bold text-[#2E5AAC] uppercase tracking-wider flex items-center gap-2">
                                            <span>📚</span> Tema a reforzar
                                        </span>
                                        <span className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-wide">
                                            {error.tema_modulo}
                                        </span>
                                    </div>
                                    <span className="text-[9px] md:text-[10px] text-slate-500 font-bold bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full uppercase tracking-wider self-start">
                                        {new Date(error.fecha_error).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>

                                <h3 className="text-lg md:text-2xl font-bold text-slate-900 leading-relaxed mb-8">
                                    {error.pregunta_texto}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                                    {/* Respuesta Incorrecta */}
                                    <div className="p-5 bg-red-50 border border-red-200 rounded-2xl relative overflow-hidden">
                                        <div className="absolute top-3 right-3 opacity-20">
                                            <img src="/respuesta incorrecta robot.png" alt="Incorrecto" className="w-10 h-10 object-contain" />
                                        </div>
                                        <p className="text-[9px] md:text-[10px] text-red-600 uppercase font-black mb-2 tracking-wider">Tu respuesta</p>
                                        <p className="text-sm md:text-base text-red-700 line-through decoration-red-400/50 font-medium break-words leading-relaxed">
                                            {error.respuesta_incorrecta}
                                        </p>
                                    </div>
                                    
                                    {/* Respuesta Correcta */}
                                    <div className="p-5 bg-green-50 border border-green-200 rounded-2xl relative overflow-hidden shadow-sm">
                                        <div className="absolute top-3 right-3 opacity-20">
                                            <img src="/respuesta correcta robot.png" alt="Correcto" className="w-10 h-10 object-contain" />
                                        </div>
                                        <p className="text-[9px] md:text-[10px] text-green-700 uppercase font-black mb-2 tracking-wider">Respuesta correcta</p>
                                        <p className="text-sm md:text-base text-green-800 font-bold break-words leading-relaxed">
                                            {error.respuesta_correcta}
                                        </p>
                                    </div>
                                </div>

                                {/* 🚩 RETROALIMENTACIÓN DE GEMINI (Heurística #9: Recuperación de errores) */}
                                <div className="relative mt-6">
                                    <div className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-200 relative">
                                        <div className="absolute -top-3 left-6 bg-white px-4 py-1 border border-slate-200 rounded-full flex items-center gap-2 shadow-sm">
                                            <img src="/idea.png" alt="IA" className="w-5 h-5 object-contain" />
                                            <span className="text-[9px] md:text-[10px] text-[#0A3D62] font-bold uppercase tracking-wider">
                                                Retroalimentación del Tutor IA
                                            </span>
                                        </div>
                                        <div className="mt-3">
                                            <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                                                {error.explicacion_ia || "El sistema está generando una explicación detallada para este concepto..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-16 md:py-24 bg-white border-2 border-dashed border-slate-300 rounded-3xl shadow-sm"
                        >
                            <img src="/festejando.png" alt="Sin errores" className="w-24 h-24 md:w-32 md:h-32 object-contain mx-auto mb-6" />
                            <p className="font-bold text-[#0A3D62] uppercase tracking-wider text-lg md:text-xl mb-2">¡Excelente trabajo!</p>
                            <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                                No hay errores registrados recientemente en tu historial. ¡Sigue practicando para mantener este ritmo!
                            </p>
                        </motion.div>
                    )}
                </div>
                
                {errores.length > 0 && (
                    <div className="mt-12 md:mt-16 text-center">
                        <button 
                            onClick={() => navigate('/estudiante/dashboard')}
                            className="bg-[#0A3D62] hover:bg-[#083252] text-white px-8 md:px-10 py-4 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2 mx-auto"
                        >
                            <span>←</span> Volver al Panel Principal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistorialErrores;