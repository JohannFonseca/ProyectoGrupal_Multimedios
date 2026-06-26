class VideoDestino extends HTMLElement {
  static get observedAttributes() {
    return ["src", "poster", "vertical"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this._connected = true;
    this._render();
  }

  disconnectedCallback() {
    this._connected = false;
  }

  attributeChangedCallback(_n, oldVal, newVal) {
    if (this._connected && oldVal !== newVal) this._render();
  }

  _esDrive(url) {
    return typeof url === "string" && url.includes("drive.google.com");
  }

  _embedUrl(url) {
    const m = url.match(/\/file\/d\/([^/?]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
    if (url.includes("/preview")) return url;
    return url;
  }

  _render() {
    const src = this.getAttribute("src") ?? "";
    const poster = this.getAttribute("poster") ?? "";
    const hasSrc = src.trim() !== "";
    const isDrive = hasSrc && this._esDrive(src);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }

        .vd-outer {
          display: flex;
          justify-content: center;
        }

        .vd-wrap {
          position: relative;
          width: 100%;
          max-width: 100%;
          aspect-ratio: 16 / 9;
          background: #111;
          border-radius: var(--vd-radius, 8px);
          overflow: hidden;
        }

        video,
        iframe {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          background: #000;
        }

        iframe {
          border: none;
        }

        .vd-placeholder {
          width: 100%; height: 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; gap: 12px;
          background: #f5f0ea;
          border-radius: var(--vd-radius, 8px);
        }

        .vd-icon {
          width: 52px; height: 52px; border-radius: 50%;
          border: 2px solid #ddd;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; color: #ccc;
        }

        .vd-txt {
          font-size: .82rem; color: #aaa;
          font-family: sans-serif; text-align: center;
        }

        @media (max-width: 768px) {
          .vd-wrap {
            max-height: 220px;
          }
        }
      </style>

      <div class="vd-outer">
        <div class="vd-wrap">
          ${
            !hasSrc
              ? `
            <div class="vd-placeholder">
              <div class="vd-icon">▶</div>
              <span class="vd-txt">Video no disponible</span>
            </div>
          `
              : isDrive
                ? `
            <iframe
              src="${this._embedUrl(src)}"
              allow="autoplay; encrypted-media; fullscreen"
              allowfullscreen
              title="Video del destino">
            </iframe>
          `
                : `
            <video controls preload="metadata" ${poster ? `poster="${poster}"` : ""}>
              <source src="${src}" type="video/mp4" />
              Su navegador no soporta video HTML5.
            </video>
          `
          }
        </div>
      </div>
    `;
  }
}

customElements.define("video-destino", VideoDestino);
