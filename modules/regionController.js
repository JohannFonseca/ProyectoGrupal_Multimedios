import "../components/AppHeader.js";
import "../components/MapaRegiones.js";

export function initRegionController() {
    const appHeader = document.querySelector("app-header");
    const mapaRegiones = document.querySelector("mapa-regiones");

    if (!appHeader || !mapaRegiones) {
        console.error("Faltan componentes necesarios en el DOM");
        return;
    }

    let _selectedRegion = null;

    document.addEventListener(
        "region-selected",
        (e) => {
            if (e.detail && e.detail._fromController) return;

            try {
                e.stopImmediatePropagation();
            } catch (err) {
                console.warn(
                    "No se pudo detener la propagación del evento 'region-selected'",
                    err,
                );
            }

            const regionKey = e.detail.region;

            if (_selectedRegion === regionKey) {
                _selectedRegion = null;
                console.log("Controlador: Región deseleccionada");
                mapaRegiones.region = null;

                document.dispatchEvent(
                    new CustomEvent("region-selected", {
                        detail: { region: null, _fromController: true },
                        bubbles: true,
                        composed: true,
                    }),
                );
                return;
            }

            _selectedRegion = regionKey;
            console.log("Controlador: Región seleccionada ->", regionKey);
            mapaRegiones.region = regionKey;

            document.dispatchEvent(
                new CustomEvent("region-selected", {
                    detail: { region: regionKey, _fromController: true },
                    bubbles: true,
                    composed: true,
                }),
            );

            // Hacer un pequeño scroll hacia abajo para mostrar `destino-list` (con duración controlada)
            try {
                const smoothScrollTo = (targetY, duration = 1200) => {
                    const startY = window.scrollY || window.pageYOffset;
                    const diff = targetY - startY;
                    if (diff === 0) return;

                    let start;
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
                    const top = window.scrollY + rect.top - 72; // dejar espacio para header
                    smoothScrollTo(top, 1200);
                } else {
                    // fallback: pequeño scroll hacia abajo
                    smoothScrollTo(window.scrollY + 160, 1200);
                }
            } catch (err) {
                // ignore scrolling errors
            }
        },
        true,
    );

    document.addEventListener("region-hover", (e) => {
        const regionKey = e.detail?.region ?? null;

        if (regionKey) {
            mapaRegiones.hoverRegion = regionKey;
        } else {
            mapaRegiones.hoverRegion = null;
        }
    });
}
