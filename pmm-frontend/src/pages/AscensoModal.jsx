import React from 'react';
import { motion } from 'framer-motion';

const AscensoModal = ({ datos, onClose }) => {
    // Si por algún error no llegan datos, no rompemos el render
    if (!datos) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative bg-white border border-slate-200 p-8 md:p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl border-t-4 border-t-[#FBE000] overflow-hidden"
            >
                {/* Efecto de brillo sutil y elegante detrás de la mascota */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#FBE000]/10 blur-[80px] rounded-full pointer-events-none"></div>

                {/* Mascota 3D de Celebración */}
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    className="relative z-10 mb-6"
                >
                    <img 
                        src="/logro.png" 
                        alt="Celebrando ascenso" 
                        className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto drop-shadow-xl animate-bounce" 
                        style={{ animationDuration: '3s' }}
                    />
                </motion.div>

                {/* Badge de Logro */}
                <div className="inline-block bg-[#FBE000]/10 border border-[#FBE000]/30 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-[#0A3D62] text-[10px] md:text-xs font-black uppercase tracking-widest">
                        ¡Rango Actualizado!
                    </span>
                </div>

                {/* Título de Ascenso */}
                <h1 className="relative z-10 text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight uppercase leading-tight">
                    Ahora eres <br/> 
                    <span className="text-[#0A3D62]">
                        {datos.nuevoNivel}
                    </span>
                </h1>

                {/* Mensaje Motivacional Académico */}
                <p className="relative z-10 text-slate-600 text-sm md:text-base mb-8 leading-relaxed px-2 md:px-6">
                    "{datos.mensaje}"
                </p>

                {/* Botón de Acción (Patrón Oficial PMM) */}
                <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="relative z-10 w-full bg-[#0A3D62] text-white font-bold py-4 rounded-xl uppercase tracking-wider text-sm transition-all shadow-md hover:bg-[#083252] hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                    <span>Continuar al Panel</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </motion.button>

                {/* Footer Minimalista (Elimina el ruido de "SISTEMA_V2.6") */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
                        Academia PMM Interactivo
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default AscensoModal;