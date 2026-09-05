import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

const Diagnostico = () => {
    const [preguntas, setPreguntas] = useState([]);
    const [paso, setPaso] = useState(0);
    const [respuestas, setRespuestas] = useState({});
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [examenIniciado, setExamenIniciado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const obtenerPreguntas = async () => {
            try {
                const res = await api.get('/api/diagnostico/preguntas');
                setPreguntas(res.data.data || res.data);
            } catch (err) {
                console.error("Error al invocar el banco de preguntas:", err);
                alert("No se pudieron cargar las preguntas.");
            } finally {
                setLoading(false);
            }
        };
        obtenerPreguntas();
    }, []);

    const manejarRespuesta = (valorOpcion) => {
        setRespuestas({ ...respuestas, [preguntas[paso].id_pregunta]: valorOpcion });
        if (paso < preguntas.length - 1) {
            setPaso(paso + 1);
        }
    };

    const finalizarPrueba = async () => {
        setEnviando(true);
        try {
            const formatoRespuestas = Object.keys(respuestas).map(id_pregunta => ({
                id_pregunta: parseInt(id_pregunta),
                respuesta: respuestas[id_pregunta]
            }));

            const res = await api.post('/api/diagnostico/evaluar', {
                respuestas: formatoRespuestas
            });

            navigate('/estudiante/resultado', {
                state: {
                    rango: res.data.resultados.rango_asignado,
                    aciertos: res.data.resultados.correctas,
                    detalle: res.data.detalle
                }
            });

        } catch (err) {
            console.error("❌ Error al guardar:", err);
            alert("Error al sellar tus resultados. Revisa la conexión con la Aldea.");
        } finally {
            setEnviando(false);
        }
    };

    // Estado de carga
    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full border-t-4 border-[#FBE000] text-center animate-pulse">
                <div className="flex justify-center mb-6">
                    <img src="/pensando.png" alt="Pensando" className="w-32 h-32 object-contain" />
                </div>
                <h3 className="text-2xl font-bold text-[#0A3D62] mb-2">Preparando diagnóstico</h3>
                <p className="text-slate-500">Cargando preguntas...</p>
            </div>
        </div>
    );

    if (preguntas.length === 0) return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-xl p-12 max-w-md w-full border-t-4 border-[#FBE000] text-center">
                <p className="text-slate-600">No hay preguntas disponibles en este momento.</p>
            </div>
        </div>
    );

    // VISTA 1: INSTRUCCIONES
    if (!examenIniciado) {
        return (
            <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-8 md:p-12 relative animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center mb-6">
                        <img src="/idea.png" alt="Idea" className="w-28 h-28 object-contain" />
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-[#2E5AAC] text-sm uppercase tracking-widest font-bold mb-2">Evaluación de Nivel</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0A3D62] leading-tight">
                            Diagnóstico <span className="text-[#FBE000]">Matemático</span>
                        </h1>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 space-y-4 mb-8">
                        <p className="text-slate-700 leading-relaxed">
                            Este cuestionario evaluará tu nivel actual en matemáticas para <strong>proporcionarte una ruta de aprendizaje</strong> y apoyarte en tu desarrollo académico.
                        </p>
                        <p className="text-slate-700 leading-relaxed">
                            Responde con honestidad. Si no sabes una respuesta, confía en tu intuición.
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white rounded-xl p-3 mt-2">
                            <span className="text-[#FBE000] text-lg">⏱️</span>
                            <span>Aproximadamente {preguntas.length} preguntas · Sin límite de tiempo</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setExamenIniciado(true)}
                        className="w-full bg-[#0A3D62] text-white rounded-xl py-4 font-bold uppercase tracking-wider hover:bg-[#083252] transition-all shadow-lg hover:shadow-xl active:scale-[0.98] text-sm"
                    >
                        Comenzar diagnóstico
                        <span className="ml-3 inline-block">→</span>
                    </button>
                </div>
            </div>
        );
    }

    // VISTA 2: EL EXAMEN
    const pActual = preguntas[paso];
    const opcionesKeys = ['opcion_a', 'opcion_b', 'opcion_c', 'opcion_d'];
    const esUltimaPregunta = paso === preguntas.length - 1;
    const estaRespondida = respuestas[pActual.id_pregunta] !== undefined;

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border-t-4 border-[#FBE000] p-6 md:p-10 relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header con progreso */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <div>
                        <p className="text-[#2E5AAC] text-xs uppercase tracking-widest font-bold">Diagnóstico</p>
                        <h2 className="text-xl font-bold text-[#0A3D62]">Pregunta {paso + 1}</h2>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 font-medium">
                            {paso + 1} / {preguntas.length}
                        </p>
                        <div className="w-24 h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                            <div 
                                className="h-full bg-[#0A3D62] rounded-full transition-all duration-300"
                                style={{ width: `${((paso + 1) / preguntas.length) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Pregunta */}
                <div className="mb-8">
                    <p className="text-lg text-slate-800 font-medium leading-relaxed">
                        "{pActual.pregunta}"
                    </p>
                </div>

                {/* Opciones */}
                <div className="grid grid-cols-1 gap-3">
                    {opcionesKeys.map((key, index) => {
                        const isSelected = respuestas[pActual.id_pregunta] === key;
                        return (
                            <button
                                key={key}
                                onClick={() => manejarRespuesta(key)}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${
                                    isSelected 
                                        ? 'border-[#FBE000] bg-[#FBE000]/10 shadow-md' 
                                        : 'border-slate-200 hover:border-[#2E5AAC]/40 hover:bg-slate-50'
                                }`}
                            >
                                <span className="inline-block w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-sm font-bold text-center leading-7 mr-3">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-slate-700">{pActual[key]}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Botón finalizar */}
                {esUltimaPregunta && estaRespondida && (
                    <button
                        onClick={finalizarPrueba}
                        disabled={enviando}
                        className="w-full mt-8 bg-[#0A3D62] text-white rounded-xl py-4 font-bold uppercase tracking-wider hover:bg-[#083252] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {enviando ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Procesando...
                            </span>
                        ) : (
                            'Finalizar y ver resultados'
                        )}
                    </button>
                )}

                {/* Indicador de progreso visual */}
                <div className="mt-6 flex justify-center gap-1.5">
                    {preguntas.map((_, index) => (
                        <div
                            key={index}
                            className={`h-1.5 rounded-full transition-all ${
                                index < paso 
                                    ? 'bg-[#0A3D62] w-4' 
                                    : index === paso 
                                    ? 'bg-[#FBE000] w-6' 
                                    : 'bg-slate-200 w-3'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Diagnostico;