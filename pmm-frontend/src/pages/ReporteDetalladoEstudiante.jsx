import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, BarChart3, Target, AlertCircle, Loader2, FileText } from 'lucide-react';
import api from '../api/api';
import html2pdf from 'html2pdf.js';

const ReporteDetalladoEstudiante = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [estudiante, setEstudiante] = useState(null);
    const [loading, setLoading] = useState(true);
    const reportRef = useRef();

    useEffect(() => {
        const cargarDetalles = async () => {
            try {
                const res = await api.get(`/api/docente/reporte-individual/${id}`);
                setEstudiante(res.data);
            } catch (error) {
                console.error("❌ Error al recuperar el expediente:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDetalles();
    }, [id]);

    const descargarPDF = async () => {
        const element = reportRef.current;
        const opt = {
            margin: [0.5, 0.5],
            filename: `Expediente_PMM_${estudiante?.nombre || 'Estudiante'}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff', // Fondo blanco para el PDF
                letterRendering: true,
                scrollY: 0,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('reporte-contenido');
                    if (el) {
                        el.style.backgroundColor = '#ffffff';
                        el.style.color = '#1e293b'; // Texto oscuro para el PDF
                        el.style.padding = '20px';
                    }
                }
            },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error("Error en la descarga:", error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando datos" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Cargando expediente del estudiante...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans p-4 md:p-8 lg:p-12 selection:bg-[#FBE000]/30">
            {/* 🚩 CABECERA DE ACCIONES (Responsive) */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-10 max-w-7xl mx-auto gap-4">
                <button 
                    onClick={() => navigate('/docente/dashboard')}
                    className="flex items-center gap-2 text-slate-600 hover:text-[#0A3D62] transition-all uppercase text-[10px] font-bold tracking-widest w-full sm:w-auto justify-center sm:justify-start"
                >
                    <ChevronLeft size={18} /> Volver al Monitoreo
                </button>

                <button 
                    onClick={descargarPDF}
                    className="flex items-center justify-center gap-2 bg-[#0A3D62] hover:bg-[#083252] text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 w-full sm:w-auto"
                >
                    <FileText size={16} /> Exportar Reporte PDF
                </button>
            </div>

            {/* 🚩 CONTENEDOR DE REPORTE */}
            <div ref={reportRef} id="reporte-contenido" className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 lg:p-12">
                <header className="mb-10 md:mb-12 border-b border-slate-200 pb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-[2px] w-8 bg-[#FBE000]"></div>
                        <span className="text-[#0A3D62] font-bold text-[10px] tracking-[0.3em] uppercase opacity-80">Análisis de Rendimiento Académico</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase leading-tight">
                        Expediente: <span className="text-[#0A3D62]">{estudiante?.nombre}</span>
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                    {/* 🚩 PANEL DE IDENTIDAD */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl text-center shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-[#FBE000]"></div>
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-[#0A3D62]/10 border-2 border-[#0A3D62]/20 flex items-center justify-center mx-auto mb-6 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                <span className="text-4xl md:text-5xl font-bold text-[#0A3D62]">{estudiante?.nombre?.charAt(0)}</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 uppercase tracking-tight">{estudiante?.nombre}</h3>
                            <p className="text-xs text-slate-500 font-medium mb-6 break-all">{estudiante?.correo}</p>
                            <div className="inline-block px-6 py-2 rounded-full border border-[#FBE000] bg-[#FBE000]/10 text-[#0A3D62] text-[10px] font-black tracking-widest uppercase">
                                Rango: {estudiante?.rango || 'Pendiente'}
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl relative overflow-hidden shadow-sm">
                            <Target className="absolute -right-4 -top-4 text-[#0A3D62]/5" size={100} />
                            <div className="flex items-center gap-3 mb-4">
                                <Target className="text-[#0A3D62]" size={20} />
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-slate-500">Puntaje de Diagnóstico</h4>
                            </div>
                            <div className="text-4xl md:text-5xl font-black text-[#0A3D62] mb-2">
                                {estudiante?.puntaje_diagnostico || 0} <span className="text-xl text-slate-400 font-medium">/ 13</span>
                            </div>
                            <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Nivel de partida detectado</p>
                            {estudiante?.nivel_diagnostico && (
                                <p className="text-xs text-slate-600 font-semibold mt-2">{estudiante.nivel_diagnostico}</p>
                            )}
                        </div>
                    </div>

                    {/* 🚩 PANEL DE DOMINIO Y ANÁLISIS DE FALLOS */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-50 rounded-xl">
                                        <BarChart3 className="text-emerald-600" size={24} />
                                    </div>
                                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900">Dominio Conceptual por Módulo</h4>
                                </div>
                                <div className="text-left sm:text-right">
                                    <span className="text-3xl font-black text-emerald-600 block">{estudiante?.avance_promedio || '0%'}</span>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Avance Global</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {estudiante?.progresos_detallados?.map((mod, idx) => (
                                    <div key={idx} className="group">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                            <span className="text-slate-600 group-hover:text-[#0A3D62] transition-colors truncate pr-2">{mod.nombre_modulo}</span>
                                            <span className="text-[#0A3D62] flex-shrink-0">{mod.porcentaje}%</span>
                                        </div>
                                        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                                            <div 
                                                className="h-full bg-[#0A3D62] rounded-full transition-all duration-1000" 
                                                style={{ width: `${mod.porcentaje}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🚩 ZONAS DE RIESGO (Diseño limpio y profesional) */}
                        <div className="bg-red-50 border border-red-200 p-6 md:p-8 rounded-3xl shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-red-100 p-3 rounded-xl">
                                    <AlertCircle className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Zonas de Riesgo Académico</h3>
                                    <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Temas con mayor índice de error detectado</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {estudiante?.fallos_comunes?.length > 0 ? (
                                    estudiante.fallos_comunes.map((fallo, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100 hover:border-red-300 transition-all group">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight truncate">{fallo.tema}</span>
                                            </div>
                                            <div className="flex flex-col items-end flex-shrink-0 pl-4">
                                                <span className="text-red-600 font-black text-lg">{fallo.cantidad_fallos || fallo.intentos || 0}</span>
                                                <span className="text-[8px] text-red-400 uppercase font-bold">Intentos Fallidos</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 bg-white rounded-xl border border-red-100">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">No se han registrado alertas críticas para este estudiante</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReporteDetalladoEstudiante;