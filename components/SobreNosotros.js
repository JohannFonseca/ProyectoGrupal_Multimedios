import "./GaleriaImagenes.js";

/**
 * Componente Web "Sobre Nosotros"
 * ------------------------------
 * Define el elemento <sobre-nosotros> que presenta al equipo de estudiantes
 * de la UCR encargados de la creación de la "Ruta del Sabor".
 */
class SobreNosotros extends HTMLElement {
  constructor() {
    super();
    // Inicia el Shadow DOM para encapsulación
    this.attachShadow({ mode: "open" });
  }

  // Se ejecuta al añadir el componente a la página
  async connectedCallback() {
    await this._render();
  }

  /**
   * Carga dinámicamente y mezcla fotos aleatorias de destinos.json 
   * para colocarlas en el carrusel de la cabecera.
   */
  async _todasLasImagenes() {
    try {
      // Petición HTTP asíncrona para leer el archivo de destinos en formato JSON
      const resp = await fetch("./data/destinos.json");
      const datos = await resp.json();
      
      // Aplana el arreglo de destinos para extraer todas las rutas de imágenes disponibles
      const imgs = datos.regiones.flatMap((r) =>
        r.destinos.flatMap((d) => d.galeria ?? d.media?.imagenes ?? [])
      );
      
      // Baraja el arreglo de fotos al azar y toma las primeras 24
      return imgs.sort(() => Math.random() - 0.5).slice(0, 24);
    } catch {
      return []; // Respaldo en caso de error
    }
  }

  /**
   * Renderiza el contenido HTML y CSS de la sección
   */
  async _render() {
    try {
      // Obtiene en paralelo el archivo CSS de estilos y la lista de fotos mezcladas
      const css = await fetch("./css/sobre-nosotros.css").then((r) => r.text());
      const imagenes = await this._todasLasImagenes();
      const imagenesJSON = JSON.stringify(imagenes).replace(/'/g, "&#39;");

      // Inyecta el marcado estructurado en el Shadow DOM
      this.shadowRoot.innerHTML = `
        <style>${css}</style>

        <!-- Carrusel de fotos aleatorias superior -->
        <div class="hero-carousel">
          <galeria-imagenes
            imagenes='${imagenesJSON}'
            auto
            intervalo="4500"
            style="--gi-aspect: 16 / 3.4">
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

        <!-- Introducción de la sección académica -->
        <section class="intro-section">
          <p class="intro-eyebrow">Equipo del proyecto</p>
          <p class="intro-text">
            Somos un grupo de estudiantes de la Universidad de Costa Rica, cursando la materia de <strong>Multimedios</strong> en el primer semestre de nuestro cuarto año. Este proyecto, titulado <strong>La Ruta del Sabor</strong>, tiene como objetivo explorar la gastronomía local, los destinos más representativos y la riqueza cultural de las distintas regiones de Costa Rica a través de una experiencia interactiva y moderna.
          </p>
        </section>

        <!-- Tarjetas de presentación de los estudiantes -->
        <section class="grid-container">
          <!-- Dariel Benavides Tapia -->
          <article class="card">
            <div class="avatar dariel">DB</div>
            <h3 class="member-name">Dariel Benavides Tapia</h3>
            <span class="member-role">Desarrollador de componentes de navegación</span>
            <p class="member-desc">
              Construcción de la navegación principal, menú de regiones y flujo de eventos de selección.
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
            <span class="member-role">Desarrollador de componentes de destino</span>
            <p class="member-desc">
              Desarrollo de tarjetas, vistas de detalle y presentación visual de la información de cada destino.
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
            <span class="member-role">Diseño UI/UX & Productor Multimedia</span>
            <p class="member-desc">
              Diseño de experiencia, selección visual y preparación de recursos multimedia para la guía.
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
            <span class="member-role">Lider & Desarrollador de Componentes</span>
            <p class="member-desc">
              Coordinación de arquitectura, integración de componentes y revisión del comportamiento general.
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
            <span class="member-role">Desarrollador de Componentes & Estructura de Datos</span>
            <p class="member-desc">
              Organización del JSON de destinos, soporte de datos y componentes reutilizables de la aplicación.
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
