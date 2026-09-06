import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, BookOpen, AlertTriangle } from 'lucide-react';

const Terminos = () => {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-4xl border-t-4 border-[#FBE000] relative">
                
                <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-[#0A3D62] transition-colors text-sm font-semibold">
                    <ArrowLeft size={18} /> Volver
                </Link>

                <div className="text-center mb-8 mt-4">
                    <ShieldCheck className="w-12 h-12 text-[#0A3D62] mx-auto mb-4" />
                    <h1 className="text-2xl md:text-3xl font-extrabold text-[#0A3D62] uppercase tracking-wide">
                        Términos y Condiciones de Uso
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">Plataforma PMM Interactivo - Proyecto Académico</p>
                </div>

                <div className="space-y-6 text-sm md:text-base text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                            <BookOpen size={18} /> 1. Aceptación de los Términos
                        </h2>
                        <p>Al registrarse y utilizar la plataforma "PMM Interactivo", el usuario acepta los presentes términos. Esta plataforma ha sido desarrollada como un proyecto de investigación académica con fines educativos.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2">2. Propósito de la Plataforma</h2>
                        <p>PMM Interactivo tiene como objetivo apoyar el aprendizaje de las matemáticas en estudiantes universitarios mediante ejercicios interactivos, gamificación y retroalimentación asistida por Inteligencia Artificial. No sustituye la evaluación oficial ni la cátedra de la institución.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2 flex items-center gap-2">
                            <AlertTriangle size={18} /> 3. Responsabilidades del Usuario
                        </h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
                            <li>Utilizar un lenguaje respetuoso y académico en los foros de comunidad.</li>
                            <li>No compartir contenido de la plataforma con fines comerciales.</li>
                            <li>Entender que las sugerencias de la IA son herramientas de apoyo y deben ser verificadas con criterio propio.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2">4. Propiedad Intelectual</h2>
                        <p>Todo el contenido educativo, diseño de interfaz, código fuente y materiales de la plataforma son propiedad de los autores del proyecto y/o de la Institución Universitaria Antonio José Camacho, protegidos por las leyes de derechos de autor.</p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-[#0A3D62] mb-2">5. Limitación de Responsabilidad</h2>
                        <p>Al ser un entorno controlado de investigación, los autores no se hacen responsables por interrupciones temporales del servicio o por el uso indebido que el estudiante haga de las herramientas de la plataforma.</p>
                    </section>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                    <Link to="/registro" className="inline-block bg-[#0A3D62] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#083252] transition-all uppercase text-sm tracking-wide shadow-md">
                        He leído y acepto los términos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Terminos;