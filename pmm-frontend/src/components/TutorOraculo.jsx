import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/api';

const TutorOraculo = ({ idPreguntaActual }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mensaje, setMensaje] = useState('');
    const [historial, setHistorial] = useState([
        { rol: 'ia', texto: '¡Hola! Soy tu Tutor IA. ¿En qué parte de este ejercicio necesitas una pista o explicación?' }
    ]);
    const [cargando, setLoading] = useState(false);
    const chatRef = useRef(null);

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [historial, cargando]);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        if (!mensaje.trim() || cargando) return;

        const textoUsuario = mensaje;
        setMensaje('');
        setHistorial(prev => [...prev, { rol: 'usuario', texto: textoUsuario }]);
        setLoading(true);

        try {
            const res = await api.post('/api/estudiante/tutor-ia', {
                id_pregunta: idPreguntaActual,
                mensaje_estudiante: textoUsuario
            });
            setHistorial(prev => [...prev, { rol: 'ia', texto: res.data.respuesta }]);
        } catch (error) {
            setHistorial(prev => [...prev, { 
                rol: 'ia', 
                texto: error.response?.data?.respuesta || 'El sistema está procesando tu consulta. Por favor, intenta de nuevo en unos segundos.' 
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-20 right-0 w-80 md:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col border-t-4 border-t-[#FBE000]"
                        style={{ height: '28rem' }}
                    >
                        {/* Header del Chat */}
                        <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <img src="/idea.png" alt="Tutor IA" className="w-9 h-9 object-contain drop-shadow-sm" />
                                <div>
                                    <h3 className="text-[#0A3D62] font-bold text-sm uppercase tracking-wider">Tutor IA</h3>
                                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                        En línea
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="text-slate-400 hover:text-[#0A3D62] hover:bg-slate-200 p-1.5 rounded-lg transition-colors"
                                aria-label="Cerrar chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Área de Mensajes */}
                        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                            {historial.map((msg, i) => (
                                <div key={i} className={`flex ${msg.rol === 'usuario' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed break-words shadow-sm ${
                                        msg.rol === 'usuario' 
                                            ? 'bg-[#0A3D62] text-white rounded-tr-sm' 
                                            : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                    }`}>
                                        {msg.texto}
                                    </div>
                                </div>
                            ))}
                            
                            {cargando && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 shadow-sm">
                                        <span className="w-2 h-2 bg-[#0A3D62] rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-[#0A3D62] rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                        <span className="w-2 h-2 bg-[#0A3D62] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input de Mensaje */}
                        <form onSubmit={enviarMensaje} className="p-4 border-t border-slate-200 bg-white rounded-b-3xl">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    placeholder="Escribe tu duda aquí..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-800 focus:outline-none focus:border-[#0A3D62] focus:ring-1 focus:ring-[#0A3D62] transition-all placeholder:text-slate-400"
                                    disabled={cargando}
                                />
                                <button 
                                    type="submit" 
                                    disabled={cargando || !mensaje.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#0A3D62] text-white rounded-lg hover:bg-[#083252] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    aria-label="Enviar mensaje"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Botón Flotante (FAB) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center border-2 transition-all duration-300 ${
                    isOpen 
                        ? 'bg-white border-slate-200 text-[#0A3D62] shadow-xl' 
                        : 'bg-[#0A3D62] border-[#0A3D62] text-white hover:bg-[#083252]'
                }`}
                aria-label={isOpen ? "Cerrar tutor" : "Abrir tutor IA"}
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <img src="/MASCOTA CABEZA.png" alt="Abrir Tutor" className="w-8 h-8 object-contain drop-shadow-sm" />
                )}
            </motion.button>
        </div>
    );
};

export default TutorOraculo;