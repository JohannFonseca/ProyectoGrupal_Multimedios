import "./GaleriaImagenes.js";

class ContactoSeccion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._directorio = [  
      {
        nombre: "Mercado Municipal de Liberia",
        region: "pacifico-norte",
        regionLabel: "Pacífico Norte",
        telefono: "+506 2666-0101",
        ubicacion:
          "Av. 2, Calle 4, frente al Parque Central, Liberia, Guanacaste.",
      },
      {
        nombre: "La Tortillería Nicoya",
        region: "pacifico-norte",
        regionLabel: "Pacífico Norte",
        telefono: "+506 2685-4040",
        ubicacion:
          "100 metros Este de la Iglesia Colonial de Nicoya, Guanacaste.",
      },
      {
        nombre: "Tamara Restaurant",
        region: "caribe",
        regionLabel: "Caribe",
        telefono: "+506 2750-0111",
        ubicacion:
          "Calle Principal, frente a la playa, Puerto Viejo, Talamanca, Limón.",
      },
      {
        nombre: "Delritta Patty",
        region: "caribe",
        regionLabel: "Caribe",
        telefono: "+506 2755-0220",
        ubicacion: "Costado Oeste del Parque Nacional de Cahuita, Limón.",
      },
      {
        nombre: "Britt Coffee Tour",
        region: "valle-central",
        regionLabel: "Valle Central",
        telefono: "+506 2277-1600",
        ubicacion: "Paso Llano, Barva de Heredia (Camino al Volcán Barva).",
      },
      {
        nombre: "Restaurante Mi Tierra",
        region: "valle-central",
        regionLabel: "Valle Central",
        telefono: "+506 2551-0303",
        ubicacion: "Costado Sur de las Ruinas de Cartago, Cartago centro.",
      },
      {
        nombre: "El Avión",
        region: "pacifico-central",
        regionLabel: "Pacífico Central/Sur",
        telefono: "+506 2777-3377",
        ubicacion:
          "Carretera Principal a Manuel Antonio, Km 4, Quepos, Puntarenas.",
      },
      {
        nombre: "La Leda",
        region: "pacifico-central",
        regionLabel: "Pacífico Central/Sur",
        telefono: "+506 2743-8080",
        ubicacion:
          "Entrada principal a Playa Uvita, Bahía Ballena, Osa, Puntarenas.",
      },
    ];
  }

  async connectedCallback() {
    await this._render();
  }

  async _todasLasImagenes() {
    try {
      const resp = await fetch("./data/destinos.json");
      const datos = await resp.json();
      const imgs = datos.regiones.flatMap((r) =>
        r.destinos.flatMap((d) => d.media?.imagenes ?? []),
      );
      return imgs.sort(() => Math.random() - 0.5).slice(0, 24);
    } catch {
      return [];
    }
  }

  async _render() {
    try {
      const [css, imagenes] = await Promise.all([
        fetch("./css/contacto.css").then((r) => r.text()),
        this._todasLasImagenes(),
      ]);
      const imagenesJSON = JSON.stringify(imagenes).replace(/'/g, "&#39;");

      // Construir las tarjetas del directorio dinámicamente
      const directorioHTML = this._directorio
        .map(
          (dest) => `
        <article class="dir-card ${dest.region}">
          <div class="dir-header">
            <h4 class="dir-place">${dest.nombre}</h4>
            <span class="dir-region-badge ${dest.region}">${dest.regionLabel}</span>
          </div>
          
          <div class="dir-info-row">
            <div class="dir-icon-wrapper">
              <svg class="dir-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
            <div>
              <span class="dir-label">Teléfono</span> 
              <br/>
              <a href="tel:${dest.telefono.replace(/\s+/g, "")}" class="tel-link">${dest.telefono}</a>
            </div>
          </div>

          <div class="dir-info-row">
            <div class="dir-icon-wrapper">
              <svg class="dir-icon" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <span class="dir-label">Ubicación</span> 
              <br/>
              <span>${dest.ubicacion}</span>
            </div>
          </div>

          <div class="dir-action">
            <a href="tel:${dest.telefono.replace(/\s+/g, "")}" class="btn-call">
              <svg width="14" height="14" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.04 15.04 0 01-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02A11.36 11.36 0 018.5 4c0-.56-.44-1-1-1H4c-.56 0-1 .44-1 1 0 9.39 7.61 17 17 17 .56 0 1-.44 1-1v-3.5c0-.56-.44-1-1-1z"/>
              </svg>
              Llamar Destino
            </a>
          </div>
        </article>
      `,
        )
        .join("");

      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <galeria-imagenes
          imagenes='${imagenesJSON}'
          auto
          intervalo="4500"
          style="--gi-aspect: 16 / 4">
        </galeria-imagenes>

        <section class="intro-section">
          <h2 class="section-title">Contacto y Directorio</h2>
          <p class="intro-text">
            ¿Tienes alguna consulta o deseas contactar directamente a los destinos gastronómicos de la <strong>Ruta del Sabor</strong>? Aquí tienes el directorio telefónico y ubicaciones oficiales de cada destino.
          </p>
        </section>

        <div class="contact-layout">
          <!-- Directorio -->
          <section class="directory-container">
            <h3 class="directory-title">
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
              </svg>
              Directorio Gastronómico
            </h3>
            
            <div class="directory-grid">
              ${directorioHTML}
            </div>
          </section>
        </div>
      `;
    } catch (err) {
      console.error("Error al renderizar sección de Contacto:", err);
      this.shadowRoot.innerHTML = `<p>Error al cargar la sección de contacto</p>`;
    }
  }
}

customElements.define("contacto-seccion", ContactoSeccion);
