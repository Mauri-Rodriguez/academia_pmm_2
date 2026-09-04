import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

const CampanaNotificaciones = () => {
    const navigate = useNavigate();
    const [notificaciones, setNotificaciones] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const menuRef = useRef(null);

    // 1. Cargar las notificaciones al inicio
    const cargarNotificaciones = async () => {
        try {
            const res = await api.get('/api/estudiante/notificaciones');
            // 🛡️ ESCUDO: Si por alguna razón el backend no manda un array, forzamos uno vacío []
            setNotificaciones(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
            setNotificaciones([]); // Previene el error fatal
        }
    };

    useEffect(() => {
        cargarNotificaciones();
        // Opcional: Recargar cada 1 minuto (60000 ms) para notificaciones en vivo
        const intervalo = setInterval(cargarNotificaciones, 60000);
        return () => clearInterval(intervalo);
    }, []);

    // 2. Cerrar el menú si se hace clic afuera (Heurística #3: Control y libertad)
    useEffect(() => {
        const handleClickFuera = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    // 3. Marcar una notificación como leída
    const marcarComoLeida = async (id, ruta_redireccion = null) => {
        try {
            await api.put(`/api/estudiante/notificaciones/${id}/leer`);
            // Actualizar el estado local para que desaparezca el indicador de no leído
            setNotificaciones(notificaciones.map(n =>
                n.id_notificacion === id ? { ...n, leida: 1 } : n
            ));

            // Si la notificación requiere ir a algún lado (ej. el foro)
            if (ruta_redireccion) {
                setAbierto(false);
                navigate(ruta_redireccion);
            }
        } catch (error) {
            console.error("Error al marcar como leída", error);
        }
    };

    const noLeidas = notificaciones.filter(n => n.leida === 0 || n.leida === false).length;

    return (
        <div className="relative z-50" ref={menuRef}>
            {/* 🚩 BOTÓN DE LA CAMPANA */}
            <button
                onClick={() => setAbierto(!abierto)}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 transition-all text-slate-500 hover:text-[#0A3D62] focus:outline-none focus:ring-2 focus:ring-[#0A3D62]/20"
                aria-label="Ver notificaciones"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>

                {/* Globo rojo de notificaciones (Heurística #1: Visibilidad del estado) */}
                {noLeidas > 0 && (
                    <motion.span
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full text-[10px] font-bold text-white flex items-center justify-center shadow-sm"
                    >
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </motion.span>
                )}
            </button>

            {/* 🚩 MENÚ DESPLEGABLE */}
            <AnimatePresence>
                {abierto && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 md:w-96 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                    >
                        {/* Header del Dropdown */}
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-[#0A3D62] font-bold tracking-wide uppercase text-xs flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                Notificaciones
                            </h3>
                            {noLeidas > 0 && (
                                <span className="text-[9px] text-[#0A3D62] font-bold bg-[#FBE000]/20 px-2 py-1 rounded-full uppercase tracking-wider">
                                    {noLeidas} Nuevas
                                </span>
                            )}
                        </div>

                        {/* Lista de Notificaciones */}
                        <div className="max-h-[350px] md:max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            {notificaciones.length === 0 ? (
                                <div className="p-8 text-center flex flex-col items-center">
                                    <img src="/idea.png" alt="Sin notificaciones" className="w-16 h-16 object-contain mb-3 opacity-60" />
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Sin novedades</p>
                                    <p className="text-[10px] text-slate-400 mt-1">Estás al día con tus actividades.</p>
                                </div>
                            ) : (
                                notificaciones.map((notif) => (
                                    <div
                                        key={notif.id_notificacion}
                                        onClick={() => marcarComoLeida(notif.id_notificacion, notif.ruta)} 
                                        className={`p-4 border-b border-slate-100 cursor-pointer transition-all flex gap-3 items-start group
                                            ${notif.leida 
                                                ? 'hover:bg-slate-50 border-l-4 border-l-transparent' 
                                                : 'bg-[#FBE000]/5 hover:bg-[#FBE000]/10 border-l-4 border-l-[#FBE000]'}`}
                                    >
                                        {/* Indicador visual de leído/no leído */}
                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${notif.leida ? 'bg-slate-300' : 'bg-[#0A3D62] shadow-sm'}`}></div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug break-words ${notif.leida ? 'text-slate-500' : 'text-slate-900 font-semibold'}`}>
                                                {notif.mensaje}
                                            </p>
                                            <p className="text-[9px] text-slate-400 mt-2 uppercase font-medium tracking-wider flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {new Date(notif.fecha_creacion).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CampanaNotificaciones;