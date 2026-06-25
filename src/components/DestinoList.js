import "./DestinoCard.js";
import "./DestinoDetalle.js";
import "./GaleriaImagenes.js";

class DestinoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._datos = null;
    this._regionActiva = null;
    this._handleRegionSelected = (e) => {
      this._regionActiva = e.detail.region;
      this._pintarDestinos();
    };
    this._handleDestinoSelected = (e) => {
      e.stopPropagation();
      this._pintarDetalle(e.detail.id);
    };
  }

  async connectedCallback() {
    document.addEventListener("region-selected", this._handleRegionSelected);
    this.shadowRoot.addEventListener(
      "destino-selected",
      this._handleDestinoSelected,
    );

    await this._renderEstructura();
    await this._cargarDatos();
  }

  disconnectedCallback() {
    document.removeEventListener(
      "region-selected",
      this._handleRegionSelected,
    );
    this.shadowRoot.removeEventListener(
      "destino-selected",
      this._handleDestinoSelected,
    );
  }

  async _renderEstructura() {
    const css = await fetch("./css/destino-list.css").then((r) => r.text());
    this.shadowRoot.innerHTML = `
      <style>${css}</style>
      <div id="contenedor"></div>
    `;
  }

  async _cargarDatos() {
    try {
      const respuesta = await fetch("./data/destinos.json");
      this._datos = await respuesta.json();
    } catch (err) {
      const c = this.shadowRoot.querySelector("#contenedor");
      if (c) c.innerHTML = `<p class="error">Error al cargar los destinos.</p>`;
      console.error("DestinoList:", err);
    }
  }

  _slugANombre(slug) {
    const mapa = {
      "pacifico-norte": "Pacífico Norte",
      caribe: "Caribe",
      "valle-central": "Valle Central",
      "pacifico-central": "Pacífico Central y Sur",
    };
    return mapa[slug] ?? null;
  }

  _pintarDetalle(destinoId) {
    const bloque = this.shadowRoot.querySelector(".region-block");
    const titulo = bloque?.querySelector(".section-title");
    const contenido = bloque?.querySelector(".contenido-region");

    if (!bloque || !contenido) return;

    const destino = this._datos?.regiones
      .flatMap((region) => region.destinos)
      .find((item) => item.id === destinoId);

    if (!destino) {
      console.error(`No se encontró el destino con ID "${destinoId}".`);
      return;
    }

    if (titulo) titulo.remove();
    contenido.innerHTML = "";

    const detalle = document.createElement("destino-detalle");
    detalle.destino = destino;
    contenido.appendChild(detalle);

    bloque.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  _pintarDestinos() {
    if (!this._datos) return;

    const contenedor = this.shadowRoot.querySelector("#contenedor");
    contenedor.innerHTML = "";

    const nombreActivo = this._slugANombre(this._regionActiva);
    if (!nombreActivo) return;

    const regiones = this._datos.regiones.filter(
      (r) => r.nombre === nombreActivo,
    );

    regiones.forEach((region) => {
      const bloque = document.createElement("div");
      bloque.className = "region-block";

      const todasImagenes = region.destinos.flatMap(
        (d) => d.galeria ?? d.media?.imagenes ?? [],
      );
      const carrusel = document.createElement("galeria-imagenes");
      carrusel.setAttribute("imagenes", JSON.stringify(todasImagenes));
      carrusel.setAttribute("auto", "");
      carrusel.setAttribute("intervalo", "4000");
      bloque.appendChild(carrusel);

      const aboutRow = document.createElement("div");
      aboutRow.className = "about-row";
      aboutRow.innerHTML = `
        <p class="about-label">Acerca de</p>
        <p class="about-texto">${region.descripcion}</p>
      `;
      bloque.appendChild(aboutRow);

      const titulo = document.createElement("h2");
      titulo.className = "section-title";
      titulo.textContent = "Destinos a conocer";
      bloque.appendChild(titulo);

      const contenido = document.createElement("div");
      contenido.className = "contenido-region";

      region.destinos.forEach((destino) => {
        const card = document.createElement("destino-card");
        card.setAttribute("destino-id", destino.id);
        card.setAttribute("nombre", destino.nombre);
        card.setAttribute("region", region.nombre);
        card.setAttribute("historia", destino.descripcion ?? destino.historia ?? "");
        card.setAttribute(
          "imagen",
          destino.imagen_portada ?? destino.galeria?.[0] ?? "",
        );
        contenido.appendChild(card);
      });

      bloque.appendChild(contenido);
      contenedor.appendChild(bloque);
    });
  }
}

customElements.define("destino-list", DestinoList);
