import {
    REGIONS_CONFIG,
    applySVGStyles,
    applySVGHoverStyles,
} from "../data/regiones.js";

const sheet = new CSSStyleSheet();

await fetch(new URL("../css/mapa-regiones.css", import.meta.url))
    .then((r) => r.text())
    .then((css) => sheet.replaceSync(css));

class MapaRegiones extends HTMLElement {
    #currentRegion = null;
    #hoverRegion = null;
    #svgLoaded = false;
    #svgContent = "";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [sheet];

        await this.#loadSVG();

        this.render();
        this.#createRegionStyles();

        this.#attachHoverListeners();

        this.#svgLoaded = true;
        this.#updateMapUI();
    }

    set hoverRegion(regionKey) {
        if (this.#hoverRegion === regionKey) return;
        this.#hoverRegion = regionKey;
        if (this.#svgLoaded) this.#updateMapUI();
    }

    get hoverRegion() {
        return this.#hoverRegion;
    }

    #attachHoverListeners() {
        const tooltip = this.shadowRoot.querySelector(".hover-tooltip");

        Object.keys(REGIONS_CONFIG).forEach((id) => {
            const el = this.shadowRoot.getElementById(id);
            if (!el) return;

            const enter = (ev) => {
                this.dispatchEvent(
                    new CustomEvent("region-hover", {
                        detail: { region: id },
                        bubbles: true,
                        composed: true,
                    }),
                );
                if (tooltip) this.#showTooltipAt(ev, tooltip);
            };

            const leave = () => {
                this.dispatchEvent(
                    new CustomEvent("region-hover", {
                        detail: { region: null },
                        bubbles: true,
                        composed: true,
                    }),
                );
                if (tooltip) tooltip.style.display = "none";
            };

            const select = (ev) => {
                ev.stopPropagation();
                this.dispatchEvent(
                    new CustomEvent("region-selected", {
                        detail: { region: id },
                        bubbles: true,
                        composed: true,
                    }),
                );
            };

            el.addEventListener("pointerenter", enter);
            el.addEventListener("pointerleave", leave);
            el.addEventListener("pointerdown", select);

            const paths = el.querySelectorAll("path");
            if (paths.length > 0) {
                paths.forEach((p) => {
                    p.addEventListener("pointerenter", enter);
                    p.addEventListener("pointerleave", leave);
                    p.addEventListener("pointerdown", select);
                });
            }
        });
    }

    #showTooltipAt(ev, tooltip) {
        try {
            const hostRect = this.getBoundingClientRect();
            const offsetX = 12;
            const offsetY = 12;
            const x = ev.clientX - hostRect.left + offsetX;
            const y = ev.clientY - hostRect.top + offsetY;
            tooltip.style.display = "block";
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        } catch (err) {
            console.warn("No se pudo posicionar el tooltip de hover", err);
        }
    }

    set region(regionKey) {
        if (this.#currentRegion === regionKey) return;

        this.#currentRegion = regionKey;

        if (this.#svgLoaded) {
            this.#updateMapUI();
        }
    }

    get region() {
        return this.#currentRegion;
    }

    render() {
        this.shadowRoot.setHTMLUnsafe(this.#getTemplate());
    }

    #getTemplate() {
        return `
            <div class="map-container">
                ${this.#svgContent}
                <div class="hover-tooltip" style="display:none; position:absolute;">Click para saber más</div>
            </div>
        `;
    }

    async #loadSVG() {
        try {
            const response = await fetch("./assets/images/mapa.svg");
            this.#svgContent = await response.text();
        } catch (error) {
            console.error("Error cargando el mapa SVG:", error);
        }
    }



    #createRegionStyles() {
        const regionIds = Object.keys(REGIONS_CONFIG)
            .map((id) => `#${id}, #${id} path`)
            .join(", ");

        const style = document.createElement("style");

        style.textContent = `
            ${regionIds} {
                transition:
                    translate 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    scale 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                    filter 0.8s ease;
                isolation: isolate;
            }
        `;

        this.shadowRoot.appendChild(style);
    }

    #updateMapUI() {
        Object.keys(REGIONS_CONFIG).forEach((id) => {
            const regionElement = this.shadowRoot.getElementById(id);
            if (!regionElement) return;

            regionElement.style.translate = "";
            regionElement.style.scale = "";
            regionElement.style.filter = "";

            const paths = regionElement.querySelectorAll("path");

            if (paths.length > 0) {
                paths.forEach((path) => {
                    applySVGStyles(path, null, true);
                    path.style.translate = "";
                    path.style.scale = "";
                    path.style.filter = "";
                });
            } else {
                applySVGStyles(regionElement, null, true);
            }
        });

        if (this.#hoverRegion && this.#hoverRegion !== this.#currentRegion) {
            const hoverEl = this.shadowRoot.getElementById(this.#hoverRegion);
            if (hoverEl) {
                const hoverColor = REGIONS_CONFIG[this.#hoverRegion]?.color;
                const hoverPaths = hoverEl.querySelectorAll("path");
                if (hoverPaths.length > 0) {
                    hoverPaths.forEach((p) => applySVGHoverStyles(p, hoverColor));
                } else {
                    applySVGHoverStyles(hoverEl, hoverColor);
                }
            }
        }

        if (!this.#currentRegion) return;

        const selectedElement = this.shadowRoot.getElementById(this.#currentRegion);
        if (!selectedElement) {
            console.warn("Región no encontrada en el SVG:", this.#currentRegion);
            return;
        }

        const color = REGIONS_CONFIG[this.#currentRegion]?.color;
        if (!color) return;

        const paths = selectedElement.querySelectorAll("path");
        if (paths.length > 0) {
            paths.forEach((path) => applySVGStyles(path, color, false));
        } else {
            applySVGStyles(selectedElement, color, false);
        }

        console.log(`Región "${this.#currentRegion}" resaltada con color ${color}`);

        if (this.#currentRegion === "pacifico-central") {
            paths.forEach((path) => {
                path.style.translate = "-35px 40px";
                path.style.scale = "1.16";
                path.style.filter = "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))";
            });
        }

        if (this.#currentRegion === "caribe") {
            selectedElement.style.translate = "-30px 20px";
            selectedElement.style.scale = "1.16";
            selectedElement.style.filter =
                "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))";
        }

        if (this.#currentRegion === "valle-central") {
            selectedElement.style.translate = "-7px 50px";
            selectedElement.style.scale = "1.16";
            selectedElement.style.filter =
                "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))";
        }

        if (this.#currentRegion === "pacifico-norte") {
            selectedElement.style.translate = "30px 50px";
            selectedElement.style.scale = "1.16";
            selectedElement.style.filter =
                "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))";
        }
    }
}

customElements.define("mapa-regiones", MapaRegiones);
