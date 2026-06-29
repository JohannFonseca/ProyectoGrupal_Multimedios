import "./GaleriaImagenes.js";
import "./AudioGuia.js";
import "./VideoDestino.js";

const cssDestinoDetalle = fetch("./css/destino-detalle.css")
  .then((r) => (r.ok ? r.text() : ""))
  .catch(() => "");

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

  _temaRegion(region) {
    const temas = {
      "Pacífico Norte": {
        color: "#d9573b",
        suave: "rgba(217, 87, 59, 0.16)",
      },
      Caribe: {
        color: "#138a63",
        suave: "rgba(19, 138, 99, 0.16)",
      },
      "Valle Central": {
        color: "#5e7f3a",
        suave: "rgba(94, 127, 58, 0.16)",
      },
      "Pacífico Central y Sur": {
        color: "#1687a7",
        suave: "rgba(22, 135, 167, 0.16)",
      },
    };

    return temas[region] ?? {
      color: "#1687a7",
      suave: "rgba(22, 135, 167, 0.16)",
    };
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
    const css = await cssDestinoDetalle;
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
      const restaurante = destino.restaurantes?.join(" · ") ?? "";
      const tema = this._temaRegion(destino.region);

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

        <article
          class="detalle"
          style="--detalle-accent: ${tema.color}; --detalle-accent-soft: ${tema.suave};">
          <section class="detalle-header">
            <div class="detalle-media">${imagenHTML}</div>

            <div class="detalle-identidad">
              <p class="detalle-region-texto">${destino.region}</p>
              <h2 class="detalle-nombre">${destino.nombre}</h2>
              ${
                restaurante
                  ? `<p class="detalle-subtitulo">${restaurante}</p>`
                  : ""
              }
            </div>
          </section>

          <section class="detalle-texto">
            <h3><span aria-hidden="true">✦</span> Descripción</h3>
            <p>${descripcion}</p>
          </section>

          <section class="detalle-grid">
            <div class="detalle-multimedia">
              <div class="detalle-video-wrap">
                <h3><span aria-hidden="true">▶</span> Video del destino</h3>
                <video-destino
                  src="${video}"
                  poster="${portada}">
                </video-destino>
              </div>

              <div class="detalle-bloque audio-wrap">
                <h3><span aria-hidden="true">♪</span> Audio guía</h3>
                <audio-guia
                  src="${audio}"
                  label="Audio guía — ${destino.nombre}">
                </audio-guia>
              </div>
            </div>

            <div class="detalle-bloque galeria-bloque">
              <h3><span aria-hidden="true">▣</span> Galería de imágenes</h3>
              <galeria-imagenes
                imagenes='${imagenesJSON}'
                auto
                intervalo="3800"
                style="--gi-aspect: 4 / 3">
              </galeria-imagenes>
            </div>

            <div class="detalle-bloque actividades">
              <h3><span aria-hidden="true">⌖</span> Actividades</h3>
              ${this._listaHTML(actividades)}
            </div>
          </section>
        </article>
      `;
    } catch {
      this.shadowRoot.innerHTML = `
        <style>${css}</style>
        <section class="detalle-mensaje error">
          <h2>Error al cargar destino</h2>
          <p>No se pudo mostrar la información del destino.</p>
        </section>
      `;
    }
  }
}

customElements.define("destino-detalle", DestinoDetalle);
