const CDP_URL = process.env.CDP_URL || 'http://127.0.0.1:9222';
const APP_URL = process.env.APP_URL || 'http://127.0.0.1:5173/docente/dashboard';

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const crearClienteCdp = async (webSocketDebuggerUrl) => {
    const socket = new WebSocket(webSocketDebuggerUrl);
    const pendientes = new Map();
    let secuencia = 0;

    await new Promise((resolve, reject) => {
        socket.addEventListener('open', resolve, { once: true });
        socket.addEventListener('error', reject, { once: true });
    });

    socket.addEventListener('message', (evento) => {
        const mensaje = JSON.parse(evento.data);
        if (!mensaje.id || !pendientes.has(mensaje.id)) return;

        const { resolve, reject } = pendientes.get(mensaje.id);
        pendientes.delete(mensaje.id);

        if (mensaje.error) reject(new Error(mensaje.error.message));
        else resolve(mensaje.result);
    });

    const enviar = (method, params = {}) => new Promise((resolve, reject) => {
        const id = ++secuencia;
        pendientes.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
    });

    return { socket, enviar };
};

const evaluar = async (enviar, expression) => {
    const resultado = await enviar('Runtime.evaluate', {
        expression,
        awaitPromise: true,
        returnByValue: true
    });
    return resultado.result.value;
};

const esperarInterfaz = async (enviar) => {
    for (let intento = 0; intento < 30; intento += 1) {
        const lista = await evaluar(
            enviar,
            `({
                estado: document.readyState,
                buscador: Boolean(document.getElementById('buscar-estudiante')),
                selector: Boolean(document.getElementById('filtro-rango'))
            })`
        );
        if (lista.estado === 'complete' && lista.buscador && lista.selector) return;
        await esperar(250);
    }
    const diagnostico = await evaluar(enviar, `({
        url: location.href,
        titulo: document.title,
        texto: document.body?.innerText?.slice(0, 300) || '',
        html: document.documentElement?.outerHTML?.slice(0, 500) || ''
    })`);
    throw new Error(
        `El panel docente no quedó disponible para la auditoría: ${JSON.stringify(diagnostico)}`
    );
};

