import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti'; 
import api from '../api/api';
import AchievementToast from './AchievementToast';
import AscensoModal from './AscensoModal';
import TutorOraculo from '../components/TutorOraculo';

const ModuloEstudio = () => {
    const { id_modulo } = useParams();
    const navigate = useNavigate();

    // --- ESTADOS (Lógica intacta) ---
    const [ejercicios, setEjercicios] = useState([]);
    const [indice, setIndice] = useState(0);
    const [completado, setCompletado] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [bloqueado, setBloqueado] = useState(false);
    const [modoRepaso, setModoRepaso] = useState(false);
    const [modalIA, setModalIA] = useState({ visible: false, explicacion: '' });
    const [logroActivo, setLogroActivo] = useState(null); 
    const [mostrarAscenso, setMostrarAscenso] = useState(false);
    const [datosAscenso, setDatosAscenso] = useState(null);
    const [insigniaNueva, setInsigniaNueva] = useState(null);

    // 🚩 CELEBRACIÓN: Colores actualizados a la paleta oficial
    const dispararConfetiVictoria = () => {
        const duration = 4 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            // Colores oficiales: Amarillo corporativo, Azul institucional, Azul claro y Blanco
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#FBE000', '#0A3D62', '#FFFFFF'] });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#FBE000', '#2E5AAC', '#FFFFFF'] });
        }, 250);
    };

    // --- 1. CARGA INICIAL Y PERSISTENCIA ---
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const resEjercicios = await api.get(`api/estudiante/modulo/${id_modulo}/ejercicios`);
                setEjercicios(resEjercicios.data);

                const resProgreso = await api.get(`/api/estudiante/dashboard`);
                const moduloActual = resProgreso.data.ruta_ia_asignada?.find(m => m.id_modulo === parseInt(id_modulo));

                if (moduloActual && moduloActual.porcentaje_avance === 100) {
                    setCompletado(true);
                } else if (moduloActual && moduloActual.porcentaje_avance > 0) {
                    const indiceGuardado = Math.floor((moduloActual.porcentaje_avance / 100) * resEjercicios.data.length);
                    setIndice(indiceGuardado);
                }
            } catch (err) {
                console.error("Error al recuperar persistencia:", err);
            } finally {
                setCargando(false);
            }
        };
        cargarDatos();
    }, [id_modulo]);

    // --- 2. HELPERS ---
    const dispararLogro = (titulo, descripcion) => {
        setLogroActivo({ titulo, descripcion });
        setTimeout(() => setLogroActivo(null), 5000); 
    };

    const iniciarRepaso = () => {
        setIndice(0);
        setCompletado(false);
        setModoRepaso(true); 
    };

    const manejarFlujoFinal = (data) => {
        if (data.ascendio) {
            setDatosAscenso(data.detallesAscenso);
            dispararConfetiVictoria();
            setMostrarAscenso(true);
        } else {
            setCompletado(true);
        }
    };

    const procesarFinalizacionOficial = async () => {
        try {
            const res = await api.post('/api/estudiante/finalizar', { 
                id_modulo, 
                puntaje_final: ejercicios.length 
            });

            if (res.data.insignia) {
                setInsigniaNueva(res.data.insignia);
                dispararConfetiVictoria(); 
                setTimeout(() => {
                    setInsigniaNueva(null);
                    manejarFlujoFinal(res.data);
                }, 4500);
            } else {
                manejarFlujoFinal(res.data);
            }
        } catch (err) {
            console.error("Error al procesar méritos finales:", err);
            setCompletado(true);
        }
    };

    // --- 3. LÓGICA DE RESPUESTA ---
    const responder = async (itemSeleccionado) => {
        if (bloqueado) return;
        const ejActual = ejercicios[indice];
        
        const letraUsuario = itemSeleccionado.letra.toLowerCase().trim();
        const letraCorrectaDB = String(ejActual.respuesta_correcta).toLowerCase().replace('opcion_', '').trim();

        setBloqueado(true);

        if (letraUsuario === letraCorrectaDB) {
            const nuevoIndice = indice + 1;
            const esFinDeModulo = nuevoIndice === ejercicios.length;
            
            if (!modoRepaso && !esFinDeModulo) {
                const nuevoPorcentaje = Math.round((nuevoIndice / ejercicios.length) * 100);
                try {
                    await api.post('/api/estudiante/actualizar-progreso', { id_modulo, porcentaje: nuevoPorcentaje });
                } catch (err) {
                    console.error("Error guardando progreso:", err);
                }
            }

            if (esFinDeModulo) {
                dispararLogro(modoRepaso ? "CONOCIMIENTO REAFIRMADO" : "MÓDULO DOMINADO", "Actividad completada con éxito");
                setTimeout(() => procesarFinalizacionOficial(), 1500);
            } else {
                if (nuevoIndice === 5 && !modoRepaso) {
                    dispararLogro("RACHA DE ESTUDIO", "¡5 respuestas correctas seguidas!");
                }
                setIndice(nuevoIndice);
            }
            setBloqueado(false);
        } else {
            try {
                const res = await api.post('/api/estudiante/registrar-fallo', {
                    id_pregunta: ejActual.id_ejercicio,
                    respuesta_dada: itemSeleccionado.campo 
                });
                setModalIA({ visible: true, explicacion: res.data.explicacion_ia || "Revisa el planteamiento e intenta de nuevo." });
            } catch (err) {
                setModalIA({ visible: true, explicacion: "El sistema está procesando tu respuesta. Revisa tu lógica." });
            } finally {
                setBloqueado(false);
            }
        }
    };

    if (cargando) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/motivación.png" alt="Cargando módulo" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Preparando el contenido...</div>
        </div>
    );

    if (completado) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-center p-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-xl border-t-4 border-t-[#FBE000]">
                <img src="/logro.png" alt="Completado" className="w-32 h-32 object-contain mx-auto mb-6 animate-bounce" />
                <h1 className="text-3xl font-extrabold text-[#0A3D62] tracking-tight uppercase mb-4">¡Módulo Completado!</h1>
                <p className="text-slate-500 text-sm md:text-base mb-10 leading-relaxed">
                    Has dominado los conceptos de este módulo. ¿Deseas repasar o volver a tu panel principal?
                </p>
                <div className="space-y-4">
                    <button onClick={() => { navigate('/estudiante/dashboard'); window.location.reload(); }} className="w-full bg-[#0A3D62] text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-md hover:bg-[#083252]">
                        Volver al Panel
                    </button>
                    <button onClick={iniciarRepaso} className="w-full bg-slate-100 text-[#0A3D62] border border-slate-200 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:bg-slate-200">
                        🔄 Repasar de nuevo
                    </button>
                </div>
            </motion.div>
        </div>
    );

    const ejActual = ejercicios[indice];
    const progresoPorcentaje = Math.round((indice / ejercicios.length) * 100);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 relative overflow-hidden pb-20 selection:bg-[#FBE000]/30">
            
            {/* 🚩 OVERLAY ÉPICO: INSIGNIA OBTENIDA */}
            <AnimatePresence>
                {insigniaNueva && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="text-center p-6">
                            <div className="relative inline-block mb-10">
                                <div className="absolute -inset-10 bg-[#FBE000]/30 blur-3xl rounded-full animate-pulse"></div>
                                <span className="text-[120px] md:text-[180px] relative z-10 drop-shadow-[0_0_50px_rgba(251,224,0,0.6)] block leading-none">
                                    {insigniaNueva.url_imagen || '🏅'}
                                </span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight uppercase mb-2">¡Nueva Insignia!</h2>
                            <p className="text-[#FBE000] font-black tracking-[0.3em] text-sm md:text-xl uppercase">{insigniaNueva.nombre}</p>
                            <p className="text-slate-300 font-medium text-xs mt-4 uppercase tracking-widest">
                                Insignia añadida a tu perfil
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DE ASCENSO */}
            {mostrarAscenso && (
                <AscensoModal datos={datosAscenso} onClose={() => { setMostrarAscenso(false); window.location.href = '/estudiante/dashboard'; }} />
            )}

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-4 shadow-sm mb-8 md:mb-12">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button onClick={() => navigate('/estudiante/dashboard')} className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#FBE000]/20 hover:text-[#0A3D62] text-[#0A3D62] transition-all border border-slate-200 group">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-base md:text-xl font-bold text-[#0A3D62] tracking-tight uppercase">
                            Módulo de <span className="text-[#FBE000] drop-shadow-sm">Estudio</span>
                        </h1>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {logroActivo && <AchievementToast titulo={logroActivo.titulo} descripcion={logroActivo.descripcion} />}
            </AnimatePresence>

            <div className="max-w-3xl mx-auto px-4 md:px-6">
                {/* Barra de Progreso */}
                <div className="mb-8 md:mb-10">
                    <div className="flex justify-between items-end mb-3">
                        <div className="text-left">
                            <h2 className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase">Progreso del Módulo</h2>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mt-1">Pregunta {indice + 1} de {ejercicios.length}</p>
                        </div>
                        <span className="text-[#0A3D62] font-black text-2xl md:text-3xl">{progresoPorcentaje}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progresoPorcentaje}%` }} className="h-full bg-[#0A3D62]" />
                    </div>
                </div>

                {/* Tarjeta de Pregunta */}
                <motion.div key={indice} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-slate-200 p-6 md:p-10 rounded-3xl shadow-lg border-t-4 border-t-[#FBE000] relative">
                    <div className="mb-8 md:mb-10 text-center">
                        <h3 className="text-xl md:text-3xl font-bold text-slate-900 leading-snug">
                            {ejActual?.pregunta}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {['A', 'B', 'C', 'D'].map((letra) => {
                            const campo = `opcion_${letra.toLowerCase()}`;
                            return (
                                <button 
                                    key={letra} 
                                    onClick={() => responder({ letra, campo })} 
                                    disabled={bloqueado} 
                                    className="group w-full flex items-center p-4 md:p-5 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-[#0A3D62] hover:bg-[#0A3D62]/5 transition-all active:scale-[0.98] text-left"
                                >
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[#0A3D62] border border-[#0A3D62] flex items-center justify-center mr-4 md:mr-6 group-hover:bg-[#FBE000] group-hover:border-[#FBE000] transition-all flex-shrink-0">
                                        <span className="text-white font-black text-lg group-hover:text-[#0A3D62] transition-colors">{letra}</span>
                                    </div>
                                    <span className="text-slate-700 text-sm md:text-base font-medium group-hover:text-slate-900 transition-colors flex-1">
                                        {ejActual?.[campo]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* MODAL DE ERROR / EXPLICACIÓN IA */}
            <AnimatePresence>
                {modalIA.visible && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white border border-slate-200 p-6 md:p-10 rounded-3xl max-w-lg w-full text-center shadow-2xl border-t-4 border-t-red-400">
                            <img src="/idea.png" alt="Sugerencia" className="w-20 h-20 object-contain mx-auto mb-4" />
                            <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-3">Oportunidad de Aprendizaje</h4>
                            <p className="text-slate-600 italic mb-8 leading-relaxed text-sm md:text-base">"{modalIA.explicacion}"</p>
                            <button 
                                onClick={() => setModalIA({ visible: false, explicacion: '' })} 
                                className="w-full bg-[#0A3D62] hover:bg-[#083252] text-white p-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-md"
                            >
                                Entendido, continuar
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <TutorOraculo idPreguntaActual={ejActual?.id_ejercicio} />
        </div>
    );
};

export default ModuloEstudio;