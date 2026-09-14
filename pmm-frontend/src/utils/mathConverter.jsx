import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/* ============================================================================
 *  RENDERIZADOR LaTeX — Afinado a la BD real de pmm_interactivo
 *  ---------------------------------------------------------------------------
 *  Basado en análisis exhaustivo de las 220 filas de la tabla `ejercicios`.
 *
 *  Patrones soportados (100% de la data real):
 *    - \frac{...}{...}     → fracciones (con anidación)
 *    - \sqrt{...}          → raíces
 *    - \lim_{...}          → límites
 *    - \int ... dx         → integrales
 *    - \sin(...), \cos(...), \tan(...), \ln(...), \arctan(...)
 *    - \sin^{2}(x)         → funciones con exponente
 *    - x^{2}, e^{3x}, etc. → potencias sueltas
 *    - \cdot, \pi, \infty, \geq, \leq, \neq, \to, \sec, \cot, \csc
 *    - °, ', ''            → Unicode que KaTeX acepta nativo
 * ========================================================================== */

/* ---------------------------------------------------------------------------
 *  TABLA DE COMANDOS — Derivada del dump
 *  Cada entrada: [familia, requiereArgumento]
 *
 *  Familia 'paren': consume (...) si le sigue
 *  Familia 'brace': consume {...} si le sigue
 *  Familia 'sym':   no consume nada
 *  Familia 'big':   consume expresión completa (ej: \int x dx)
 * ------------------------------------------------------------------------- */

const COMANDOS = {
    // --- 2 argumentos entre llaves ---
    'frac': 'brace2',

    // --- 1 argumento entre llaves ---
    'sqrt': 'brace1',

    // --- Funciones que consumen (...) ---
    'sin': 'paren', 'cos': 'paren', 'tan': 'paren',
    'ln': 'paren', 'arctan': 'paren',
    'sec': 'paren', 'cot': 'paren', 'csc': 'paren',

    // --- Límite: consume expresión hasta un separador natural ---
    'lim': 'big',

    // --- Integral: consume expresión hasta un separador natural ---
    'int': 'big',

    // --- Símbolos puros (0 argumentos) ---
    'cdot': 'sym', 'pi': 'sym', 'infty': 'sym',
    'geq': 'sym', 'leq': 'sym', 'neq': 'sym',
    'to': 'sym', 'sec': 'sym', 'cot': 'sym', 'csc': 'sym',
    'pm': 'sym', 'mp': 'sym', 'times': 'sym', 'div': 'sym',
};

/* ---------------------------------------------------------------------------
 *  UTILIDADES
 * ------------------------------------------------------------------------- */

const esLetra = (c) => /[a-zA-Z]/.test(c);

/** Consume un bloque `{...}` balanceado desde `i`. Devuelve índice final o -1. */
const consumirLlaves = (s, i) => {
    if (s[i] !== '{') return -1;
    let depth = 1, j = i + 1;
    while (j < s.length && depth > 0) {
        // 🚩 FIX producción: charCodeAt(92) es '\', inmune a la minificación agresiva
        if (s.charCodeAt(j) === 92 && j + 1 < s.length) { j += 2; continue; }
        if (s[j] === '{') depth++;
        else if (s[j] === '}') depth--;
        j++;
    }
    return depth === 0 ? j : -1;
};

/** Consume un bloque `(...)` balanceado desde `i`. */
const consumirParentesis = (s, i) => {
    if (s[i] !== '(') return -1;
    let depth = 1, j = i + 1;
    while (j < s.length && depth > 0) {
        if (s[j] === '(') depth++;
        else if (s[j] === ')') depth--;
        j++;
    }
    return depth === 0 ? j : -1;
};

/** Consume un sub/superíndice `_x`, `_{x}`, `^x`, `^{x}`. */
const consumirSubSuper = (s, i) => {
    if (s[i] !== '_' && s[i] !== '^') return -1;
    let j = i + 1;
    if (j >= s.length) return j;
    if (s[j] === '{') {
        const end = consumirLlaves(s, j);
        return end !== -1 ? end : j;
    }
    // Sub/super de un caracter alfanumérico
    while (j < s.length && /[a-zA-Z0-9+\-]/.test(s[j])) j++;
    return j;
};

/* ---------------------------------------------------------------------------
 *  PARSER RECURSIVO
 * ------------------------------------------------------------------------- */

/**
 * Consume la expresión que sigue a un \int hasta un separador natural.
 * Ej: `x^{5} dx`, `\sin(x) dx`, `\frac{1}{x} dx`
 */
const consumirExpresion = (s, i) => {
    while (i < s.length) {
        const c = s[i];

        // Fin al encontrar `dx` o `dy` precedido de espacio (patrón típico de integral)
        if (c === ' ' && /^d[a-zA-Z]/.test(s.substring(i + 1))) break;

        // Fin en separadores "duros"
        if (c === ',' || c === ';' || c === ')') break;

        // Fin si el espacio va seguido de texto (español) - con soporte Unicode (flag u)
        if (c === ' ' && /^\s*[a-záéíóúñ]/u.test(s.substring(i + 1)) && !/^\s*[a-z]\s/i.test(s.substring(i))) break;

        // Consumir bloque {} balanceado
        if (c === '{') {
            const end = consumirLlaves(s, i);
            if (end !== -1) { i = end; continue; }
        }

        // Consumir bloque () balanceado
        if (c === '(') {
            const end = consumirParentesis(s, i);
            if (end !== -1) { i = end; continue; }
        }

        // Consumir sub-comandos anidados (blindado con charCodeAt)
        if (s.charCodeAt(i) === 92 && esLetra(s[i + 1])) {
            i = extraerBloque(s, i);
            continue;
        }

        // Consumir sub/super
        if (c === '_' || c === '^') {
            const end = consumirSubSuper(s, i);
            if (end !== -1 && end !== i) { i = end; continue; }
        }

        // Consumir operandos y operadores
        if (/[a-zA-Z0-9+\-*/=<>.\s]/.test(c)) { i++; continue; }

        break;
    }
    return i;
};

