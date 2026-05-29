import { REGIONS_CONFIG, applySVGStyles } from '../data/regiones.js';

class MapaRegiones extends HTMLElement {
    #currentRegion = null;
    #svgLoaded = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        await this.#loadSVG();
    }

    set region(regionKey) {
        if (this.#currentRegion === regionKey) return;
        this.#currentRegion = regionKey;
        if (this.#svgLoaded) this.#updateMapUI();
    }

    get region() {
        return this.#currentRegion;
    }

    async #loadSVG() {
        try {
            const response = await fetch('./assets/images/mapa.svg');
            const svgText = await response.text();

            const container = document.createElement("div");
            container.classList.add("map-container");

            const regionIds = Object.keys(REGIONS_CONFIG).map(id => `#${id}, #${id} path`).join(', ');
            const style = document.createElement("style");
            style.textContent = `
                ${regionIds} {
                    transition: translate 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                                scale 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                                filter 0.8s ease;
                    isolation: isolate; 
                }
            `;
            this.shadowRoot.appendChild(style);

            container.innerHTML = svgText;
            this.shadowRoot.appendChild(container);

            this.#svgLoaded = true;
            this.#updateMapUI();
        } catch (error) {
            console.error("Error cargando el mapa SVG:", error);
        }
    }

    #updateMapUI() {
        if (!this.#currentRegion) return;
        const regionSelected = this.#currentRegion;


        Object.keys(REGIONS_CONFIG).forEach(id => {
            const regionElement = this.shadowRoot.getElementById(id);
            if (!regionElement) return;


            regionElement.style.translate = '';
            regionElement.style.scale = '';
            regionElement.style.filter = '';

            const paths = regionElement.querySelectorAll("path");
            if (paths.length > 0) {
                paths.forEach(p => {
                    applySVGStyles(p, null, true);
                    p.style.translate = '';
                    p.style.scale = '';
                    p.style.filter = '';
                });
            } else {
                applySVGStyles(regionElement, null, true);
            }
        });


        const selectedElement = this.shadowRoot.getElementById(this.#currentRegion);
        if (!selectedElement) {
            console.warn("Región no encontrada en el SVG:", this.#currentRegion);
            return;
        }

        const color = REGIONS_CONFIG[this.#currentRegion]?.color;
        if (!color) return;


        const paths = selectedElement.querySelectorAll("path");
        if (paths.length > 0) {
            paths.forEach(p => applySVGStyles(p, color, false));
        } else {
            applySVGStyles(selectedElement, color, false);
        }
        console.log(`Región "${this.#currentRegion}" resaltada con color ${color}`);
        if (this.#currentRegion === "pacifico-central") {
            console.log("¡Región Pacífico Central seleccionada! Aplicando efectos especiales...");
            paths.forEach(p => {
                p.style.translate = '-35px 40px';
                p.style.scale = '1.16';
                p.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))'; // Sombra
            });
        }
        if (this.#currentRegion === "caribe") {
            console.log("¡Región Caribe seleccionada! Aplicando efectos especiales...");
            selectedElement.style.translate = '0px 20px';
            selectedElement.style.scale = '1.16';
            selectedElement.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
        }
        if (this.#currentRegion === "valle-central") {
            console.log("¡Región Valle Central seleccionada! Aplicando efectos especiales...");
            selectedElement.style.translate = '-7px 50px';
            selectedElement.style.scale = '1.16';
            selectedElement.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
        }
        if (this.#currentRegion === "pacifico-norte") {
            console.log("¡Región Pacífico Norte seleccionada! Aplicando efectos especiales...");
            selectedElement.style.translate = '30px 50px';
            selectedElement.style.scale = '1.16';
            selectedElement.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
        }
    }
}

customElements.define("mapa-regiones", MapaRegiones);