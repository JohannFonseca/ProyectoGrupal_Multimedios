class DestinoDetalle extends HTMLElement {
  static get observedAttributes() {
    return ["destino-id"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._render();
  }

  attributeChangedCallback(_name, oldVal, newVal) {
    if (oldVal !== newVal) this._render();
  }

  _claseRegion(region) {
    const mapa = {
      "Pacífico Norte": "pacifico-norte",
      "Caribe": "caribe",
      "Valle Central": "valle-central",
      "Pacífico Central y Sur": "pacifico-sur",
    };

    return mapa[region] ?? "valle-central";
  }

  _buscarDestino(regiones, destinoId) {
    for (const region of regiones) {
      const destino = region.destinos.find(
        (item) => item.nombre.toLowerCase() === destinoId.toLowerCase()
      );

      if (destino) {
        return { region, destino };
      }
    }

    return null;
  }

  _crearLista(items) {
    if (!items || items.length === 0) {
      return `<p class="texto-vacio">No hay información disponible.</p>`;
    }

    return `
      <ul class="detalle-lista">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
  }

  _crearGaleria(imagenes, nombre) {
    if (!imagenes || imagenes.length === 0) {
      return `
        <div class="galeria-placeholder" role="img" aria-label="Galería sin imágenes de ${nombre}">
          <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <rect width="240" height="160" fill="#e8dfd4"/>
            <line x1="0" y1="0" x2="240" y2="160" stroke="#aaa" stroke-width="1.5"/>
            <line x1="240" y1="0" x2="0" y2="160" stroke="#aaa" stroke-width="1.5"/>
          </svg>
          <p>No hay imágenes disponibles.</p>
        </div>
      `;
    }

    return `
      <div class="galeria-grid">
        ${imagenes
          .map(
            (imagen) => `
              <img src="${imagen}" alt="Imagen de ${nombre}" loading="lazy" />
            `
          )
          .join("")}
      </div>
    `;
  }

  _crearVideo(video, nombre) {
    if (video) {
      return `
        <video class="detalle-video" controls preload="metadata">
          <source src="${video}" type="video/mp4" />
          Su navegador no soporta video HTML5.
        </video>
      `;
    }

    return `
      <div class="video-placeholder" role="img" aria-label="Video no disponible de ${nombre}">
        <svg viewBox="0 0 240 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect width="240" height="140" fill="#ffffff"/>
          <polygon points="95,42 95,98 145,70" fill="none" stroke="#888" stroke-width="3"/>
        </svg>
      </div>
    `;
  }

  _crearAudio(audio) {
    if (audio) {
      return `
        <audio class="detalle-audio" controls>
          <source src="${audio}" type="audio/mpeg" />
          Su navegador no soporta audio HTML5.
        </audio>
      `;
    }

    return `
      <div class="audio-placeholder" aria-label="Audio guia no disponible">
        <span class="audio-play"></span>
        <span class="audio-line"></span>
      </div>
    `;
  }

  async _render() {
    const css = await fetch("./css/destino-detalle.css").then((r) => r.text());
    const destinoId = this.getAttribute("destino-id") ?? "";

    if (!destinoId) {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <section class="detalle-mensaje">
          <h2>Destino no seleccionado</h2>
          <p>Seleccione un destino para ver su información detallada.</p>
        </section>
      `;
      return;
    }

    try {
      const respuesta = await fetch("./data/destinos.json");
      const datos = await respuesta.json();
      const resultado = this._buscarDestino(datos.regiones, destinoId);

      if (!resultado) {
        this.shadowRoot.innerHTML = `
          <style>${css}</style>

          <section class="detalle-mensaje">
            <h2>Destino no encontrado</h2>
            <p>No se encontró información para el destino ${destinoId}.</p>
          </section>
        `;
        return;
      }

      const { region, destino } = resultado;
      const cls = this._claseRegion(region.nombre);
      const imagenPrincipal = destino.media?.imagenes?.[0] ?? "";
      const video = destino.media?.video ?? "";
      const audio = destino.media?.audio ?? "";

      const imagenHTML = imagenPrincipal
        ? `<img class="detalle-img" src="${imagenPrincipal}" alt="Imagen de ${destino.nombre}" loading="lazy" />`
        : `<div class="detalle-placeholder" role="img" aria-label="Imagen de ${destino.nombre}">
             <svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
               <rect width="220" height="140" fill="#e8dfd4"/>
               <line x1="0" y1="0" x2="220" y2="140" stroke="#aaa" stroke-width="1.5"/>
               <line x1="220" y1="0" x2="0" y2="140" stroke="#aaa" stroke-width="1.5"/>
             </svg>
           </div>`;

      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <article class="detalle">
          <section class="detalle-info">
            <div class="detalle-identidad">
              <h3>Destino detalle</h3>
              <div class="detalle-media">
                ${imagenHTML}
              </div>
              <p class="detalle-nombre">${destino.nombre}</p>
              <p class="detalle-region-texto">${region.nombre}</p>
            </div>

            <div class="detalle-texto">
              <h3>Descripcion</h3>
              <p>${destino.historia}</p>
            </div>

            <div class="detalle-video-wrap">
              <h3>Video</h3>
              ${this._crearVideo(video, destino.nombre)}
            </div>
          </section>

          <section class="detalle-grid">
            <div class="detalle-bloque">
              <h3>Actividades</h3>
              ${this._crearLista(destino.experiencias)}
            </div>

            <div class="detalle-bloque galeria-bloque">
              <h3>Galeria de imagenes</h3>
              ${this._crearGaleria(destino.media?.imagenes, destino.nombre)}
            </div>

            <div class="detalle-bloque audio-guia">
              <h3>Audio guia</h3>
              ${this._crearAudio(audio)}
              <p>${destino.historia}</p>
            </div>
          </section>
        </article>
      `;
    } catch {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <section class="detalle-mensaje error">
          <h2>Error al cargar destino</h2>
          <p>No se pudo cargar la información desde el archivo JSON.</p>
        </section>
      `;
    }
  }
}

customElements.define("destino-detalle", DestinoDetalle);