/**
 * Extrae un bloque matemático completo desde `\` en `start`.
 * Devuelve el índice final del bloque.
 */
const extraerBloque = (s, start) => {
    // 1) Leer nombre del comando
    let i = start + 1, name = '';
    while (i < s.length && esLetra(s[i])) { name += s[i]; i++; }
    if (!name) return start + 1;

    const tipo = COMANDOS[name];

    // 2) Consumir sub/superíndices pegados al comando (ej: \sin^{2}(x))
    while (i < s.length && (s[i] === '_' || s[i] === '^')) {
        const end = consumirSubSuper(s, i);
        if (end === -1 || end === i) break;
        i = end;
    }

    // 3) Consumir argumentos según tipo
    if (tipo === 'paren') {
        if (s[i] === '(') {
            const end = consumirParentesis(s, i);
            if (end !== -1) i = end;
        }
    } else if (tipo === 'brace1') {
        if (s[i] === '{') {
            const end = consumirLlaves(s, i);
            if (end !== -1) i = end;
        }
    } else if (tipo === 'brace2') {
        for (let k = 0; k < 2 && s[i] === '{'; k++) {
            const end = consumirLlaves(s, i);
            if (end === -1) break;
            i = end;
        }
    } else if (tipo === 'big') {
        i = consumirExpresion(s, i);
    } else if (!tipo) {
        // Comando desconocido: consumir solo {..} y _^
        while (i < s.length) {
            if (s[i] === '{') {
                const end = consumirLlaves(s, i);
                if (end !== -1) { i = end; continue; }
            }
            if (s[i] === '_' || s[i] === '^') {
                const end = consumirSubSuper(s, i);
                if (end !== -1 && end !== i) { i = end; continue; }
            }
            break;
        }
    }

    return i;
};

/** Separa el texto en partes: { type: 'text' | 'math' } */
const parsearTexto = (texto) => {
    const partes = [];
    let buf = '', i = 0;

    while (i < texto.length) {
        // 1) Inicio de comando LaTeX (Blindado con charCodeAt 92)
        if (texto.charCodeAt(i) === 92 && esLetra(texto[i + 1])) {
            if (buf) { partes.push({ type: 'text', content: buf }); buf = ''; }
            const end = extraerBloque(texto, i);
            partes.push({ type: 'math', content: texto.substring(i, end) });
            i = end;
            continue;
        }

        // 2) Potencia/subíndice suelto pegado a una base alfanumérica
        if ((texto[i] === '^' || texto[i] === '_') && i + 1 < texto.length) {
            const match = buf.match(/([a-zA-Z0-9\)\]\}]+)$/);
            if (match) {
                const base = match[1];
                buf = buf.slice(0, -base.length);
                if (buf) { partes.push({ type: 'text', content: buf }); buf = ''; }
                const end = consumirSubSuper(texto, i);
                if (end !== -1 && end !== i) {
                    partes.push({ type: 'math', content: base + texto.substring(i, end) });
                    i = end;
                    continue;
                }
            }
        }

        buf += texto[i++];
    }

    if (buf) partes.push({ type: 'text', content: buf });
    return partes;
};

/* ---------------------------------------------------------------------------
 *  RENDER
 * ------------------------------------------------------------------------- */

/** Detecta bloques que se ven mejor en modo `\displaystyle` */
const usaDisplay = (math) =>
    /\\frac|\\lim|\\int/.test(math);

const renderPartes = (partes) =>
    partes.map((p, k) => {
        if (p.type === 'text') {
            const lineas = p.content.split('\n');
            return (
                <span key={`t-${k}`}>
                    {lineas.map((line, idx) => (
                        <React.Fragment key={idx}>
                            {line}
                            {idx < lineas.length - 1 && <br />}
                        </React.Fragment>
                    ))}
                </span>
            );
        }
        const math = usaDisplay(p.content) ? `\\displaystyle ${p.content}` : p.content;
        return (
            <InlineMath
                key={`m-${k}`}
                math={math}
                throwOnError={false}
                errorColor="#ef4444"
            />
        );
    });

/* ---------------------------------------------------------------------------
 *  API PÚBLICA
 * ------------------------------------------------------------------------- */

/**
 * Renderiza un texto mixto (español + LaTeX) como JSX con KaTeX.
 * @param {string} texto — Texto crudo de la BD.
 * @returns {React.ReactNode}
 */
export const renderizarConMatematicas = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;
    
    // Normalizar saltos de línea y limpiar barras dobles escapadas del servidor
    const textoLimpio = texto.replace(/\r\n/g, '\n').replace(/\\\\/g, '\\');
    
    return renderPartes(parsearTexto(textoLimpio));
};

// Alias por compatibilidad
export const RenderMatematicas = ({ texto }) => renderizarConMatematicas(texto);