const main = async () => {
    const respuestaTarget = await fetch(
        `${CDP_URL}/json/new?about:blank`,
        { method: 'PUT' }
    );
    if (!respuestaTarget.ok) {
        throw new Error(`No fue posible crear la pestaña: HTTP ${respuestaTarget.status}`);
    }

    const target = await respuestaTarget.json();
    const { socket, enviar } = await crearClienteCdp(target.webSocketDebuggerUrl);

    try {
        await enviar('Page.enable');
        await enviar('Runtime.enable');
        await enviar('Accessibility.enable');
        await enviar('Page.navigate', { url: new URL(APP_URL).origin });
        await esperar(500);
        await evaluar(enviar, `(() => {
            localStorage.setItem('token', 'token-local-de-auditoria');
            localStorage.setItem('usuario', JSON.stringify({
                id_usuario: 999999,
                nombre_completo: 'Docente de Auditoría',
                rol: 'docente'
            }));
            localStorage.setItem('docente_onboarding_visto', 'true');
            return true;
        })()`);
        await enviar('Page.navigate', { url: APP_URL });
        await esperarInterfaz(enviar);

        const escritorio = await evaluar(enviar, `(() => {
            const buscador = document.getElementById('buscar-estudiante');
            const selector = document.getElementById('filtro-rango');
            const etiquetaBuscador = document.querySelector('label[for="buscar-estudiante"]');
            const etiquetaSelector = document.querySelector('label[for="filtro-rango"]');

            const rgb = (valor) => {
                const partes = valor.match(/[0-9.]+/g)?.slice(0, 3).map(Number) || [];
                return partes.length === 3 ? partes : null;
            };
            const luminancia = ([r, g, b]) => {
                const canales = [r, g, b].map((canal) => {
                    const normalizado = canal / 255;
                    return normalizado <= 0.03928
                        ? normalizado / 12.92
                        : ((normalizado + 0.055) / 1.055) ** 2.4;
                });
                return 0.2126 * canales[0] + 0.7152 * canales[1] + 0.0722 * canales[2];
            };
            const contraste = (elemento) => {
                const estilo = getComputedStyle(elemento);
                const frente = rgb(estilo.color);
                const fondo = rgb(estilo.backgroundColor);
                if (!frente || !fondo) return null;
                const l1 = luminancia(frente);
                const l2 = luminancia(fondo);
                return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
            };

            buscador.focus();
            const estiloFoco = getComputedStyle(buscador);

            return {
                etiquetaBuscador: etiquetaBuscador?.textContent.trim() || '',
                etiquetaSelector: etiquetaSelector?.textContent.trim() || '',
                etiquetasAsociadasBuscador: buscador.labels?.length || 0,
                etiquetasAsociadasSelector: selector.labels?.length || 0,
                elementoInicialConFoco: document.activeElement?.id || '',
                contrasteBuscador: contraste(buscador),
                contrasteSelector: contraste(selector),
                indicadorFoco: estiloFoco.boxShadow !== 'none' || estiloFoco.outlineStyle !== 'none'
            };
        })()`);

        await enviar('Input.dispatchKeyEvent', {
            type: 'keyDown',
            key: 'Tab',
            code: 'Tab',
            windowsVirtualKeyCode: 9,
            nativeVirtualKeyCode: 9
        });
        await enviar('Input.dispatchKeyEvent', {
            type: 'keyUp',
            key: 'Tab',
            code: 'Tab',
            windowsVirtualKeyCode: 9,
            nativeVirtualKeyCode: 9
        });
        const focoDespuesDeTab = await evaluar(
            enviar,
            `document.activeElement?.id || ''`
        );

        const arbol = await enviar('Accessibility.getFullAXTree');
        const controles = arbol.nodes
            .filter((nodo) => ['searchbox', 'textbox', 'combobox'].includes(nodo.role?.value))
            .map((nodo) => ({
                rol: nodo.role?.value || '',
                nombre: nodo.name?.value || ''
            }));

        await enviar('Emulation.setDeviceMetricsOverride', {
            width: 375,
            height: 812,
            deviceScaleFactor: 1,
            mobile: true
        });
        await esperar(300);
        const movil = await evaluar(enviar, `({
            anchoViewport: innerWidth,
            anchoDocumento: document.documentElement.scrollWidth,
            desbordamientoHorizontal: document.documentElement.scrollWidth > innerWidth,
            buscadorVisible: Boolean(document.getElementById('buscar-estudiante')?.offsetParent),
            selectorVisible: Boolean(document.getElementById('filtro-rango')?.offsetParent)
        })`);

        await enviar('Emulation.setPageScaleFactor', { pageScaleFactor: 2 });
        await esperar(200);
        const zoom = await evaluar(enviar, `({
            buscadorPresente: Boolean(document.getElementById('buscar-estudiante')),
            selectorPresente: Boolean(document.getElementById('filtro-rango')),
            escalaVisual: window.visualViewport?.scale || null
        })`);

        const resultados = {
            nombresAccesibles: controles,
            etiquetas: escritorio,
            navegacionTeclado: {
                desde: escritorio.elementoInicialConFoco,
                hasta: focoDespuesDeTab
            },
            movil,
            zoom,
            comprobaciones: {
                etiquetasAsociadas:
                    escritorio.etiquetasAsociadasBuscador > 0 &&
                    escritorio.etiquetasAsociadasSelector > 0,
                nombresAccesibles:
                    controles.some((control) => /buscar estudiante/i.test(control.nombre)) &&
                    controles.some((control) => /filtrar estudiantes por rango/i.test(control.nombre)),
                ordenFoco:
                    escritorio.elementoInicialConFoco === 'buscar-estudiante' &&
                    focoDespuesDeTab === 'filtro-rango',
                contrasteTexto:
                    escritorio.contrasteBuscador >= 4.5 &&
                    escritorio.contrasteSelector >= 4.5,
                indicadorFoco: escritorio.indicadorFoco,
                adaptacionMovil:
                    !movil.desbordamientoHorizontal &&
                    movil.buscadorVisible &&
                    movil.selectorVisible,
                controlesConZoom:
                    zoom.buscadorPresente && zoom.selectorPresente
            }
        };

        console.log(JSON.stringify(resultados, null, 2));

        if (Object.values(resultados.comprobaciones).some((valor) => !valor)) {
            process.exitCode = 1;
        }
    } finally {
        try {
            await enviar('Page.close');
        } catch {
            // La pestaña puede cerrar el socket antes de confirmar el comando.
        }
        socket.close();
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
