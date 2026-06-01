import { REGIONS_CONFIG, applySVGStyles } from '../data/regiones.js';

const sheet = new CSSStyleSheet();

await fetch(new URL('../css/mapa-regiones.css', import.meta.url))
    .then(r => r.text())
    .then(css => sheet.replaceSync(css));

class MapaRegiones extends HTMLElement {
    #currentRegion = null;
    #svgLoaded = false;
    #svgContent = '';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [sheet];

        await this.#loadSVG();

        this.render();
        this.#createRegionStyles();

        this.#svgLoaded = true;
        this.#updateMapUI();
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
            </div>
        `;
    }

    async #loadSVG() {
        try {
            const response = await fetch('./assets/images/mapa.svg');
            this.#svgContent = await response.text();
        } catch (error) {
            console.error('Error cargando el mapa SVG:', error);
        }
    }

    #createRegionStyles() {
        const regionIds = Object.keys(REGIONS_CONFIG)
            .map(id => `#${id}, #${id} path`)
            .join(', ');

        const style = document.createElement('style');

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
        if (!this.#currentRegion) return;

        Object.keys(REGIONS_CONFIG).forEach(id => {
            const regionElement = this.shadowRoot.getElementById(id);

            if (!regionElement) return;

            regionElement.style.translate = '';
            regionElement.style.scale = '';
            regionElement.style.filter = '';

            const paths = regionElement.querySelectorAll('path');

            if (paths.length > 0) {
                paths.forEach(path => {
                    applySVGStyles(path, null, true);

                    path.style.translate = '';
                    path.style.scale = '';
                    path.style.filter = '';
                });
            } else {
                applySVGStyles(regionElement, null, true);
            }
        });

        const selectedElement = this.shadowRoot.getElementById(this.#currentRegion);

        if (!selectedElement) {
            console.warn(
                'Región no encontrada en el SVG:',
                this.#currentRegion
            );
            return;
        }

        const color = REGIONS_CONFIG[this.#currentRegion]?.color;

        if (!color) return;

        const paths = selectedElement.querySelectorAll('path');

        if (paths.length > 0) {
            paths.forEach(path => applySVGStyles(path, color, false));
        } else {
            applySVGStyles(selectedElement, color, false);
        }

        console.log(`Región "${this.#currentRegion}" resaltada con color ${color}`);

        if (this.#currentRegion === 'pacifico-central') {
            console.log('¡Región Pacífico Central seleccionada! Aplicando efectos especiales...');
            paths.forEach(path => {
                path.style.translate = '-35px 40px';
                path.style.scale = '1.16';
                path.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
            });
        }

        if (this.#currentRegion === 'caribe') {
            console.log('¡Región Caribe seleccionada! Aplicando efectos especiales...');
            selectedElement.style.translate = '-30px 20px';
            selectedElement.style.scale = '1.16';
            selectedElement.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
        }

        if (this.#currentRegion === 'valle-central') {
            console.log('¡Región Valle Central seleccionada! Aplicando efectos especiales...');
            selectedElement.style.translate = '-7px 50px';
            selectedElement.style.scale = '1.16';
            selectedElement.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
        }

        if (this.#currentRegion === 'pacifico-norte') {
            console.log('¡Región Pacífico Norte seleccionada! Aplicando efectos especiales...');
            selectedElement.style.translate = '30px 50px';
            selectedElement.style.scale = '1.16';
            selectedElement.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.4))';
        }
    }
}

customElements.define('mapa-regiones', MapaRegiones);