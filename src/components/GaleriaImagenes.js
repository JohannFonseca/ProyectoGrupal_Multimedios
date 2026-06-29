// Galería de imágenes interactiva: carrusel autoejecutable con botones de navegación y visor modal a pantalla completa (Lightbox).
class GaleriaImagenes extends HTMLElement {
  static get observedAttributes() {
    return ["imagenes", "auto", "intervalo", "compacto"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._indice = 0;
    this._timer  = null;
    this._imgs   = [];
    this._onKeyDown = (e) => { if (e.key === "Escape") this._closeLightbox(); };
  }

  connectedCallback() {
    this._connected = true;
    this._render();
  }

  disconnectedCallback() {
    this._connected = false;
    clearInterval(this._timer);
    document.removeEventListener("keydown", this._onKeyDown);
  }

  attributeChangedCallback(_n, oldVal, newVal) {
    if (this._connected && oldVal !== newVal) this._render();
  }

  _parse() {
    try { return JSON.parse(this.getAttribute("imagenes") ?? "[]"); }
    catch { return []; }
  }

  _ir(delta) {
    if (this._imgs.length < 2) return;
    this._indice = (this._indice + delta + this._imgs.length) % this._imgs.length;
    this._sync();
  }

  _sync() {
    const img     = this.shadowRoot.querySelector(".gi-img");
    const counter = this.shadowRoot.querySelector(".gi-counter");
    const dots    = this.shadowRoot.querySelectorAll(".dot");

    if (img) {
      img.style.opacity = "0";
      setTimeout(() => {
        img.src = this._imgs[this._indice];
        img.alt = `Imagen ${this._indice + 1} del carrusel`;
        img.style.opacity = "1";
      }, 200);
    }
    if (counter) counter.textContent = `${this._indice + 1} / ${this._imgs.length}`;
    const activeDot = this.hasAttribute("compacto")
      ? Math.min(
          dots.length - 1,
          Math.floor((this._indice * dots.length) / this._imgs.length),
        )
      : this._indice;
    dots.forEach((dot, i) => {
      const isActive = i === activeDot;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  }

  _reiniciarTimer(ms) {
    clearInterval(this._timer);
    this._timer = setInterval(() => this._ir(1), ms);
  }

  _openLightbox() {
    const lb    = this.shadowRoot.querySelector(".gi-lightbox");
    const lbImg = this.shadowRoot.querySelector(".gi-lb-img");
    if (!lb || !lbImg || !this._imgs[this._indice]) return;

    lbImg.src = this._imgs[this._indice];
    lbImg.alt = `Imagen ${this._indice + 1} de ${this._imgs.length}`;
    lb.style.display = "flex";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", this._onKeyDown);
  }

  _closeLightbox() {
    const lb = this.shadowRoot.querySelector(".gi-lightbox");
    if (!lb) return;
    lb.style.display = "none";
    document.body.style.overflow = "";
    document.removeEventListener("keydown", this._onKeyDown);
  }

  _render() {
    clearInterval(this._timer);
    this._indice = 0;
    this._imgs   = this._parse();

    const multiple  = this._imgs.length > 1;
    const autoPlay  = this.hasAttribute("auto");
    const compacto  = this.hasAttribute("compacto");
    const intervalo = parseInt(this.getAttribute("intervalo") ?? "4500", 10);
    const primera   = this._imgs[0] ?? "";
    const cantidadPuntos = compacto
      ? Math.min(5, this._imgs.length)
      : this._imgs.length;
    const indicesPuntos = Array.from({ length: cantidadPuntos }, (_, i) =>
      cantidadPuntos === 1
        ? 0
        : Math.round((i * (this._imgs.length - 1)) / (cantidadPuntos - 1)),
    );

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }

        .gi-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: var(--gi-aspect, 16 / 6);
          min-height: 160px;
          border-radius: var(--gi-radius, 22px);
          overflow: hidden;
          background: #d9cfc5;
        }

        .gi-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          border-radius: inherit;
          transition: opacity 0.32s ease;
          cursor: zoom-in;
        }

        .gi-placeholder {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: #e8dfd4; color: #aaa;
          font-size: 0.88rem; font-family: sans-serif;
          border-radius: inherit;
        }

        .gi-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,.72); backdrop-filter: blur(3px);
          border: none; border-radius: 50%;
          width: 40px; height: 40px; font-size: 1.5rem; line-height: 1;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: background .2s; z-index: 2; color: #333;
          font-family: sans-serif;
        }
        .gi-btn:hover { background: rgba(255,255,255,.96); }
        .gi-btn:focus-visible { outline: 2px solid #8B6914; }
        .gi-btn.prev { left: 12px; }
        .gi-btn.next { right: 12px; }

        :host([compacto]) .gi-btn {
          background: rgba(20, 12, 8, 0.68);
          color: #fff8e7;
          border: 1px solid rgba(255, 248, 231, 0.42);
        }
        :host([compacto]) .gi-btn:hover {
          background: rgba(20, 12, 8, 0.88);
        }

        .gi-counter {
          position: absolute; bottom: 10px; right: 12px;
          background: rgba(0,0,0,.48); color: #fff;
          font-size: .7rem; padding: 2px 9px; border-radius: 10px;
          font-family: sans-serif; z-index: 2; user-select: none;
        }

        .gi-dots {
          display: flex; justify-content: center; align-items: center;
          gap: 7px; padding: 8px 0 2px;
        }
        .dot {
          width: 8px; height: 8px; border-radius: 50%;
          border: none; background: #ccc; cursor: pointer; padding: 0;
          transition: background .22s, transform .22s;
        }
        .dot.active { background: #8B6914; transform: scale(1.3); }
        .dot:focus-visible { outline: 2px solid #8B6914; }

        /* ── Lightbox ── */
        .gi-lightbox {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.92);
          cursor: pointer;
        }

        .gi-lb-inner {
          position: relative;
          cursor: default;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .gi-lb-img {
          max-width: 90vw;
          max-height: 84vh;
          object-fit: contain;
          display: block;
          border-radius: 6px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.6);
          user-select: none;
        }

        .gi-lb-close {
          position: absolute;
          top: -46px;
          right: 0;
          background: rgba(255, 255, 255, 0.15);
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          color: #fff;
          font-size: 1.1rem;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
          font-family: sans-serif;
          line-height: 1;
        }
        .gi-lb-close:hover { background: rgba(255, 255, 255, 0.28); }
        .gi-lb-close:focus-visible { outline: 2px solid #fff; }

        @media (max-width: 768px) {
          .gi-dots {
            display: none;
          }

          .gi-btn {
            width: 34px;
            height: 34px;
            font-size: 1.25rem;
            background: rgba(255, 255, 255, 0.62);
          }

          .gi-btn.prev { left: 8px; }
          .gi-btn.next { right: 8px; }

          .gi-counter {
            right: 10px;
            bottom: 8px;
            font-size: 0.66rem;
            padding: 2px 8px;
          }

          :host(#carrusel-inicio) .gi-btn {
            top: 50%;
            bottom: auto;
            transform: translateY(-50%);
            width: 38px;
            height: 38px;
            background: rgba(255, 248, 231, 0.78);
          }

          :host(#carrusel-inicio) .gi-counter {
            right: 12px;
            bottom: 14px;
          }
        }

        @media (max-width: 480px) {
          :host(#carrusel-inicio) .gi-btn {
            width: 34px;
            height: 34px;
            font-size: 1.12rem;
            background: rgba(255, 248, 231, 0.7);
          }

          :host(#carrusel-inicio) .gi-btn.prev { left: 12px; }
          :host(#carrusel-inicio) .gi-btn.next { right: 12px; }

          :host(#carrusel-inicio) .gi-counter {
            right: 10px;
            bottom: 10px;
            font-size: 0.6rem;
          }
        }
      </style>

      <div class="gi-wrap" role="region" aria-label="Carrusel de imágenes">
        ${primera
          ? `<img class="gi-img" src="${primera}" alt="Imagen 1 del carrusel" loading="lazy" />`
          : `<div class="gi-placeholder">Sin imágenes disponibles</div>`}
        ${multiple ? `
          <button class="gi-btn prev" aria-label="Imagen anterior">&#8249;</button>
          <button class="gi-btn next" aria-label="Imagen siguiente">&#8250;</button>
          <span class="gi-counter" aria-live="polite">1 / ${this._imgs.length}</span>
        ` : ""}
      </div>

      ${multiple ? `
        <div class="gi-dots" role="tablist" aria-label="Indicadores del carrusel">
          ${indicesPuntos.map((indice, i) =>
            `<button class="dot${i === 0 ? " active" : ""}" role="tab"
              data-index="${indice}"
              aria-label="Ir a imagen ${indice + 1}"
              aria-selected="${i === 0}"></button>`
          ).join("")}
        </div>
      ` : ""}

      <div class="gi-lightbox" role="dialog" aria-modal="true" aria-label="Imagen ampliada">
        <div class="gi-lb-inner">
          <button class="gi-lb-close" aria-label="Cerrar imagen">✕</button>
          <img class="gi-lb-img" src="" alt="Imagen ampliada" />
        </div>
      </div>
    `;

    if (!primera) return;

    /* — abrir lightbox al hacer click en imagen — */
    this.shadowRoot.querySelector(".gi-img")
      ?.addEventListener("click", () => this._openLightbox());

    /* — cerrar lightbox al click en fondo — */
    const lb = this.shadowRoot.querySelector(".gi-lightbox");
    lb?.addEventListener("click", (e) => {
      if (!e.target.closest(".gi-lb-inner")) this._closeLightbox();
    });

    /* — cerrar con botón X — */
    this.shadowRoot.querySelector(".gi-lb-close")
      ?.addEventListener("click", () => this._closeLightbox());

    if (!multiple) return;

    this.shadowRoot.querySelector(".prev")?.addEventListener("click", () => {
      this._ir(-1);
      if (autoPlay) this._reiniciarTimer(intervalo);
    });
    this.shadowRoot.querySelector(".next")?.addEventListener("click", () => {
      this._ir(1);
      if (autoPlay) this._reiniciarTimer(intervalo);
    });
    this.shadowRoot.querySelectorAll(".dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        this._indice = Number(dot.dataset.index);
        this._sync();
        if (autoPlay) this._reiniciarTimer(intervalo);
      });
    });

    if (autoPlay) this._reiniciarTimer(intervalo);
  }
}

customElements.define("galeria-imagenes", GaleriaImagenes);
