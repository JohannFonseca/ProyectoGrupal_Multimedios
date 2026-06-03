import "./GaleriaImagenes.js";

class SobreNosotros extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
      const css = await fetch("./css/sobre-nosotros.css").then((r) => r.text());
      const imagenes = await this._todasLasImagenes();
      const imagenesJSON = JSON.stringify(imagenes).replace(/'/g, "&#39;");

      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <div class="hero-carousel">
          <galeria-imagenes
            imagenes='${imagenesJSON}'
            auto
            intervalo="4500"
            style="--gi-aspect: 16 / 4">
          </galeria-imagenes>

          <div class="hero-overlay">
            <img
              class="hero-logo"
              src="./assets/images/LogoRutaDelSabor.png"
              alt="Logo Ruta del Sabor"
            />
            <h1 class="hero-title">Sobre Nosotros</h1>
          </div>
        </div>

        <section class="intro-section">
          <h2 class="section-title">Sobre Nosotros</h2>
          <p class="intro-text">
            Somos un grupo de estudiantes de la Universidad de Costa Rica, cursando la materia de <strong>Multimedios</strong> en el primer semestre de nuestro cuarto año. Este proyecto, titulado <strong>La Ruta del Sabor</strong>, tiene como objetivo explorar la gastronomía local, los destinos más representativos y la riqueza cultural de las distintas regiones de Costa Rica a través de una experiencia interactiva y moderna.
          </p>
        </section>

        <section class="grid-container">
          <!-- Dariel Benavides Tapia -->
          <article class="card">
            <div class="avatar dariel">DB</div>
            <h3 class="member-name">Dariel Benavides Tapia</h3>
            <span class="member-role">Desarrollo Frontend &amp; Integración SVG</span>
            <p class="member-desc">
              JSON con 3+ destinos, Rediseño del mapa, Tarea Propuesta Temática con Sofía, Definición de Regiones y Destinos con Sofía, Guion de Navegación con Eddy.
            </p>
            <div class="social-links">
              <a href="https://linkedin.com" class="social-icon" target="_blank" aria-label="LinkedIn de Dariel">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
          </article>

          <!-- Eddy Josué González Quirós -->
          <article class="card">
            <div class="avatar eddy">EG</div>
            <h3 class="member-name">Eddy Josué González Quirós</h3>
            <span class="member-role">Interactividad &amp; Animaciones</span>
            <p class="member-desc">
              Wireframes (Planimetría) con Daniel, Guion de Navegación con Dariel, Diagrama de Componentes y Descripción de Custom Events entre componentes con Johann, Destino-detalle.
            </p>
            <div class="social-links">
              <a href="https://linkedin.com" class="social-icon" target="_blank" aria-label="LinkedIn de Eddy">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
          </article>

          <!-- Sofia Salazar Mata -->
          <article class="card">
            <div class="avatar sofia">SS</div>
            <h3 class="member-name">Sofia Salazar Mata</h3>
            <span class="member-role">Diseño UI/UX &amp; Estilos</span>
            <p class="member-desc">
              Propuesta Temática con Dariel, Definición de Regiones y Destinos con Dariel, Storyboards con Daniel, Decisiones de diseño, Creación de audio para cada destino, Video-destino y Galería de imágenes.
            </p>
            <div class="social-links">
              <a href="https://www.linkedin.com/in/sofia-salazar-mata-0063771b7?utm_source=share_via&utm_content=profile&utm_medium=member_ios" class="social-icon" target="_blank" aria-label="LinkedIn de Sofia">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
          </article>

          <!-- José Daniel Solís Cordoncillo -->
          <article class="card">
            <div class="avatar jose">JS</div>
            <h3 class="member-name">José Daniel Solís Cordoncillo</h3>
            <span class="member-role">Lógica de Datos &amp; Destinos</span>
            <p class="member-desc">
              Wireframes (Planimetría) con Eddy, Storyboards con Sofía, Destino-card.
            </p>
            <div class="social-links">
              <a href="https://linkedin.com" class="social-icon" target="_blank" aria-label="LinkedIn de José Daniel">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
          </article>

          <!-- Johann Fonseca Espinoza -->
          <article class="card">
            <div class="avatar johan">JF</div>
            <h3 class="member-name">Johann Fonseca Espinoza</h3>
            <span class="member-role">Componentes &amp; Estructura de Datos</span>
            <p class="member-desc">
              Archivo destinos.json (Estructura de Datos), Estructura de Archivos (Diagrama de Componentes y Descripción de Custom Events entre componentes con Eddy), Repositorio en Git.
            </p>
            <div class="social-links">
              <a href="https://www.linkedin.com/in/johann-fonseca-0a89a4323/" class="social-icon" target="_blank" aria-label="LinkedIn de Johann">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                </svg>
              </a>
            </div>
          </article>
        </section>
      `;
    } catch (err) {
      console.error("SobreNosotros:", err);
      this.shadowRoot.innerHTML = `<p>Error al cargar la sección.</p>`;
    }
  }
}

customElements.define("sobre-nosotros", SobreNosotros);
