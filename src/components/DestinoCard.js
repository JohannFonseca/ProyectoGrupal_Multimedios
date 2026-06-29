const sheet = new CSSStyleSheet();
await fetch(new URL("../css/destino-card.css", import.meta.url))
  .then((respuesta) => respuesta.text())
  .then((css) => sheet.replaceSync(css));

const destinoCardTemplate = document.createElement("template");
destinoCardTemplate.innerHTML = `
  <article class="card" role="button" tabindex="0">
    <div class="card-body">
      <h3 class="card-nombre"></h3>
      <p class="card-historia"></p>
      <div class="card-cta" aria-hidden="true">
        <span>Ver detalles</span>
        <span>&rarr;</span>
      </div>
    </div>

    <div class="card-media">
      <div class="card-media-content"></div>
      <div class="card-meta">
        <span class="meta-destino"></span>
        <span class="meta-region"></span>
      </div>
    </div>
  </article>
`;

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
      "Pacifico Norte": "pacifico-norte",
      "Pacífico Norte": "pacifico-norte",
      Caribe: "caribe",
      "Valle Central": "valle-central",
      "Pacifico Central y Sur": "pacifico-sur",
      "Pacífico Central y Sur": "pacifico-sur",
    };
    return mapa[region] ?? "valle-central";
  }

  _crearPlaceholder(nombre) {
    const placeholder = document.createElement("div");
    placeholder.className = "card-placeholder";
    placeholder.setAttribute("role", "img");
    placeholder.setAttribute("aria-label", `Imagen de ${nombre}`);
    placeholder.innerHTML = `
      <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="180" height="120" fill="#e8dfd4"/>
        <line x1="0" y1="0" x2="180" y2="120" stroke="#aaa" stroke-width="1.5"/>
        <line x1="180" y1="0" x2="0" y2="120" stroke="#aaa" stroke-width="1.5"/>
      </svg>
    `;
    return placeholder;
  }

  _crearImagen(imagen, nombre) {
    const img = document.createElement("img");
    img.className = "card-img";
    img.src = imagen;
    img.alt = `Imagen de ${nombre}`;
    img.loading = "lazy";
    return img;
  }

  _render() {
    const id = this.getAttribute("destino-id") ?? "";
    const nombre = this.getAttribute("nombre") ?? "Destino";
    const imagen = this.getAttribute("imagen") ?? "";
    const region = this.getAttribute("region") ?? "Region";
    const historia = this.getAttribute("historia") ?? "";
    const cls = this._claseRegion(region);

    const fragment = destinoCardTemplate.content.cloneNode(true);
    this.shadowRoot.replaceChildren(fragment);

    const card = this.shadowRoot.querySelector(".card");
    const nombreEl = this.shadowRoot.querySelector(".card-nombre");
    const historiaEl = this.shadowRoot.querySelector(".card-historia");
    const mediaContent = this.shadowRoot.querySelector(".card-media-content");
    const metaDestino = this.shadowRoot.querySelector(".meta-destino");
    const metaRegion = this.shadowRoot.querySelector(".meta-region");

    card.classList.add(cls);
    card.setAttribute("aria-label", `Ver detalles de ${nombre}`);

    nombreEl.textContent = nombre;
    nombreEl.classList.add(cls);
    historiaEl.textContent = historia;
    metaDestino.textContent = nombre;
    metaRegion.textContent = region;
    metaRegion.classList.add(cls);

    mediaContent.replaceChildren(
      imagen ? this._crearImagen(imagen, nombre) : this._crearPlaceholder(nombre),
    );

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
