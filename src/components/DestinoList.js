import "./DestinoCard.js";

class DestinoList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._datos        = null;
    this._regionActiva = null;
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
      <div id="contenedor"></div>
    `;
  }

  async _cargarDatos() {
    try {
      const respuesta = await fetch("./data/destinos.json");
      this._datos     = await respuesta.json();
    } catch (err) {
      const c = this.shadowRoot.querySelector("#contenedor");
      c.innerHTML = `<p class="error">Error al cargar los destinos.</p>`;
      console.error("DestinoList: error →", err);
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

  _crearCarrusel(imagenes, nombreRegion) {
    const wrapper = document.createElement("div");
    wrapper.className = "carrusel-wrapper";

    const area = document.createElement("div");
    area.className = "carrusel-imagen";

    if (imagenes && imagenes.length > 0) {
      let indice = 0;

      const img = document.createElement("img");
      img.src = imagenes[0];
      img.alt = `Imagen de ${nombreRegion}`;
      area.appendChild(img);

      if (imagenes.length > 1) {
        const btnPrev = document.createElement("button");
        btnPrev.className = "carrusel-btn prev";
        btnPrev.setAttribute("aria-label", "Imagen anterior");
        btnPrev.textContent = "‹";

        const btnNext = document.createElement("button");
        btnNext.className = "carrusel-btn next";
        btnNext.setAttribute("aria-label", "Imagen siguiente");
        btnNext.textContent = "›";

        btnPrev.addEventListener("click", () => {
          indice = (indice - 1 + imagenes.length) % imagenes.length;
          img.src = imagenes[indice];
        });

        btnNext.addEventListener("click", () => {
          indice = (indice + 1) % imagenes.length;
          img.src = imagenes[indice];
        });

        area.appendChild(btnPrev);
        area.appendChild(btnNext);
      }
    } else {
      area.innerHTML = `
        <svg viewBox="0 0 1200 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="1200" height="320" fill="#e8dfd4"/>
          <line x1="0" y1="0" x2="1200" y2="320" stroke="#aaa" stroke-width="1.5"/>
          <line x1="1200" y1="0" x2="0" y2="320" stroke="#aaa" stroke-width="1.5"/>
        </svg>
      `;
    }

    const label = document.createElement("div");
    label.className = "carrusel-titulo";
    label.textContent = "Carrucel de imagenes";

    wrapper.appendChild(area);
    wrapper.appendChild(label);
    return wrapper;
  }

  _pintarDestinos() {
    if (!this._datos) return;

    const contenedor = this.shadowRoot.querySelector("#contenedor");
    contenedor.innerHTML = "";

    const nombreActivo = this._slugANombre(this._regionActiva);

    if (!nombreActivo) return;

    const regiones = this._datos.regiones.filter(
      (r) => r.nombre === nombreActivo
    );

    regiones.forEach((region) => {
      const bloque = document.createElement("div");
      bloque.className = "region-block";

      const todasImagenes = region.destinos.flatMap(
        (d) => d.media?.imagenes ?? []
      );
      bloque.appendChild(this._crearCarrusel(todasImagenes, region.nombre));

      const aboutRow = document.createElement("div");
      aboutRow.className = "about-row";
      aboutRow.innerHTML = `
        <p class="about-label">About</p>
        <p class="about-texto">${region.descripcion}</p>
      `;
      bloque.appendChild(aboutRow);

      const titulo = document.createElement("h2");
      titulo.className = "section-title";
      titulo.textContent = "Destinos a conocer";
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