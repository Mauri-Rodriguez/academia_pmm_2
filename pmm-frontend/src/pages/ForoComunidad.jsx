import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { BACKEND_URL } from '../api/api';
import { useLocation, useNavigate } from 'react-router-dom';

const ForoComunidad = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    // Estados para MODAL DE CREACIÓN
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevaMision, setNuevaMision] = useState({ titulo: '', contenido: '' });
    const [archivo, setArchivo] = useState(null);

    // Estados para MODAL DE EDICIÓN DE POSTS
    const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
    const [misionAEditar, setMisionAEditar] = useState({ id_post: null, titulo: '', contenido: '' });
    const [archivoEdicion, setArchivoEdicion] = useState(null);

    const [misionSeleccionada, setMisionSeleccionada] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [enviandoComentario, setEnviandoComentario] = useState(false);

    // ESTADOS: EDICIÓN EN LÍNEA DE COMENTARIOS
    const [comentarioEditando, setComentarioEditando] = useState(null);
    const [textoComentarioEditado, setTextoComentarioEditado] = useState("");

    const [usuarioActualId, setUsuarioActualId] = useState(null);
    const fotoUsuarioActual = localStorage.getItem('user_avatar') || null;

    // 🚩 Función helper para construir la URL absoluta de las imágenes
    const obtenerUrlImagen = (ruta) => {
        if (!ruta) return null;
        if (ruta.startsWith('http')) return ruta;
        return `${BACKEND_URL}${ruta.startsWith('/') ? '' : '/'}${ruta}`;
    };

    // Colores ajustados a la paleta oficial para garantizar legibilidad del texto blanco
    const generarColorAvatar = (nombre = "Estudiante") => {
        const colores = ['#0A3D62', '#2E5AAC', '#059669', '#7C3AED', '#DB2777', '#EA580C'];
        let hash = 0;
        const nombreSeguro = String(nombre || "Estudiante");
        for (let i = 0; i < nombreSeguro.length; i++) {
            hash = nombreSeguro.charCodeAt(i) + ((hash << 5) - hash);
        }
        const indice = Math.abs(hash) % colores.length;
        return colores[indice];
    };

    useEffect(() => {
        // 1. Lógica existente del Token
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(window.atob(token.split('.')[1]));
                const id = payload.id_usuario || payload.id || payload.sub;
                setUsuarioActualId(Number(id));
            } catch (e) { console.error("Error de sesión"); }
        }

        // 2. Cargar los posts del servidor
        cargarForo();
    }, []);

    // 🚩 useEffect dedicado a detectar el parámetro de la notificación
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const postIdParaAbrir = params.get('open');

        if (postIdParaAbrir && posts.length > 0) {
            const postEncontrado = posts.find(p => Number(p.id_post) === Number(postIdParaAbrir));
            if (postEncontrado) {
                setMisionSeleccionada(postEncontrado);
                window.history.replaceState({}, document.title, "/estudiante/foro");
            }
        }
    }, [posts, location.search]);

    const cargarForo = async () => {
        try {
            const res = await api.get('/api/estudiante/foro/temas');
            setPosts(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error("Error al cargar muro"); }
        finally { setLoading(false); }
    };

    const cargarComentarios = async (id_post) => {
        try {
            const res = await api.get(`/api/estudiante/foro/comentarios/${id_post}`);
            setComentarios(Array.isArray(res.data) ? res.data : []);
        } catch (err) { console.error("Error al cargar respuestas"); }
    };

    useEffect(() => {
        if (misionSeleccionada) cargarComentarios(misionSeleccionada.id_post);
    }, [misionSeleccionada]);

    const publicarMision = async (e) => {
        e.preventDefault();
        if (!nuevaMision.titulo || !nuevaMision.contenido) return;
        const formData = new FormData();
        formData.append('titulo', nuevaMision.titulo);
        formData.append('contenido', nuevaMision.contenido);
        if (archivo) formData.append('imagen', archivo);

        try {
            await api.post('/api/estudiante/foro/crear', formData);
            setNuevaMision({ titulo: '', contenido: '' });
            setArchivo(null);
            setMostrarModal(false);
            cargarForo();
        } catch (err) { alert("Error al publicar."); }
    };

    const abrirEdicion = (post) => {
        setMisionAEditar({
            id_post: post.id_post,
            titulo: post.titulo,
            contenido: post.contenido
        });
        setArchivoEdicion(null);
        setMostrarModalEdicion(true);
    };

    const guardarEdicion = async (e) => {
        e.preventDefault();
        if (!misionAEditar.titulo || !misionAEditar.contenido) return;

        const formData = new FormData();
        formData.append('titulo', misionAEditar.titulo);
        formData.append('contenido', misionAEditar.contenido);
        if (archivoEdicion) formData.append('imagen', archivoEdicion);

        try {
            await api.put(`/api/estudiante/foro/post/${misionAEditar.id_post}`, formData);
            setMostrarModalEdicion(false);
            cargarForo();
        } catch (err) { alert("Error al editar."); }
    };

    const eliminarMision = async (id_post) => {
        if (!window.confirm("¿Eliminar esta publicación permanentemente?")) return;
        try {
            await api.delete(`/api/estudiante/foro/post/${id_post}`);
            cargarForo();
            setMisionSeleccionada(null);
        } catch (err) { alert("Error al borrar."); }
    };

    const enviarComentario = async (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;
        setEnviandoComentario(true);
        try {
            await api.post('/api/estudiante/foro/comentar', {
                id_post: misionSeleccionada.id_post,
                comentario: nuevoComentario
            });
            setNuevoComentario("");
            cargarComentarios(misionSeleccionada.id_post);
        } catch (err) { alert("Error al comentar."); }
        finally { setEnviandoComentario(false); }
    };

    const guardarEdicionComentario = async (id_comentario) => {
        if (!textoComentarioEditado.trim()) return;
        try {
            await api.put(`/api/estudiante/foro/comentario/${id_comentario}`, {
                comentario: textoComentarioEditado
            });
            setComentarioEditando(null);
            cargarComentarios(misionSeleccionada.id_post);
        } catch (err) {
            alert("Error al editar el comentario.");
        }
    };

    const eliminarComentario = async (id_comentario) => {
        if (!window.confirm("¿Borrar respuesta?")) return;
        try {
            await api.delete(`/api/estudiante/foro/comentario/${id_comentario}`);
            cargarComentarios(misionSeleccionada.id_post);
        } catch (err) { console.error("Error al borrar"); }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 text-center">
            <img src="/pensando.png" alt="Cargando foro" className="w-32 h-32 object-contain animate-bounce mb-4" />
            <div className="text-[#0A3D62] font-bold animate-pulse tracking-[0.3em] text-xs uppercase">Cargando la comunidad...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 font-sans pb-24 md:pb-20 relative overflow-hidden">
            {/* Elementos decorativos de fondo sutiles */}
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#FBE000]/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-[#0A3D62]/5 blur-[100px] rounded-full -z-10"></div>

            <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-4 shadow-sm">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 md:gap-4">
                        <button
                            onClick={() => navigate('/estudiante/dashboard')}
                            className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#FBE000]/20 hover:text-[#0A3D62] text-[#0A3D62] transition-all border border-slate-200 group"
                            title="Regresar al Panel"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        
                        {/* 🚩 CORRECCIÓN: Se eliminó 'hidden sm:block' para que el título sea visible en móvil */}
                        <h1 className="text-base md:text-xl font-bold text-[#0A3D62] tracking-tight uppercase block truncate">
                            Comunidad <span className="text-[#FBE000] drop-shadow-sm">PMM</span>
                        </h1>
                    </div>

                    <button
                        onClick={() => setMostrarModal(true)}
                        className="bg-[#0A3D62] text-white px-4 md:px-5 py-2.5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-wider hover:bg-[#083252] transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1 md:gap-2 whitespace-nowrap"
                    >
                        <span>+</span> <span className="hidden sm:inline">Nueva Consulta</span><span className="sm:hidden">Nueva</span>
                    </button>
                </div>
            </nav>

            {!misionSeleccionada ? (
                <div className="max-w-3xl mx-auto mt-8 space-y-6 px-4">
                    {posts.length === 0 && !loading ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-[#FBE000]">
                            <img src="/idea.png" alt="Sin consultas" className="w-24 h-24 object-contain mx-auto mb-4 opacity-70" />
                            <p className="text-slate-700 font-bold uppercase text-sm tracking-widest mb-2">Aún no hay consultas en el foro.</p>
                            <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                                ¡Sé el primero en compartir una duda o ayudar a un compañero!
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => {
                            const tieneFoto = post.autor_foto != null && post.autor_foto !== '';
                            const esMio = Number(post.id_usuario) === Number(usuarioActualId);

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    key={post.id_post}
                                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 shadow-sm border-t-4 border-t-[#FBE000] relative"
                                >
                                    <div className="p-5 md:p-6 flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                            <div
                                                className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-md overflow-hidden flex-shrink-0"
                                                style={{ backgroundColor: !tieneFoto ? generarColorAvatar(post.autor) : 'transparent' }}
                                            >
                                                {tieneFoto ? (
                                                    <img src={obtenerUrlImagen(post.autor_foto)} alt={post.autor} className="w-full h-full object-cover" />
                                                ) : (
                                                    post.autor?.charAt(0).toUpperCase() || "E"
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-sm md:text-base font-bold text-slate-900 tracking-tight truncate">{post.autor || "Estudiante"}</h4>
                                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">{new Date(post.fecha_creacion).toLocaleString()}</p>
                                            </div>
                                        </div>

                                        {esMio && (
                                            <div className="flex gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => abrirEdicion(post)}
                                                    className="text-slate-400 hover:text-[#2E5AAC] p-2 rounded-lg hover:bg-[#2E5AAC]/10 transition-colors"
                                                    title="Editar publicación"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => eliminarMision(post.id_post)}
                                                    className="text-slate-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Eliminar publicación"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-5 md:px-6 pb-4">
                                        <h3 className="text-lg md:text-xl font-bold text-[#0A3D62] mb-2 leading-tight break-words">{post.titulo}</h3>
                                        <p className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-4">{post.contenido}</p>
                                    </div>

                                    {post.imagen_url && (
                                        <div className="bg-slate-50 border-y border-slate-100 flex justify-center overflow-hidden">
                                            <img
                                                src={obtenerUrlImagen(post.imagen_url)}
                                                className="max-w-full h-auto max-h-[400px] object-contain hover:scale-[1.01] transition-transform duration-500"
                                                alt="evidencia"
                                            />
                                        </div>
                                    )}

                                    <div className="p-3 md:p-4 border-t border-slate-100 bg-slate-50/50">
                                        <button
                                            onClick={() => setMisionSeleccionada(post)}
                                            className="flex items-center justify-center gap-2 w-full text-[#0A3D62] hover:text-white hover:bg-[#0A3D62] text-xs md:text-sm font-bold transition-all py-3 rounded-xl border border-[#0A3D62]/20 hover:border-[#0A3D62]"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            Ver Respuestas
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            ) : (
                <div className="max-w-3xl mx-auto mt-6 md:mt-8 px-4">
                    <button
                        onClick={() => setMisionSeleccionada(null)}
                        className="mb-4 text-slate-500 hover:text-[#0A3D62] text-xs md:text-sm font-bold flex items-center gap-2 group transition-colors"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Foro
                    </button>

                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl border-t-4 border-t-[#FBE000]">
                        <div className="p-5 md:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                            <div
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0 border-2 border-white shadow-sm"
                                style={{ backgroundColor: !misionSeleccionada.autor_foto ? generarColorAvatar(misionSeleccionada.autor) : 'transparent' }}
                            >
                                {misionSeleccionada.autor_foto ? (
                                    <img src={obtenerUrlImagen(misionSeleccionada.autor_foto)} alt={misionSeleccionada.autor} className="w-full h-full object-cover" />
                                ) : (
                                    misionSeleccionada.autor?.charAt(0).toUpperCase() || "E"
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm md:text-base font-bold text-slate-900 uppercase tracking-tight">{misionSeleccionada.autor || "Estudiante"}</h4>
                                <p className="text-[10px] md:text-xs text-slate-500 font-medium">Publicó una consulta</p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            <h2 className="text-xl md:text-3xl text-slate-900 font-bold mb-4 leading-tight break-words">{misionSeleccionada.titulo}</h2>
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 whitespace-pre-wrap">{misionSeleccionada.contenido}</p>
                            {misionSeleccionada.imagen_url && (
                                <img src={obtenerUrlImagen(misionSeleccionada.imagen_url)} className="w-full rounded-2xl mb-6 border border-slate-200 shadow-sm" alt="evidencia" />
                            )}
                        </div>

                        <div className="bg-slate-50 p-6 md:p-8 space-y-6 border-t border-slate-200">
                            <h4 className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-slate-500 font-black flex items-center gap-2">
                                <span>💬</span> Respuestas de la Comunidad
                            </h4>

                            <div className="space-y-4">
                                {comentarios.length === 0 ? (
                                    <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-300">
                                        <p className="text-slate-500 text-sm">Aún no hay respuestas. ¡Sé el primero en colaborar!</p>
                                    </div>
                                ) : (
                                    comentarios.map((c) => {
                                        const tieneFotoComentario = c.autor_foto != null && c.autor_foto !== '';
                                        const esMiComentario = Number(c.id_usuario) === Number(usuarioActualId);

                                        return (
                                            <div key={c.id_comentario} className="flex gap-3 md:gap-4">
                                                <div
                                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] md:text-xs font-bold shadow-sm overflow-hidden border-2 border-white"
                                                    style={{ backgroundColor: !tieneFotoComentario ? generarColorAvatar(c.autor) : 'transparent' }}
                                                >
                                                    {tieneFotoComentario ? (
                                                        <img src={obtenerUrlImagen(c.autor_foto)} alt={c.autor} className="w-full h-full object-cover" />
                                                    ) : (
                                                        c.autor?.charAt(0).toUpperCase() || "E"
                                                    )}
                                                </div>

                                                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none flex-1 relative group shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-xs md:text-sm font-bold text-[#0A3D62]">{c.autor || "Estudiante"}</span>

                                                        {esMiComentario && (
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setComentarioEditando(c.id_comentario);
                                                                        setTextoComentarioEditado(c.comentario);
                                                                    }}
                                                                    className="text-slate-400 hover:text-[#2E5AAC] transition-all p-1 rounded hover:bg-[#2E5AAC]/10"
                                                                    title="Editar respuesta"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => eliminarComentario(c.id_comentario)}
                                                                    className="text-slate-400 hover:text-red-500 transition-all p-1 rounded hover:bg-red-50"
                                                                    title="Eliminar respuesta"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {comentarioEditando === c.id_comentario ? (
                                                        <div className="mt-2 flex flex-col gap-3">
                                                            <textarea
                                                                className="w-full bg-slate-50 border border-[#2E5AAC]/30 rounded-xl p-3 text-sm text-slate-800 outline-none focus:border-[#2E5AAC] focus:ring-1 focus:ring-[#2E5AAC] resize-none h-20"
                                                                value={textoComentarioEditado}
                                                                onChange={(e) => setTextoComentarioEditado(e.target.value)}
                                                            />
                                                            <div className="flex justify-end gap-3">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setComentarioEditando(null)}
                                                                    className="text-xs text-slate-500 hover:text-slate-800 uppercase font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                                                                >
                                                                    Cancelar
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => guardarEdicionComentario(c.id_comentario)}
                                                                    className="text-xs bg-[#0A3D62] text-white px-4 py-1.5 rounded-lg hover:bg-[#083252] uppercase font-bold transition-colors shadow-sm"
                                                                >
                                                                    Guardar
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{c.comentario}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            <form onSubmit={enviarComentario} className="flex gap-3 md:gap-4 pt-4 border-t border-slate-200">
                                <div
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm overflow-hidden border-2 border-white"
                                    style={{ backgroundColor: !fotoUsuarioActual ? generarColorAvatar("Tú") : 'transparent' }}
                                >
                                    {fotoUsuarioActual ? (
                                        <img src={obtenerUrlImagen(fotoUsuarioActual)} alt="Tú" className="w-full h-full object-cover" />
                                    ) : (
                                        "T"
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-800 outline-none focus:border-[#0A3D62] focus:ring-1 focus:ring-[#0A3D62] transition-all resize-none h-24 md:h-28 shadow-sm"
                                        placeholder="Escribe tu respuesta o solución aquí..."
                                        value={nuevoComentario}
                                        onChange={(e) => setNuevoComentario(e.target.value)}
                                    />
                                    <button
                                        disabled={enviandoComentario}
                                        className="self-end bg-[#0A3D62] text-white px-6 md:px-8 py-3 rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider hover:bg-[#083252] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-md flex items-center gap-2"
                                    >
                                        {enviandoComentario ? (
                                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Enviando...</>
                                        ) : (
                                            'Publicar Respuesta'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}

            <AnimatePresence>
                {/* MODAL DE CREACIÓN */}
                {mostrarModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMostrarModal(false)} className="absolute inset-0" />
                        <motion.form
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            onSubmit={publicarMision}
                            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 shadow-2xl border-t-4 border-t-[#FBE000]"
                        >
                            <div className="text-center mb-6">
                                <img src="/idea.png" alt="Nueva consulta" className="w-16 h-16 object-contain mx-auto mb-3" />
                                <h2 className="text-slate-900 font-bold text-xl md:text-2xl tracking-tight uppercase">Nueva Consulta</h2>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Comparte tu duda con la comunidad</p>
                            </div>

                            <div className="space-y-4">
                                <input 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm outline-none focus:border-[#0A3D62] focus:ring-1 focus:ring-[#0A3D62] transition-all" 
                                    placeholder="Título de la duda..." 
                                    value={nuevaMision.titulo} 
                                    onChange={(e) => setNuevaMision({ ...nuevaMision, titulo: e.target.value })} 
                                />
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm outline-none h-36 resize-none focus:border-[#0A3D62] focus:ring-1 focus:ring-[#0A3D62] transition-all" 
                                    placeholder="Describe el problema detalladamente..." 
                                    value={nuevaMision.contenido} 
                                    onChange={(e) => setNuevaMision({ ...nuevaMision, contenido: e.target.value })} 
                                />

                                <div className="flex flex-col gap-4">
                                    <label htmlFor="file-upload" className="w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500 hover:border-[#FBE000] hover:text-[#0A3D62] hover:bg-[#FBE000]/5 transition-all">
                                        {archivo ? `✅ ${archivo.name}` : "📎 ADJUNTAR IMAGEN (OPCIONAL)"}
                                        <input id="file-upload" type="file" className="hidden" onChange={(e) => setArchivo(e.target.files[0])} />
                                    </label>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold text-xs uppercase transition-all hover:bg-slate-200">Cancelar</button>
                                        <button type="submit" className="flex-[2] bg-[#0A3D62] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase shadow-md hover:bg-[#083252] transition-all active:scale-95">Publicar Consulta</button>
                                    </div>
                                </div>
                            </div>
                        </motion.form>
                    </div>
                )}

                {/* MODAL DE EDICIÓN */}
                {mostrarModalEdicion && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMostrarModalEdicion(false)} className="absolute inset-0" />
                        <motion.form
                            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                            onSubmit={guardarEdicion}
                            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-lg w-full relative z-10 shadow-2xl border-t-4 border-t-[#FBE000]"
                        >
                            <div className="text-center mb-6">
                                <img src="/idea.png" alt="Editar consulta" className="w-16 h-16 object-contain mx-auto mb-3" />
                                <h2 className="text-slate-900 font-bold text-xl md:text-2xl tracking-tight uppercase">Editar Consulta</h2>
                                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Mejora o corrige tu publicación</p>
                            </div>

                            <div className="space-y-4">
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm outline-none focus:border-[#0A3D62] focus:ring-1 focus:ring-[#0A3D62] transition-all"
                                    placeholder="Título de la duda..."
                                    value={misionAEditar.titulo}
                                    onChange={(e) => setMisionAEditar({ ...misionAEditar, titulo: e.target.value })}
                                />
                                <textarea
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm outline-none h-36 resize-none focus:border-[#0A3D62] focus:ring-1 focus:ring-[#0A3D62] transition-all"
                                    placeholder="Describe el problema detalladamente..."
                                    value={misionAEditar.contenido}
                                    onChange={(e) => setMisionAEditar({ ...misionAEditar, contenido: e.target.value })}
                                />

                                <div className="flex flex-col gap-4">
                                    <label htmlFor="file-upload-edit" className="w-full cursor-pointer bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-4 text-center text-xs text-slate-500 hover:border-[#FBE000] hover:text-[#0A3D62] hover:bg-[#FBE000]/5 transition-all">
                                        {archivoEdicion ? `✅ ${archivoEdicion.name}` : "📎 ACTUALIZAR IMAGEN (OPCIONAL)"}
                                        <input id="file-upload-edit" type="file" className="hidden" onChange={(e) => setArchivoEdicion(e.target.files[0])} />
                                    </label>
                                    <div className="flex gap-3 pt-2">
                                        <button type="button" onClick={() => setMostrarModalEdicion(false)} className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl font-bold text-xs uppercase transition-all hover:bg-slate-200">Cancelar</button>
                                        <button type="submit" className="flex-[2] bg-[#0A3D62] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase shadow-md hover:bg-[#083252] transition-all active:scale-95">Guardar Cambios</button>
                                    </div>
                                </div>
                            </div>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ForoComunidad;