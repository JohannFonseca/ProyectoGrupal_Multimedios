import "../components/AppHeader.js";
import "../components/MapaRegiones.js";

/**
 * Controlador de Regiones (Mediador)
 * ---------------------------------
 * Este módulo actúa como coordinador principal de eventos entre el header de la aplicación
 * (app-header), el mapa interactivo (mapa-regiones) y la lista de destinos (destino-list).
 * Implementa un patrón de desacoplamiento donde los componentes se comunican mediante Custom Events.
 */
export function initRegionController() {
    // Buscar los componentes principales en el DOM
    const appHeader = document.querySelector("app-header");
    const mapaRegiones = document.querySelector("mapa-regiones");

    if (!appHeader || !mapaRegiones) {
        console.error("Faltan componentes necesarios en el DOM");
        return;
    }

    // Guarda el estado de la región seleccionada actualmente
    let _selectedRegion = null;

    /**
     * Escucha el evento personalizado 'region-selected' que disparan el mapa u otros enlaces.
     * Se usa capture phase (true) para interceptar el evento de manera prioritaria.
     */
    document.addEventListener(
        "region-selected",
        (e) => {
            // Evita bucles infinitos si el evento fue relanzado por este mismo controlador
            if (e.detail && e.detail._fromController) return;

            try {
                e.stopImmediatePropagation(); // Detiene la propagación inmediata para controlar el flujo
            } catch (err) {
                console.warn(
                    "No se pudo detener la propagación del evento 'region-selected'",
                    err,
                );
            }

            const regionKey = e.detail.region;

            // CASO 1: Si se hace click en la región que ya está seleccionada, se deselecciona todo
            if (_selectedRegion === regionKey) {
                _selectedRegion = null;
                console.log("Controlador: Región deseleccionada");
                mapaRegiones.region = null;
                mapaRegiones.removeAttribute("data-active-region");
                appHeader.removeAttribute("active-region");

                // Notifica a toda la app que ya no hay ninguna región seleccionada
                document.dispatchEvent(
                    new CustomEvent("region-selected", {
                        detail: { region: null, _fromController: true },
                        bubbles: true,
                        composed: true,
                    }),
                );
                return;
            }

            // CASO 2: Se selecciona una nueva región
            _selectedRegion = regionKey;
            console.log("Controlador: Región seleccionada ->", regionKey);
            mapaRegiones.region = regionKey;
            
            // Sincroniza atributos en el HTML para que el CSS aplique los estilos correspondientes
            mapaRegiones.setAttribute("data-active-region", regionKey);
            appHeader.setAttribute("active-region", regionKey);

            // Relanza el evento a toda la aplicación marcando que proviene del controlador
            document.dispatchEvent(
                new CustomEvent("region-selected", {
                    detail: { region: regionKey, _fromController: true },
                    bubbles: true,
                    composed: true,
                }),
            );

            // ANIMACIÓN: Hace scroll automático hacia abajo para mostrar la sección 'destino-list'
            try {
                /**
                 * Función auxiliar de scroll suave usando interpolación matemática (Cosine Ease-In-Out)
                 * y requestAnimationFrame para un rendimiento óptimo de 60fps sin tirones.
                 */
                const smoothScrollTo = (targetY, duration = 1200) => {
                    const startY = window.scrollY || window.pageYOffset;
                    const diff = targetY - startY;
                    if (diff === 0) return;

                    let start;
                    // Función de suavizado coseno
                    const easeInOut = (t) => 0.5 - Math.cos(Math.PI * t) / 2;

                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const elapsed = timestamp - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = easeInOut(progress);
                        window.scrollTo(0, Math.round(startY + diff * eased));
                        if (elapsed < duration) requestAnimationFrame(step);
                    };

                    requestAnimationFrame(step);
                };

                const destinoEl = document.querySelector('destino-list');
                if (destinoEl) {
                    const rect = destinoEl.getBoundingClientRect();
                    // Deja un espacio libre de 72px arriba para que la barra de navegación no tape el contenido
                    const top = window.scrollY + rect.top - 72;
                    smoothScrollTo(top, 1200);
                } else {
                    // Si no encuentra la sección, hace un scroll relativo de respaldo
                    smoothScrollTo(window.scrollY + 160, 1200);
                }
            } catch (err) {
                // Silencia errores del scroll para evitar romper la experiencia de usuario
            }
        },
        true,
    );

    /**
     * Escucha el evento personalizado 'region-hover' para cambiar los estados de hover en el mapa
     */
    document.addEventListener("region-hover", (e) => {
        const regionKey = e.detail?.region ?? null;

        if (regionKey) {
            mapaRegiones.hoverRegion = regionKey;
            mapaRegiones.setAttribute("data-hover-region", regionKey);
        } else {
            mapaRegiones.hoverRegion = null;
            mapaRegiones.removeAttribute("data-hover-region");
        }
    });
}
