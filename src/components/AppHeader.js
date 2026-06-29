const sheet = new CSSStyleSheet();
await fetch(new URL("../css/app-header.css", import.meta.url))
  .then((r) => r.text())
  .then((css) => sheet.replaceSync(css));

const SELECTORS = {
  NAV: "#nav",
  MENU_BTN: "#menuBtn",
  REGIONS_BTN: "#regionsBtn",
  DROPDOWN_MENU: ".dropdown-menu",
  REGION_ITEM: "[data-region]",
};

const CLASSES = {
  OPEN: "open",
  SHOW: "show",
  ACTIVE: "active",
};

const EVENTS = {
  REGION_SELECTED: "region-selected",
};

// Cabecera principal de la aplicación: administra la barra de navegación, menús responsivos y selección de regiones.
class AppHeader extends HTMLElement {
  // Atributo observado: resalta la región activa en el menú "Regiones".
  static get observedAttributes() {
    return ["active-region"];
  }

  #state = {
    isOpen: false,
    showRegions: false,
    activePage: "inicio",
  };

  #elements = {};

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.adoptedStyleSheets = [sheet];
    this.render();
    this.#cacheElements();
    this.#bindEvents();
    this.#highlightActiveRegion();
    this.#updateActiveNav();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "active-region" && oldVal !== newVal) {
      this.#highlightActiveRegion();
      if (newVal) {
        this.#state.activePage = "regiones";
        this.#updateActiveNav();
      }
    }
  }

  get activeRegion() {
    return this.getAttribute("active-region");
  }

  set activeRegion(value) {
    if (value == null || value === "") {
      this.removeAttribute("active-region");
    } else {
      this.setAttribute("active-region", value);
    }
  }

  // Marca como activa la opción de región que coincide con active-region.
  #highlightActiveRegion() {
    const region = this.getAttribute("active-region");
    const items = this.shadowRoot?.querySelectorAll(SELECTORS.REGION_ITEM);
    if (!items) return;
    items.forEach((item) => {
      const isActive = item.dataset.region === region;
      item.classList.toggle(CLASSES.ACTIVE, isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  }

  get isOpen() {
    return this.#state.isOpen;
  }

  set isOpen(value) {
    if (this.#state.isOpen === value) return;
    this.#state.isOpen = value;
    this.#updateMenuUI();
  }

  get showRegions() {
    return this.#state.showRegions;
  }

  set showRegions(value) {
    if (this.#state.showRegions === value) return;
    this.#state.showRegions = value;
    this.#updateDropdownUI();
  }

  #updateMenuUI() {
    const { nav, menuBtn } = this.#elements;
    if (!nav || !menuBtn) return;

    nav.classList.toggle(CLASSES.OPEN, this.#state.isOpen);
    menuBtn.classList.toggle(CLASSES.OPEN, this.#state.isOpen);
    menuBtn.setAttribute("aria-expanded", String(this.#state.isOpen));
    menuBtn.setAttribute(
      "aria-label",
      this.#state.isOpen ? "Cerrar menú principal" : "Abrir menú principal",
    );

    if (!this.#state.isOpen) {
      this.showRegions = false;
    }
  }

  #updateDropdownUI() {
    const { dropdownMenu, regionsBtn } = this.#elements;
    if (!dropdownMenu || !regionsBtn) return;

    dropdownMenu.classList.toggle(CLASSES.SHOW, this.#state.showRegions);
    regionsBtn.setAttribute("aria-expanded", String(this.#state.showRegions));
  }

  #updateActiveNav() {
    const { btnInicio, regionsBtn, btnSobreNosotros, btnContacto } =
      this.#elements;
    const buttons = {
      inicio: btnInicio,
      regiones: regionsBtn,
      "sobre-nosotros": btnSobreNosotros,
      contacto: btnContacto,
    };

    Object.entries(buttons).forEach(([page, button]) => {
      button?.classList.toggle("active", page === this.#state.activePage);
    });
  }

  render() {
    this.shadowRoot.setHTMLUnsafe(this.#getTemplate());
  }

  #getTemplate() {
    return `
      <header>
        <button class="logo" id="logoBtn" type="button" aria-label="Ir al inicio">
          <img src="./assets/images/LogoRutaDelSabor.png" alt="logo ruta del sabor" />
        </button>

        <button
          class="hamburger-menu"
          id="menuBtn"
          type="button"
          aria-label="Abrir menú principal"
          aria-controls="nav"
          aria-expanded="false">
          <span class="hamburger-menu-line"></span>
          <span class="hamburger-menu-line"></span>
          <span class="hamburger-menu-line"></span>
        </button>

        <nav id="nav" aria-label="Navegación principal">
          <button class="nav-button" id="btnInicio" type="button">Inicio</button>
          <div class="dropdown">
            <button
              class="nav-button"
              id="regionsBtn"
              type="button"
              aria-controls="regionMenu"
              aria-expanded="false">
              Regiones
            </button>
            <div class="dropdown-menu" id="regionMenu">
              <button class="region-option" type="button" data-region="pacifico-norte" aria-pressed="false">Pacífico Norte</button>
              <button class="region-option" type="button" data-region="caribe" aria-pressed="false">Caribe</button>
              <button class="region-option" type="button" data-region="valle-central" aria-pressed="false">Valle Central</button>
              <button class="region-option" type="button" data-region="pacifico-central" aria-pressed="false">Pacífico Central/Sur</button>
            </div>
          </div>
          <button class="nav-button" id="btnSobreNosotros" type="button">Sobre Nosotros</button>
          <button class="nav-button" id="btnContacto" type="button">Contacto</button>
        </nav>
      </header>
    `;
  }

  #cacheElements() {
    this.#elements = {
      nav: this.shadowRoot.querySelector(SELECTORS.NAV),
      menuBtn: this.shadowRoot.querySelector(SELECTORS.MENU_BTN),
      regionsBtn: this.shadowRoot.querySelector(SELECTORS.REGIONS_BTN),
      dropdownMenu: this.shadowRoot.querySelector(SELECTORS.DROPDOWN_MENU),
      regionItems: this.shadowRoot.querySelectorAll(SELECTORS.REGION_ITEM),
      logoBtn: this.shadowRoot.querySelector("#logoBtn"),
      btnInicio: this.shadowRoot.querySelector("#btnInicio"),
      btnSobreNosotros: this.shadowRoot.querySelector("#btnSobreNosotros"),
      btnContacto: this.shadowRoot.querySelector("#btnContacto"),
    };
  }

  #bindEvents() {
    const {
      menuBtn,
      regionsBtn,
      regionItems,
      logoBtn,
      btnInicio,
      btnSobreNosotros,
      btnContacto,
    } = this.#elements;

    menuBtn.addEventListener("click", (e) => this.#handleMenuToggle(e));
    regionsBtn.addEventListener("click", (e) => this.#handleDropdownToggle(e));
    regionItems.forEach((item) => {
      item.addEventListener("click", (e) => this.#handleRegionSelect(e));
      item.addEventListener("pointerenter", (e) =>
        this.#handleRegionHover(e, true),
      );
      item.addEventListener("pointerleave", (e) =>
        this.#handleRegionHover(e, false),
      );
    });

    const dispatchNav = (page) => {
      this.#state.activePage = page;
      this.#updateActiveNav();
      this.dispatchEvent(
        new CustomEvent("navigate", {
          detail: { page },
          bubbles: true,
          composed: true,
        }),
      );
      this.isOpen = false;
    };

    if (logoBtn) logoBtn.addEventListener("click", () => dispatchNav("inicio"));
    if (btnInicio)
      btnInicio.addEventListener("click", () => dispatchNav("inicio"));
    if (btnSobreNosotros)
      btnSobreNosotros.addEventListener("click", () =>
        dispatchNav("sobre-nosotros"),
      );
    if (btnContacto)
      btnContacto.addEventListener("click", () => dispatchNav("contacto"));
  }

  #handleMenuToggle(e) {
    e.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  #handleDropdownToggle(e) {
    e.stopPropagation();
    this.showRegions = !this.showRegions;
  }

  #handleRegionSelect(e) {
    e.stopPropagation();

    const region = e.target.dataset.region;
    this.#state.activePage = "regiones";
    this.#updateActiveNav();

    this.dispatchEvent(
      new CustomEvent("navigate", {
        detail: { page: "inicio" },
        bubbles: true,
        composed: true,
      }),
    );

    this.#dispatchRegionSelected(region);

    this.showRegions = false;
    this.isOpen = false;
  }

  #handleRegionHover(e, enter) {
    e.stopPropagation();
    const region = enter ? e.target.dataset.region : null;
    this.dispatchEvent(
      new CustomEvent("region-hover", {
        detail: { region },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #dispatchRegionSelected(region) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.REGION_SELECTED, {
        detail: { region },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("app-header", AppHeader);
