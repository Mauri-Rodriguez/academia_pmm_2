import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export const renderizarConMatematicas = (texto) => {
    if (!texto) return texto;

    // 1. PRE-PROCESAMIENTO: Limpiar patrones de texto plano que puedan existir en la BD
    let textoLimpio = texto
        // Convertir fracciones tipo (A) / (B) a \frac{A}{B}
        .replace(/\(([^)]+)\)\s*\/\s*\(([^)]+)\)/g, '\\frac{$1}{$2}')
        // Convertir límites tipo lim (x->2) a \lim_{x \to 2}
        .replace(/lim\s*\(\s*x\s*->\s*([^)]+)\s*\)/g, '\\lim_{x \\to $1}')
        .replace(/lim\s*\(\s*x\s*->\s*inf\s*\)/g, '\\lim_{x \\to \\infty}')
        .replace(/lim\s*\(\s*x\s*->\s*-inf\s*\)/g, '\\lim_{x \\to -\\infty}')
        // Asegurar que las potencias simples tengan llaves: x^2 -> x^{2}
        .replace(/([a-zA-Z0-9])\^([0-9]+)/g, '$1^{$2}')
        // Funciones trigonométricas y logaritmos
        .replace(/sen\(/g, '\\sin(')
        .replace(/cos\(/g, '\\cos(')
        .replace(/tan\(/g, '\\tan(')
        .replace(/ln\(/g, '\\ln(');

    const partes = [];
    let currentText = "";
    let i = 0;

    while (i < textoLimpio.length) {
        // 1. Detectar comando LaTeX (ej: \frac, \lim, \sqrt)
        if (textoLimpio[i] === '\\' && i + 1 < textoLimpio.length && /[a-zA-Z]/.test(textoLimpio[i+1])) {
            if (currentText) {
                partes.push({ type: 'text', content: currentText });
                currentText = "";
            }
            
            let cmd = "";
            let j = i + 1;
            while (j < textoLimpio.length && /[a-zA-Z]/.test(textoLimpio[j])) {
                cmd += textoLimpio[j];
                j++;
            }
            
            let mathBlock = "\\" + cmd;
            
            // Extraer subíndices (_), superíndices (^) y grupos de llaves {} que siguen al comando
            while (j < textoLimpio.length && (textoLimpio[j] === '_' || textoLimpio[j] === '^' || textoLimpio[j] === '{')) {
                if (textoLimpio[j] === '{') {
                    let braceCount = 1;
                    let k = j + 1;
                    while (k < textoLimpio.length && braceCount > 0) {
                        if (textoLimpio[k] === '{') braceCount++;
                        if (textoLimpio[k] === '}') braceCount--;
                        k++;
                    }
                    mathBlock += textoLimpio.substring(j, k);
                    j = k;
                } else {
                    // Es _ o ^
                    mathBlock += textoLimpio[j];
                    j++;
                    if (j < textoLimpio.length && textoLimpio[j] === '{') {
                        let braceCount = 1;
                        let k = j + 1;
                        while (k < textoLimpio.length && braceCount > 0) {
                            if (textoLimpio[k] === '{') braceCount++;
                            if (textoLimpio[k] === '}') braceCount--;
                            k++;
                        }
                        mathBlock += textoLimpio.substring(j, k);
                        j = k;
                    } else {
                        // Sub/superíndice de un solo carácter
                        while (j < textoLimpio.length && /[a-zA-Z0-9\\]/.test(textoLimpio[j])) {
                            mathBlock += textoLimpio[j];
                            j++;
                        }
                    }
                }
            }
            
            partes.push({ type: 'math', content: mathBlock });
            i = j;
        }
        // 2. Detectar potencias o subíndices sueltos: ^{...} o _{...}
        else if ((textoLimpio[i] === '^' || textoLimpio[i] === '_') && i + 1 < textoLimpio.length && textoLimpio[i+1] === '{') {
            if (currentText) {
                partes.push({ type: 'text', content: currentText });
                currentText = "";
            }
            let braceCount = 1;
            let k = i + 2;
            while (k < textoLimpio.length && braceCount > 0) {
                if (textoLimpio[k] === '{') braceCount++;
                if (textoLimpio[k] === '}') braceCount--;
                k++;
            }
            partes.push({ type: 'math', content: textoLimpio.substring(i, k) });
            i = k;
        }
        // 3. Detectar potencias simples de texto plano: x^2 (por si el replace del paso 1 no lo tomó)
        else if (textoLimpio[i] === '^' && i + 1 < textoLimpio.length && /[a-zA-Z0-9]/.test(textoLimpio[i+1])) {
            let k = i + 1;
            while (k < textoLimpio.length && /[a-zA-Z0-9]/.test(textoLimpio[k])) {
                k++;
            }
            const exponent = textoLimpio.substring(i + 1, k);
            
            const match = currentText.match(/([a-zA-Z0-9]+)$/);
            if (match) {
                const base = match[1];
                currentText = currentText.slice(0, -base.length);
                if (currentText) partes.push({ type: 'text', content: currentText });
                partes.push({ type: 'math', content: `${base}^{${exponent}}` });
                currentText = "";
            } else {
                if (currentText) {
                    partes.push({ type: 'text', content: currentText });
                    currentText = "";
                }
                partes.push({ type: 'math', content: `^{${exponent}}` });
            }
            i = k;
        }
        else {
            currentText += textoLimpio[i];
            i++;
        }
    }
    
    if (currentText) {
        partes.push({ type: 'text', content: currentText });
    }

    // Renderizado final
    return partes.map((parte, index) => {
        if (parte.type === 'text') {
            return <span key={index}>{parte.content}</span>;
        } else {
            // 🚩 CORRECCIÓN CLAVE: Usar SOLO InlineMath. 
            // BlockMath agrega márgenes verticales gigantes (display: block) que rompen 
            // el flujo del texto y hacen que las fracciones se vean "separadas".
            // InlineMath escala las fracciones y límites perfectamente sin romper la línea.
            return (
                <InlineMath 
                    key={index} 
                    math={parte.content} 
                    throwOnError={false} 
                    errorColor="#ef4444"
                />
            );
        }
    });
};