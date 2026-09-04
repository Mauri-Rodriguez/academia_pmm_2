import React from 'react';

const SeccionInsignias = ({ todasInsignias = [], insigniasObtenidas = [] }) => {
    return (
        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-lg border-t-4 border-t-[#FBE000] mb-8 md:mb-10">
            {/* Encabezado de la Sección */}
            <div className="flex flex-col sm:flex-row items-center sm:justify-between mb-6 md:mb-8 gap-4 text-center sm:text-left">
                <div>
                    <h3 className="font-bold text-sm text-slate-900 uppercase tracking-widest">Panel de Logros</h3>
                    <p className="text-[9px] text-slate-400 uppercase mt-1 tracking-widest font-bold">Tu progreso en la plataforma</p>
                </div>
                <div className="bg-[#FBE000]/10 px-4 py-2 rounded-full border border-[#FBE000]">
                    <span className="text-[#0A3D62] font-bold text-[9px] md:text-[10px] tracking-widest">
                        {insigniasObtenidas.length} / {todasInsignias.length} OBTENIDOS
                    </span>
                </div>
            </div>

            {/* 
                🚩 GRID RESPONSIVE: 
                - Móvil: Scroll horizontal con 'snap' para que no se aplasten.
                - Desktop: Grid de 4 a 7 columnas.
            */}
            <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x pb-4 md:pb-0 scrollbar-hide">
                {todasInsignias.map((insignia) => {
                    // Verificamos si la insignia está en la lista de las obtenidas
                    const ganada = insigniasObtenidas.some(i => i.id_insignia === insignia.id_insignia);
                    
                    return (
                        <div key={insignia.id_insignia} className="group relative flex flex-col items-center snap-center shrink-0 w-20 md:w-auto">
                            {/* Círculo de la medalla */}
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 
                                ${ganada 
                                    ? 'border-[#FBE000] bg-[#FBE000]/10 shadow-md' 
                                    : 'border-slate-200 bg-slate-50 opacity-50 grayscale'}`}>
                                
                                <span className="text-2xl md:text-3xl filter drop-shadow-sm">
                                    {ganada ? '🏅' : '🔒'}
                                </span>
                            </div>

                            {/* Nombre de la insignia: Visible siempre en móvil, tooltip en desktop */}
                            <p className="text-[9px] font-bold text-slate-600 text-center mt-2 line-clamp-2 md:hidden">
                                {insignia.nombre_insignia}
                            </p>

                            {/* Tooltip solo para desktop */}
                            <div className="hidden md:block mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300 text-center absolute -bottom-16 bg-slate-900 p-3 rounded-xl border border-[#FBE000]/30 shadow-xl z-50 pointer-events-none w-32">
                                <p className="text-[9px] font-black uppercase text-[#FBE000] leading-tight">
                                    {insignia.nombre_insignia}
                                </p>
                                <p className="text-[8px] text-slate-300 uppercase mt-1 leading-tight">
                                    {insignia.descripcion || 'Logro académico'}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SeccionInsignias;