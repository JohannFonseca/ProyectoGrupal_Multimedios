const sheet = new CSSStyleSheet();
await fetch(new URL("../css/destino-card.css", import.meta.url))
  .then((respuesta) => respuesta.text())
  .then((css) => sheet.replaceSync(css));

class DestinoCard extends HTMLElement {
  static get observedAttributes() {
    return ["destino-id", "nombre", "imagen", "region", "historia"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this._render();
  }

  attributeChangedCallback(_name, oldVal, newVal) {
    if (this.isConnected && oldVal !== newVal) this._render();
  }

  _claseRegion(region) {
    const mapa = {
      "Pacífico Norte": "pacifico-norte",
      Caribe: "caribe",
      "Valle Central": "valle-central",
      "Pacífico Central y Sur": "pacifico-sur",
    };
    return mapa[region] ?? "valle-central";
  }

  _render() {
    const id = this.getAttribute("destino-id") ?? "";
    const nombre = this.getAttribute("nombre") ?? "Destino";
    const imagen = this.getAttribute("imagen") ?? "";
    const region = this.getAttribute("region") ?? "Región";
    const historia = this.getAttribute("historia") ?? "";
    const cls = this._claseRegion(region);

    const mediaHTML = imagen
      ? `<img class="card-img" src="${imagen}" alt="Imagen de ${nombre}" loading="lazy" />`
      : `<div class="card-placeholder" role="img" aria-label="Imagen de ${nombre}">
           <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
             <rect width="180" height="120" fill="#e8dfd4"/>
             <line x1="0" y1="0" x2="180" y2="120" stroke="#aaa" stroke-width="1.5"/>
             <line x1="180" y1="0" x2="0" y2="120" stroke="#aaa" stroke-width="1.5"/>
           </svg>
         </div>`;

    this.shadowRoot.innerHTML = `
      <article class="card ${cls}" role="button" tabindex="0"
               aria-label="Ver detalles de ${nombre}">

        <!-- Texto a la izquierda -->
        <div class="card-body">
          <h3 class="card-nombre ${cls}">${nombre}</h3>
          <p class="card-historia">${historia}</p>
          <div class="card-cta" aria-hidden="true">
            <span>Ver detalles</span>
            <span>→</span>
          </div>
        </div>

        <!-- Imagen a la derecha con etiquetas debajo -->
        <div class="card-media">
          ${mediaHTML}
          <div class="card-meta">
            <span class="meta-destino">${nombre}</span>
            <span class="meta-region ${cls}">${region}</span>
          </div>
        </div>

      </article>
    `;

    const card = this.shadowRoot.querySelector(".card");

    const disparar = () => {
      this.dispatchEvent(
        new CustomEvent("destino-selected", {
          detail: { id },
          bubbles: true,
          composed: true,
        }),
      );
    };

    card.addEventListener("click", disparar);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        disparar();
      }
    });
  }
}

customElements.define("destino-card", DestinoCard);
