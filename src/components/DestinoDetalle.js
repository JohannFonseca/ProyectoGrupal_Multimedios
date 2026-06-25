import "./GaleriaImagenes.js";
import "./AudioGuia.js";
import "./VideoDestino.js";

class DestinoDetalle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._destino = null;
  }

  connectedCallback() {
    this._render();
  }

  set destino(valor) {
    this._destino = valor;
    if (this.isConnected) this._render();
  }

  get destino() {
    return this._destino;
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
    const destino = this._destino;

    if (!destino) {
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
      const galeria = destino.galeria ?? destino.media?.imagenes ?? [];
      const video = destino.video ?? destino.media?.video ?? "";
      const audio = destino.audio ?? destino.media?.audio ?? "";
      const descripcion = destino.descripcion ?? destino.historia ?? "";
      const actividades = destino.actividades ?? destino.experiencias ?? [];
      const portada = destino.imagen_portada ?? galeria[0] ?? "";

      const imagenHTML = portada
        ? `<img class="detalle-img" src="${portada}" alt="Imagen de ${destino.nombre}" loading="lazy" />`
        : `<div class="detalle-placeholder" role="img" aria-label="Imagen de ${destino.nombre}">
             <svg viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
               <rect width="220" height="140" fill="#e8dfd4"/>
               <line x1="0" y1="0" x2="220" y2="140" stroke="#aaa" stroke-width="1.5"/>
               <line x1="220" y1="0" x2="0" y2="140" stroke="#aaa" stroke-width="1.5"/>
             </svg>
           </div>`;

      const imagenesJSON = JSON.stringify(galeria).replace(/'/g, "&#39;");

      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <article class="detalle">
          <section class="detalle-info">
            <div class="detalle-identidad">
              <h3>Destino detalle</h3>
              <div class="detalle-media">${imagenHTML}</div>
              <div>
                <p class="detalle-nombre">${destino.nombre}</p>
                <p class="detalle-region-texto">${destino.region}</p>
              </div>
            </div>

            <div class="detalle-texto">
              <h3>Descripción</h3>
              <p>${descripcion}</p>
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
              ${this._listaHTML(actividades)}
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
          <p>No se pudo mostrar la información del destino.</p>
        </section>
      `;
    }
  }
}

customElements.define("destino-detalle", DestinoDetalle);
