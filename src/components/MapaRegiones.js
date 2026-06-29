import {
  REGIONS_CONFIG,
  applySVGStyles,
  applySVGHoverStyles,
} from "../data/regiones.js";

const sheet = new CSSStyleSheet();

await fetch(new URL("../css/mapa-regiones.css", import.meta.url))
  .then((r) => r.text())
  .then((css) => sheet.replaceSync(css));

const REGION_LABELS = {
  "pacifico-norte": "Pacífico Norte",
  caribe: "Caribe",
  "valle-central": "Valle Central",
  "pacifico-central": "Pacífico Central y Sur",
};

const FACTS = [
  {
    title: "Biodiversidad",
    text: "Costa Rica concentra cerca del 6% de la biodiversidad mundial en un territorio pequeño.",
  },
  {
    title: "Zona Azul",
    text: "La Península de Nicoya es una de las 5 Zonas Azules del planeta.",
  },
  {
    title: "País de paz",
    text: "Costa Rica no tiene ejército permanente desde la Constitución de 1949.",
  },
  {
    title: "Arribadas",
    text: "En Ostional pueden llegar miles de tortugas lora durante una arribada.",
  },
  {
    title: "Esferas del Diquís",
    text: "Las esferas del Diquís son Patrimonio Mundial y siguen rodeadas de misterio.",
  },
  {
    title: "Energía renovable",
    text: "En años favorables, casi toda su electricidad proviene de fuentes renovables.",
  },
];

class MapaRegiones extends HTMLElement {
  // Campos privados de la clase (ES2022) para gestionar estado interno
  #currentRegion = null;
  #factIndex = 0;
  #factTimer = null;
  #hoverRegion = null;
  #svgLoaded = false;
  #svgContent = "";

  constructor() {
    super();
    // Crea el Shadow DOM para encapsular estilos e interactividad
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    // Adopta el stylesheet de mapa-regiones.css
    this.shadowRoot.adoptedStyleSheets = [sheet];

    // Carga de forma asíncrona el archivo de mapa vectorial SVG
    await this.#loadSVG();

    // Renderiza la estructura básica del componente
    this.render();
    
    // Configura listeners de eventos, temporizadores y estilos específicos
    this.#createRegionStyles();
    this.#attachFactListeners();
    this.#attachHoverListeners();
    this.#attachFeatureListeners();
    this.#startFactRotation();

    this.#svgLoaded = true;
    this.#updateMapUI();
  }

  disconnectedCallback() {
    // Limpieza: detiene el intervalo de rotación de datos curiosos para evitar fugas de memoria
    window.clearInterval(this.#factTimer);
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

    // Recorre la configuración de regiones y enlaza eventos en el SVG inyectado
    Object.keys(REGIONS_CONFIG).forEach((id) => {
      const el = this.shadowRoot.getElementById(id);
      if (!el) return;

      // Accesibilidad (A11y): Convierte elementos SVG en botones legibles por lectores de pantalla
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
      el.setAttribute("aria-label", `Seleccionar región ${REGION_LABELS[id]}`);
      el.setAttribute("aria-pressed", "false");

      // Función auxiliar para emitir el evento personalizado de hover
      const dispatchHover = (region) => {
        this.dispatchEvent(
          new CustomEvent("region-hover", {
            detail: { region },
            bubbles: true,
            composed: true, // compused: true permite que el evento atraviese el Shadow DOM
          }),
        );
      };

      const enter = (ev) => {
        dispatchHover(id);
        if (tooltip) this.#showTooltipAt(ev, tooltip);
      };

      const leave = () => {
        dispatchHover(null);
        if (tooltip) tooltip.style.display = "none";
      };

      const select = (ev) => this.#selectRegion(id, ev);

      // Accesibilidad por teclado (Soporte para Enter y Espacio)
      const handleKeydown = (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          select(ev);
        }
      };

      // Registro de eventos pointer y focus
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("pointerdown", select);
      el.addEventListener("focus", () => dispatchHover(id));
      el.addEventListener("blur", () => dispatchHover(null));
      el.addEventListener("keydown", handleKeydown);
    });
  }

