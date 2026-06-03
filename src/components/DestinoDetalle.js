import "./GaleriaImagenes.js";
import "./AudioGuia.js";
import "./VideoDestino.js";

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
      Caribe: "caribe",
      "Valle Central": "valle-central",
      "Pacífico Central y Sur": "pacifico-sur",
    };
    return mapa[region] ?? "valle-central";
  }

  _buscarDestino(regiones, destinoId) {
    for (const region of regiones) {
      const destino = region.destinos.find(
        (item) => item.nombre.toLowerCase() === destinoId.toLowerCase(),
      );
      if (destino) return { region, destino };
    }
    return null;
  }

  _listaHTML(items) {
    if (!items || items.length === 0)
      return `<p class="texto-vacio">No hay información disponible.</p>`;
    return `
      <ul class="detalle-lista">
        ${items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
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
            <p>No se encontró información para "${destinoId}".</p>
          </section>
        `;
        return;
      }

      const { region, destino } = resultado;
      const cls = this._claseRegion(region.nombre);
      const imagenes = destino.media?.imagenes ?? [];
      const video = destino.media?.video ?? "";
      const audio = destino.media?.audio ?? "";
      const vertical = destino.media?.video_vertical ?? false;
      const portada = imagenes[0] ?? "";

      const imagenHTML = portada
        ? `<img class="detalle-img" src="${portada}" alt="Imagen de ${destino.nombre}" loading="lazy" />`
        : `<div class="detalle-placeholder" role="img" aria-label="Imagen de ${destino.nombre}">
             <svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
               <rect width="220" height="140" fill="#e8dfd4"/>
               <line x1="0" y1="0" x2="220" y2="140" stroke="#aaa" stroke-width="1.5"/>
               <line x1="220" y1="0" x2="0" y2="140" stroke="#aaa" stroke-width="1.5"/>
             </svg>
           </div>`;

      const imagenesJSON = JSON.stringify(imagenes).replace(/'/g, "&#39;");

      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <article class="detalle">
          <section class="detalle-info">
            <div class="detalle-identidad">
              <h3>Destino detalle</h3>
              <div class="detalle-media">${imagenHTML}</div>
              <div>
                <p class="detalle-nombre">${destino.nombre}</p>
                <p class="detalle-region-texto">${region.nombre}</p>
              </div>
            </div>

            <div class="detalle-texto">
              <h3>Descripción</h3>
              <p>${destino.historia}</p>
            </div>

            <div class="detalle-video-wrap">
              <h3>Video</h3>
              <video-destino
                src="${video}">
              </video-destino>
            </div>
          </section>

          <section class="detalle-grid">
            <div class="detalle-bloque">
              <h3>Actividades</h3>
              ${this._listaHTML(destino.experiencias)}
            </div>

            <div class="detalle-bloque galeria-bloque">
              <h3>Galería de imágenes</h3>
              <galeria-imagenes
                imagenes='${imagenesJSON}'
                auto
                intervalo="3800"
                style="--gi-aspect: 4 / 3">
              </galeria-imagenes>
            </div>

            <div class="detalle-bloque audio-wrap">
              <h3>Audio guía</h3>
              <audio-guia
                src="${audio}"
                label="Audio guía — ${destino.nombre}">
              </audio-guia>
            </div>
          </section>
        </article>
      `;
    } catch {
      const css2 = await fetch("./css/destino-detalle.css")
        .then((r) => r.text())
        .catch(() => "");
      this.shadowRoot.innerHTML = `
        <style>${css2}</style>
        <section class="detalle-mensaje error">
          <h2>Error al cargar destino</h2>
          <p>No se pudo cargar la información desde el archivo JSON.</p>
        </section>
      `;
    }
  }
}

customElements.define("destino-detalle", DestinoDetalle);
