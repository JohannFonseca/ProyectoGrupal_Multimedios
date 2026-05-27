import "./DestinoCard.js";

class DestinoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._datos         = null;
    this._regionActiva  = null;
  }

  async connectedCallback() {
    await this._renderEstructura();
    await this._cargarDatos();

    document.addEventListener("region-selected", (e) => {
      this._regionActiva = e.detail.region;
      this._pintarDestinos();
    });
  }

  async _renderEstructura() {
    const css = await fetch("./css/destino-list.css").then((r) => r.text());

    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div id="contenedor">
        <p class="loading">Cargando destinos…</p>
      </div>
    `;
  }

  async _cargarDatos() {
    try {
      const respuesta  = await fetch("./data/destinos.json");
      this._datos      = await respuesta.json();
      this._pintarDestinos();
    } catch (err) {
      const c = this.shadowRoot.getElementById("contenedor");
      c.innerHTML = `<p class="error">Error al cargar los destinos.</p>`;
      console.error("DestinoList: error cargando JSON →", err);
    }
  }

  _slugANombre(slug) {
    const mapa = {
      "pacifico-norte":   "Pacífico Norte",
      "caribe":           "Caribe",
      "valle-central":    "Valle Central",
      "pacifico-central": "Pacífico Central y Sur",
    };
    return mapa[slug] ?? null;
  }

  _pintarDestinos() {
    if (!this._datos) return;

    const contenedor = this.shadowRoot.getElementById("contenedor");
    contenedor.innerHTML = "";

    const nombreActivo = this._regionActiva
      ? this._slugANombre(this._regionActiva)
      : null;

    const regiones = nombreActivo
      ? this._datos.regiones.filter((r) => r.nombre === nombreActivo)
      : this._datos.regiones;

    regiones.forEach((region) => {
      const bloque = document.createElement("div");
      bloque.className = "region-block";

      const about = document.createElement("div");
      about.className = "region-about";
      about.innerHTML = `
        <p class="about-label">About</p>
        <p class="about-texto">${region.descripcion}</p>
      `;
      bloque.appendChild(about);

      const titulo = document.createElement("h2");
      titulo.className = "section-title";
      titulo.textContent = `Destinos a conocer — ${region.nombre}`;
      bloque.appendChild(titulo);

      region.destinos.forEach((destino) => {
        const card = document.createElement("destino-card");

        card.setAttribute(
          "destino-id",
          destino.nombre.toLowerCase().replace(/\s+/g, "-")
        );
        card.setAttribute("nombre",   destino.nombre);
        card.setAttribute("region",   region.nombre);
        card.setAttribute("historia", destino.historia);
        card.setAttribute("imagen",   destino.media?.imagenes?.[0] ?? "");

        bloque.appendChild(card);
      });

      contenedor.appendChild(bloque);
    });
  }
}

customElements.define("destino-list", DestinoList);