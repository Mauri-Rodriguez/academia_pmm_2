import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

/* ============================================================================
 *  RENDERIZADOR LaTeX — Afinado a la BD real de pmm_interactivo
 * ========================================================================== */

const COMANDOS = {
    'frac': 'brace2',
    'sqrt': 'brace1',
    'sin': 'paren', 'cos': 'paren', 'tan': 'paren',
    'ln': 'paren', 'arctan': 'paren',
    'sec': 'paren', 'cot': 'paren', 'csc': 'paren',
    'lim': 'big',
    'int': 'big',
    'cdot': 'sym', 'pi': 'sym', 'infty': 'sym',
    'geq': 'sym', 'leq': 'sym', 'neq': 'sym',
    'to': 'sym', 'pm': 'sym', 'mp': 'sym', 'times': 'sym', 'div': 'sym',
};

const esLetra = (c) => /[a-zA-Z]/.test(c);

const consumirLlaves = (s, i) => {
    if (s[i] !== '{') return -1;
    let depth = 1, j = i + 1;
    while (j < s.length && depth > 0) {
        if (s.charCodeAt(j) === 92 && j + 1 < s.length) { j += 2; continue; }
        if (s[j] === '{') depth++;
        else if (s[j] === '}') depth--;
        j++;
    }
    return depth === 0 ? j : -1;
};

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

const consumirSubSuper = (s, i) => {
    if (s[i] !== '_' && s[i] !== '^') return -1;
    let j = i + 1;
    if (j >= s.length) return j;
    if (s[j] === '{') {
        const end = consumirLlaves(s, j);
        return end !== -1 ? end : j;
    }
    while (j < s.length && /[a-zA-Z0-9+\-]/.test(s[j])) j++;
    return j;
};

const saltarEspacios = (s, i) => {
    while (i < s.length && /\s/.test(s[i])) i++;
    return i;
};

const consumirExpresion = (s, i) => {
    while (i < s.length) {
        const c = s[i];

        if (c === ' ' && /^d[a-zA-Z]/.test(s.substring(i + 1))) break;
        if (c === ',' || c === ';' || c === ')') break;
        if (c === ' ' && /^\s*[a-záéíóúñ]/u.test(s.substring(i + 1)) && !/^\s*[a-z]\s/i.test(s.substring(i))) break;

        if (c === '{') {
            const end = consumirLlaves(s, i);
            if (end !== -1) { i = end; continue; }
        }
        if (c === '(') {
            const end = consumirParentesis(s, i);
            if (end !== -1) { i = end; continue; }
        }
        if (s.charCodeAt(i) === 92 && esLetra(s[i + 1])) {
            i = extraerBloque(s, i);
            continue;
        }
        if (c === '_' || c === '^') {
            const end = consumirSubSuper(s, i);
            if (end !== -1 && end !== i) { i = end; continue; }
        }
        if (/[a-zA-Z0-9+\-*/=<>.\s]/.test(c)) { i++; continue; }

        break;
    }
    return i;
};

const extraerBloque = (s, start) => {
    let i = start + 1, name = '';
    while (i < s.length && esLetra(s[i])) { name += s[i]; i++; }
    if (!name) return start + 1;

    const tipo = COMANDOS[name];

    // Consumir sub/superíndices pegados al comando (ej: \sin^{2}(x))
    while (i < s.length) {
        let nextIdx = saltarEspacios(s, i);
        if (nextIdx < s.length && (s[nextIdx] === '_' || s[nextIdx] === '^')) {
            i = nextIdx;
            const end = consumirSubSuper(s, i);
            if (end === -1 || end === i) break;
            i = end;
        } else {
            break;
        }
    }

    // Saltar espacios antes de los argumentos
    i = saltarEspacios(s, i);

    if (tipo === 'paren') {
        if (i < s.length && s[i] === '(') {
            const end = consumirParentesis(s, i);
            if (end !== -1) i = end;
        }
    } else if (tipo === 'brace1') {
        if (i < s.length && s[i] === '{') {
            const end = consumirLlaves(s, i);
            if (end !== -1) i = end;
        }
    } else if (tipo === 'brace2') {
        for (let k = 0; k < 2; k++) {
            i = saltarEspacios(s, i);
            if (i < s.length && s[i] === '{') {
                const end = consumirLlaves(s, i);
                if (end === -1) break;
                i = end;
            } else {
                break;
            }
        }
    } else if (tipo === 'big') {
        i = consumirExpresion(s, i);
    } else if (!tipo) {
        while (i < s.length) {
            i = saltarEspacios(s, i);
            if (i < s.length && s[i] === '{') {
                const end = consumirLlaves(s, i);
                if (end !== -1) { i = end; continue; }
            }
            if (i < s.length && (s[i] === '_' || s[i] === '^')) {
                const end = consumirSubSuper(s, i);
                if (end !== -1 && end !== i) { i = end; continue; }
            }
            break;
        }
    }

    return i;
};

const parsearTexto = (texto) => {
    const partes = [];
    let buf = '', i = 0;

    while (i < texto.length) {
        if (texto.charCodeAt(i) === 92 && esLetra(texto[i + 1])) {
            if (buf) { partes.push({ type: 'text', content: buf }); buf = ''; }
            const end = extraerBloque(texto, i);
            partes.push({ type: 'math', content: texto.substring(i, end) });
            i = end;
            continue;
        }

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
 * 
 * ⚠️ IMPORTANTE: NO agregar .replace(/\\\\/g, '\\') aquí.
 *    Oxc (Vite 8) lo minifica mal en producción y rompe las llaves {} y \co.
 *    El backend ya envía los backslashes correctos.
 */
export const renderizarConMatematicas = (texto) => {
    if (!texto || typeof texto !== 'string') return texto;
    
    // Solo normalizamos saltos de línea. NO tocar backslashes.
    const textoLimpio = texto.replace(/\r\n/g, '\n');
    
    return renderPartes(parsearTexto(textoLimpio));
};

export const RenderMatematicas = ({ texto }) => renderizarConMatematicas(texto);