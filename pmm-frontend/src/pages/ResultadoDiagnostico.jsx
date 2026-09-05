import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultadoDiagnostico = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [modoRevision, setModoRevision] = useState(false);
    
    const { rango, aciertos, detalle } = location.state || { 
        rango: 'Genin (Iniciado)', 
        aciertos: 0,
        detalle: [] 
    };

    // Traducción visual de rangos según la regla de oro
    const getNivelVisual = (rangoStr) => {
        if (rangoStr.includes('Jonin')) {
            return { 
                texto: 'Avanzado', 
                color: 'text-[#0A3D62]', 
                mascota: '/correcto.png', 
                mensaje: '¡Increíble! Tu dominio de las artes algebraicas es comparable al de un maestro. Los archivos avanzados están a tu disposición.' 
            };
        }
        if (rangoStr.includes('Chunin')) {
            return { 
                texto: 'Intermedio', 
                color: 'text-[#2E5AAC]', 
                mascota: '/idea.png', 
                mensaje: 'Has demostrado ser un estudiante competente. Tu lógica es sólida, pero aún queda camino para alcanzar la maestría.' 
            };
        }
        return { 
            texto: 'Básico', 
            color: 'text-slate-600', 
            mascota: '/MASCOTA CABEZA.png', 
            mensaje: 'Tu camino académico apenas comienza. Entrena duro en la biblioteca para fortalecer tus fundamentos matemáticos.' 
        };
    };

    const nivel = getNivelVisual(rango);

    const obtenerClaseOpcion = (opcion, pregunta) => {
        const esLaCorrecta = opcion.texto.trim().toLowerCase() === pregunta.respuesta_correcta.trim().toLowerCase() || opcion.clave === pregunta.respuesta_correcta;
        const fueSeleccionada = opcion.texto.trim().toLowerCase() === pregunta.respuesta_usuario.trim().toLowerCase() || opcion.clave === pregunta.respuesta_usuario;

        // Estilos adaptados a la nueva paleta clara (PMM Interactivo)
        if (fueSeleccionada && esLaCorrecta) return "bg-green-100 border-green-500 text-green-800 ring-1 ring-green-500"; 
        if (fueSeleccionada && !esLaCorrecta) return "bg-red-100 border-red-500 text-red-800 ring-1 ring-red-500"; 
        if (!fueSeleccionada && esLaCorrecta) return "bg-green-50 border-green-300 text-green-700"; // Muestra la correcta si el usuario falló
        return "bg-slate-50 border-slate-200 text-slate-600"; 
    };

    // --- VISTA DE REVISIÓN ---
    if (modoRevision) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center py-8 px-4 md:px-8 relative">
                <div className="w-full max-w-4xl z-10 animate-[fadeIn_0.5s_ease-out]">
                    <button 
                        onClick={() => setModoRevision(false)}
                        className="mb-6 text-[#0A3D62] hover:text-[#2E5AAC] uppercase tracking-widest text-xs font-bold transition-colors flex items-center gap-2 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver a mi Rango
                    </button>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0A3D62] mb-8 tracking-tight uppercase text-center">
                        Revisión del <span className="text-[#FBE000] drop-shadow-sm">Diagnóstico</span>
                    </h2>

                    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 md:pr-4 scrollbar-thin scrollbar-thumb-[#0A3D62] scrollbar-track-slate-200 rounded-2xl">
                        {detalle && detalle.length > 0 ? (
                            detalle.map((item, index) => (
                                <div key={item.id_pregunta} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                                        <h3 className="text-slate-800 font-bold text-base md:text-lg">
                                            <span className="text-[#FBE000] mr-2 text-xl">#{index + 1}</span> 
                                            {item.pregunta}
                                        </h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                                            item.es_correcta ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                                        }`}>
                                            {item.es_correcta ? 'Correcto' : 'Incorrecto'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                        {item.opciones.map((opcion, idx) => (
                                            <div key={idx} className={`p-4 rounded-xl border-2 ${obtenerClaseOpcion(opcion, item)} transition-all duration-200`}>
                                                <span className="font-bold mr-2 opacity-70 uppercase text-xs">{opcion.clave.replace('opcion_', '')})</span>
                                                <span className="text-sm md:text-base">{opcion.texto}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm text-center">
                                <p className="text-slate-500">No hay detalles disponibles para esta evaluación.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // --- VISTA PRINCIPAL DE RESULTADOS ---
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Elemento decorativo de fondo sutil */}
            <div className={`absolute w-[400px] h-[400px] blur-[100px] opacity-10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                ${rango.includes('Jonin') ? 'bg-[#0A3D62]' : rango.includes('Chunin') ? 'bg-[#2E5AAC]' : 'bg-[#FBE000]'}`}>
            </div>

            <div className="max-w-2xl w-full z-10 animate-[fadeInZoom_0.8s_ease-out]">
                {/* Tarjeta Principal con Patrón de Diseño Obligatorio */}
                <div className="bg-white rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-6 md:p-10 text-center relative">
                    
                    {/* Mascota 3D Dinámica */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src="/mascota.png"
                            alt="Mascota PMM" 
                            className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-lg animate-[bounce_3s_infinite]" 
                        />
                    </div>

                    <span className="text-[#2E5AAC] font-bold tracking-[0.2em] uppercase text-xs opacity-80 mb-2 block">
                        Análisis Completado
                    </span>
                    
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-2 tracking-tight uppercase">
                        Tu Nivel es <br />
                        <span className={`${nivel.color} drop-shadow-sm`}>
                            {nivel.texto}
                        </span>
                    </h1>

                    {/* Estadísticas */}
                    <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8 mb-8">
                        <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm">
                            <div className="text-3xl md:text-4xl font-bold text-[#0A3D62]">{aciertos} / 13</div>
                            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Aciertos Totales</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 p-5 md:p-6 rounded-2xl shadow-sm">
                            <div className="text-3xl md:text-4xl font-bold text-[#0A3D62]">{Math.round((aciertos / 13) * 100)}%</div>
                            <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest mt-2 font-bold">Efectividad</div>
                        </div>
                    </div>

                    {/* Mensaje Motivacional */}
                    <p className="text-slate-600 italic text-sm md:text-base mb-10 px-4 md:px-12 leading-relaxed">
                        "{nivel.mensaje}"
                    </p>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        {detalle && detalle.length > 0 && (
                            <button 
                                onClick={() => setModoRevision(true)}
                                className="w-full sm:w-auto px-6 py-3.5 bg-transparent border-2 border-[#0A3D62] text-[#0A3D62] font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-[#0A3D62]/10 transition-all duration-200"
                            >
                                Revisar Diagnóstico
                            </button>
                        )}

                        <button 
                            onClick={() => navigate('/estudiante/dashboard', { state: { nuevoIngreso: true } })}
                            className="w-full sm:w-auto px-8 py-4 bg-[#0A3D62] text-white font-bold uppercase tracking-wider text-sm rounded-xl hover:bg-[#083252] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
                        >
                            Ingresar al Panel
                            <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
                        </button>
                    </div>
                </div>
                
                {/* Texto de pie de página sutil */}
                <p className="text-center text-slate-400 text-xs mt-6 uppercase tracking-widest">
                    Plataforma PMM Interactivo © 2026
                </p>
            </div>

            {/* Estilos de animación personalizados inline para garantizar el efecto sin configurar tailwind.config.js */}
            <style>{`
                @keyframes fadeInZoom {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ResultadoDiagnostico;