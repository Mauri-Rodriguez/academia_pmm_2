import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Brain, UserCheck, Database } from 'lucide-react';

const Privacidad = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border-t-4 border-[#FBE000] relative">
                
                <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-[#0A3D62] transition-colors text-sm font-semibold">
                    <ArrowLeft size={18} /> Volver
                </Link>

                <div className="text-center mb-8 mt-4">
                    <Lock className="w-12 h-12 text-[#0A3D62] mx-auto mb-4" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A3D62] uppercase tracking-wide">
                        Política de Privacidad y Tratamiento de Datos
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">Conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013</p>
                </div>

                <div className="space-y-6 text-sm md:text-base text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                            <Database size={18} /> 1. Datos que Recolectamos
                        </h2>
                        <p>Para brindar una experiencia personalizada, la plataforma recolecta:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Datos de identificación: Nombre completo y correo institucional.</li>
                            <li>Datos académicos: Progreso en módulos, puntajes de diagnóstico e historial de errores en ejercicios.</li>
                            <li>Datos de interacción: Publicaciones y comentarios en el foro de comunidad.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2">2. Finalidad del Tratamiento</h2>
                        <p>La información será utilizada exclusivamente para: personalizar la ruta de aprendizaje, generar retroalimentación automática, validar la investigación académica del proyecto de grado y mejorar la experiencia de usuario.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                            <Brain size={18} /> 3. Uso de Inteligencia Artificial (Aviso Importante)
                        </h2>
                        <p>La plataforma utiliza la API de Google Gemini para generar explicaciones y pistas sobre los errores cometidos. <strong>Advertencia:</strong> El usuario se compromete a NO compartir información personal sensible (números de documento, direcciones, datos financieros) en el chat con el Tutor IA, ya que es una herramienta de apoyo académico.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                            <Lock size={18} /> 4. Medidas de Seguridad
                        </h2>
                        <p>Implementamos estándares de seguridad de la información, incluyendo la encriptación de contraseñas mediante algoritmos hash (bcrypt) y el uso de conexiones seguras para proteger sus datos contra accesos no autorizados.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                            <UserCheck size={18} /> 5. Derechos ARCO del Titular
                        </h2>
                        <p>De conformidad con la ley colombiana, usted tiene derecho a:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li><strong>Acceso:</strong> Conocer qué datos tenemos sobre usted.</li>
                            <li><strong>Rectificación:</strong> Solicitar la corrección de su nombre o correo.</li>
                            <li><strong>Cancelación:</strong> Solicitar la eliminación de su cuenta y datos del sistema.</li>
                            <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos para fines específicos.</li>
                        </ul>
                        <p className="mt-2">Para ejercer estos derechos, puede contactar a los administradores del proyecto a través de los canales institucionales.</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                    <Link to="/registro" className="inline-block bg-[#0A3D62] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md">
                        He leído y acepto la política de privacidad
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Privacidad;