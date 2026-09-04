import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundNinja = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
            {/* Decoración de fondo sutil y limpia */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FBE000]/10 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 bg-white border border-slate-200 p-8 md:p-12 rounded-3xl shadow-xl border-t-4 border-t-[#FBE000] max-w-lg w-full"
            >
                {/* Mascota 3D: /pensando.png representa la búsqueda o confusión de forma amigable y académica */}
                <img 
                    src="/pensando.png" 
                    alt="Página no encontrada" 
                    className="w-32 h-32 md:w-40 md:h-40 object-contain mx-auto mb-6 drop-shadow-lg" 
                />
                
                <h1 className="text-6xl md:text-7xl font-extrabold text-slate-200 tracking-tight mb-2">
                    404
                </h1>
                
                <h2 className="text-xl md:text-2xl font-bold text-[#0A3D62] mb-4">
                    Página no encontrada
                </h2>
                
                <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto mb-8 leading-relaxed">
                    El recurso que estás buscando no existe, ha sido movido o la dirección es incorrecta. Por favor, verifica la URL o regresa a tu panel principal.
                </p>

                {/* 🚩 Heurística #3: Salidas claras y bien señalizadas */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto bg-slate-100 text-slate-700 hover:bg-slate-200 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                        <span>←</span> Volver atrás
                    </button>
                    
                    <button 
                        onClick={() => navigate('/estudiante/dashboard')}
                        className="w-full sm:w-auto bg-[#0A3D62] text-white hover:bg-[#083252] px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        Ir al Panel Principal
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFoundNinja;