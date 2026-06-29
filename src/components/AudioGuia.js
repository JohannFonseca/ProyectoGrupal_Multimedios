class AudioGuia extends HTMLElement {
  static get observedAttributes() {
    return ["src", "label"];
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
    this.shadowRoot.querySelector("audio")?.pause();
  }

  attributeChangedCallback(_n, oldVal, newVal) {
    if (this._connected && oldVal !== newVal) this._render();
  }

  _fmt(s) {
    if (!isFinite(s) || s < 0) return "0:00";
    const m   = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  _render() {
    const src    = this.getAttribute("src")   ?? "";
    const label  = this.getAttribute("label") ?? "Audio guía";
    const hasSrc = src.trim() !== "";
    const audioSrc = hasSrc ? new URL(src, document.baseURI).href : "";

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }

        .ag-wrap {
          display: flex; flex-direction: column; gap: 10px;
          padding: var(--audio-padding, 14px 16px);
          background: var(--audio-background, #f5f0ea);
          border-radius: var(--audio-radius, 10px);
          border: var(
            --audio-border,
            1px solid var(--audio-accent-soft, #e0d4c0)
          );
        }

        .ag-label {
          font-size: .8rem; font-weight: 700; letter-spacing: .05em;
          text-transform: uppercase; color: var(--audio-label-color, #5a4720);
          font-family: var(--font-main, sans-serif);
          margin: 0;
        }

        .ag-row {
          display: flex; align-items: center; gap: 10px;
        }

        .ag-btn {
          flex-shrink: 0; width: 40px; height: 40px;
          border-radius: 50%; border: none; cursor: pointer;
          background: var(--audio-accent, #8B6914); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.05rem; transition: background .2s;
        }
        .ag-btn:hover:not(:disabled) {
          filter: brightness(0.86);
        }
        .ag-btn:disabled { background: #bbb; cursor: not-allowed; }
        .ag-btn:focus-visible {
          outline: 2px solid var(--audio-accent, #6e5210);
          outline-offset: 2px;
        }

        .ag-right {
          flex: 1; display: flex; flex-direction: column; gap: 6px;
          min-width: 0;
        }

        /* ── Seek bar completo con thumb visible ── */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(
            to right,
            var(--audio-accent, #8B6914) var(--pct, 0%),
            #d5c9b5 var(--pct, 0%)
          );
          cursor: pointer;
          outline: none;
        }

        /* Thumb — Chrome / Safari / Edge */
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--audio-accent, #8B6914);
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
          transition: transform .15s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.25);
        }

        /* Thumb — Firefox */
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--audio-accent, #8B6914);
          cursor: pointer;
          border: none;
          box-shadow: 0 1px 4px rgba(0,0,0,0.3);
        }

        /* Track — Firefox */
        input[type="range"]::-moz-range-track {
          height: 4px;
          border-radius: 2px;
          background: #d5c9b5;
        }
        input[type="range"]::-moz-range-progress {
          height: 4px;
          border-radius: 2px;
          background: var(--audio-accent, #8B6914);
        }

        input[type="range"]:focus-visible {
          outline: 2px solid var(--audio-accent, #8B6914);
          outline-offset: 3px;
        }

        .ag-tiempo {
          font-size: .68rem; color: var(--audio-time-color, #888); text-align: right;
          font-family: monospace;
        }

        .ag-placeholder {
          font-size: .83rem; color: #aaa; font-style: italic;
          font-family: sans-serif; margin: 0; padding: 4px 0;
        }

        audio { display: none; }
      </style>

      <div class="ag-wrap">
        <p class="ag-label">${label}</p>

        ${hasSrc ? `
          <audio src="${audioSrc}" preload="metadata"></audio>
          <div class="ag-row">
            <button class="ag-btn" id="ag-play" aria-label="Reproducir audio">▶</button>
            <div class="ag-right">
              <input type="range" id="ag-bar" min="0" max="100" value="0" step="0.1"
                     aria-label="Progreso del audio" />
              <span class="ag-tiempo" id="ag-time">0:00 / 0:00</span>
            </div>
          </div>
        ` : `
          <p class="ag-placeholder">Audio guía no disponible para este destino.</p>
        `}
      </div>
    `;

    if (!hasSrc) return;

    const audio  = this.shadowRoot.querySelector("audio");
    const btn    = this.shadowRoot.getElementById("ag-play");
    const bar    = this.shadowRoot.getElementById("ag-bar");
    const timeEl = this.shadowRoot.getElementById("ag-time");

    /* — helpers — */
    const setPlay  = () => { btn.textContent = "⏸"; btn.setAttribute("aria-label", "Pausar"); };
    const setPause = () => { btn.textContent = "▶"; btn.setAttribute("aria-label", "Reproducir audio"); };

    const updateBar = (pct) => {
      bar.value = pct;
      bar.style.setProperty("--pct", `${pct}%`);
    };

    /* — play / pause — */
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().then(setPlay).catch(err => console.warn("Audio:", err));
      } else {
        audio.pause();
        setPause();
      }
    });

    audio.volume = 1;

    /* — progreso normal — */
    let seeking = false;

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration || seeking) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      updateBar(pct);
      timeEl.textContent = `${this._fmt(audio.currentTime)} / ${this._fmt(audio.duration)}`;
    });

    audio.addEventListener("loadedmetadata", () => {
      timeEl.textContent = `0:00 / ${this._fmt(audio.duration)}`;
    });

    audio.addEventListener("ended", () => { setPause(); updateBar(0); });

    audio.addEventListener("error", () => {
      btn.disabled = true;
      timeEl.textContent = "Error al cargar el audio";
    });

    /* — SEEK: pointerdown bloquea timeupdate, input mueve el audio — */
    bar.addEventListener("pointerdown", () => { seeking = true; });

    bar.addEventListener("input", () => {
      if (!audio.duration) return;
      const newTime = (bar.value / 100) * audio.duration;
      audio.currentTime = newTime;
      bar.style.setProperty("--pct", `${bar.value}%`);
      timeEl.textContent = `${this._fmt(newTime)} / ${this._fmt(audio.duration)}`;
    });

    bar.addEventListener("pointerup", () => {
      seeking = false;
      /* sincronizar por si el seek terminó durante el drag */
      if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        updateBar(pct);
      }
    });
  }
}

customElements.define("audio-guia", AudioGuia);