  #attachFeatureListeners() {
    this.shadowRoot.querySelectorAll("[data-region-link]").forEach((item) => {
      const region = item.getAttribute("data-region-link");
      item.addEventListener("click", (ev) => this.#selectRegion(region, ev));
      item.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          this.#selectRegion(region, ev);
        }
      });
    });
  }

  #attachFactListeners() {
    this.shadowRoot.querySelectorAll("[data-fact-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.getAttribute("data-fact-index"));
        this.#showFact(index);
        this.#startFactRotation();
      });
    });
  }

  #startFactRotation() {
    window.clearInterval(this.#factTimer);
    this.#factTimer = window.setInterval(() => {
      this.#showFact((this.#factIndex + 1) % FACTS.length);
    }, 5200);
  }

  #showFact(index) {
    const fact = FACTS[index];
    if (!fact) return;

    this.#factIndex = index;

    const card = this.shadowRoot.querySelector(".fact-card");
    const number = this.shadowRoot.querySelector("[data-fact-number]");
    const title = this.shadowRoot.querySelector("[data-fact-title]");
    const text = this.shadowRoot.querySelector("[data-fact-text]");

    card?.classList.remove("is-visible");

    window.setTimeout(() => {
      if (number) number.textContent = String(index + 1).padStart(2, "0");
      if (title) title.textContent = fact.title;
      if (text) text.textContent = fact.text;

      this.shadowRoot.querySelectorAll("[data-fact-index]").forEach((button) => {
        const active = Number(button.getAttribute("data-fact-index")) === index;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      card?.classList.add("is-visible");
    }, 180);
  }

  #selectRegion(region, ev) {
    if (!region) return;
    ev?.stopPropagation();
    
    // Dispara el evento region-selected hacia afuera del componente
    this.dispatchEvent(
      new CustomEvent("region-selected", {
        detail: { region },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // Posiciona dinámicamente el cuadro de diálogo flotante (tooltip) de hover
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
      <section class="map-stage" aria-label="Mapa interactivo de regiones de Costa Rica">
        <div class="map-heading">
          <p class="map-eyebrow">Explora Costa Rica</p>
          <h2>Regiones emblemáticas y sabores únicos</h2>
          <p class="map-intro">Selecciona una región del mapa para descubrir su historia gastronómica, destinos y experiencias locales.</p>
        </div>

        <div class="map-layout">
          <div class="map-side map-side-left" aria-label="Rasgos gastronómicos y naturales">
            <button class="map-note note-cafe" type="button" data-region-link="valle-central">
              <svg viewBox="0 0 24 24">
                <path d="M6.5 9h9.25a4.25 4.25 0 0 1 0 8.5H11A4.5 4.5 0 0 1 6.5 13V9Z" />
                <path d="M16 11h1.2a2.1 2.1 0 0 1 0 4.2H16" />
                <path d="M6 20h11" />
                <path d="M9 5c0 1.2-1 1.4-1 2.4" />
                <path d="M13 4c0 1.2-1 1.4-1 2.4" />
              </svg>
              <span>
                <strong>Café de altura</strong>
                <small>Aromas cultivados entre montañas y neblina.</small>
              </span>
              <b aria-hidden="true">›</b>
            </button>

            <button class="map-note note-volcan" type="button" data-region-link="pacifico-norte">
              <svg viewBox="0 0 24 24">
                <path d="M3 19h18L14.5 7.5l-3 4.8-2-2.6L3 19Z" />
                <path d="M12.8 5.2c1.4-.9 2.9-.9 4.4 0" />
                <path d="M11.4 3.3c2.2-1.3 4.8-1.3 7 0" />
              </svg>
              <span>
                <strong>Volcanes</strong>
                <small>Tierra fértil, maíz, tradición y fuego.</small>
              </span>
              <b aria-hidden="true">›</b>
            </button>
          </div>

          <div class="map-center">
            <div class="map-stamp" aria-hidden="true">
              <span>CR</span>
              <small>Pura vida</small>
            </div>
            <div class="map-container">
              ${this.#svgContent}
              <div class="hover-tooltip" style="display:none; position:absolute;">Click para saber más</div>
            </div>
            <p class="map-caption">Costa Rica: pequeño por tamaño, gigante por naturaleza.</p>
          </div>

          <div class="map-side map-side-right" aria-label="Rasgos de costas y biodiversidad">
            <button class="map-note note-playa" type="button" data-region-link="pacifico-central">
              <svg viewBox="0 0 24 24">
                <path d="M4 18c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1" />
                <path d="M4 21c2 0 2-1 4-1s2 1 4 1 2-1 4-1 2 1 4 1" />
                <path d="M8 14a6 6 0 0 1 10-5" />
                <path d="M17 4v10" />
              </svg>
              <span>
                <strong>Costas</strong>
                <small>Playas, manglares y cocina junto al mar.</small>
              </span>
              <b aria-hidden="true">›</b>
            </button>

            <button class="map-note note-bosque" type="button" data-region-link="caribe">
              <svg viewBox="0 0 24 24">
                <path d="M12 20V9" />
                <path d="M12 9C9 5.5 5.5 5 3 6.2 4.1 10.1 7.3 12.1 12 9Z" />
                <path d="M12 10c3.4-3 6.8-3.1 9-1.6-1.2 3.7-4.4 5.4-9 1.6Z" />
              </svg>
              <span>
                <strong>Biodiversidad</strong>
                <small>Selva, cacao, coco y culturas vivas.</small>
              </span>
              <b aria-hidden="true">›</b>
            </button>
          </div>
        </div>

        <div class="map-lower">
          <aside class="facts-panel" aria-label="Datos curiosos sobre Costa Rica">
            <h3>¿Sabías que...?</h3>
            <article class="fact-card is-visible" aria-live="polite">
              <span class="fact-number" data-fact-number>01</span>
              <div>
                <strong data-fact-title>${FACTS[0].title}</strong>
                <p data-fact-text>${FACTS[0].text}</p>
              </div>
            </article>
            <div class="fact-dots" aria-label="Cambiar dato curioso">
              ${FACTS.map(
                (_, index) => `
                  <button
                    class="${index === 0 ? "is-active" : ""}"
                    type="button"
                    data-fact-index="${index}"
                    aria-label="Mostrar dato ${index + 1}"
                    aria-pressed="${index === 0}"
                  ></button>
                `,
              ).join("")}
            </div>
          </aside>
        </div>
      </section>
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
    // Restablece todas las regiones a su estado inicial neutro
    Object.keys(REGIONS_CONFIG).forEach((id) => {
      const regionElement = this.shadowRoot.getElementById(id);
      if (!regionElement) return;

      regionElement.setAttribute(
        "aria-pressed",
        String(id === this.#currentRegion),
      );
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

    // Aplica los estilos de HOVER a la región bajo el cursor
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

    // Destaca visualmente la región que se encuentra SELECCIONADA
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

    // ANIMACIÓN PREMIUM: Desplaza ('explota') la región seleccionada del resto del mapa
    // para generar énfasis 3D y profundidad. Cada una tiene desplazamientos adaptados.
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
