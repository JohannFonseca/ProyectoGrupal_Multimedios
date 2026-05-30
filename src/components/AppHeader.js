const sheet = new CSSStyleSheet();
await fetch(new URL('../css/app-header.css', import.meta.url))
  .then(r => r.text())
  .then(css => sheet.replaceSync(css));

const SELECTORS = {
  NAV: '#nav',
  MENU_BTN: '#menuBtn',
  REGIONS_BTN: '#regionsBtn',
  DROPDOWN_MENU: '.dropdown-menu',
  REGION_ITEM: '[data-region]',
};

const CLASSES = {
  OPEN: 'open',
  SHOW: 'show',
};

const EVENTS = {
  REGION_SELECTED: 'region-selected',
};

class AppHeader extends HTMLElement {
  #state = {
    isOpen: false,
    showRegions: false,
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

    if (!this.#state.isOpen) {
      this.showRegions = false;
    }
  }

  #updateDropdownUI() {
    const { dropdownMenu } = this.#elements;
    if (!dropdownMenu) return;

    dropdownMenu.classList.toggle(CLASSES.SHOW, this.#state.showRegions);
  }

  render() {
    this.shadowRoot.setHTMLUnsafe(this.#getTemplate());
  }

  #getTemplate() {
    return `
      <header>
        <div class="logo">
          <img src="./assets/images/LogoRutaDelSabor.png" alt="logo ruta del sabor" />
        </div>

        <div class="hamburger-menu" id="menuBtn">
          <div class="hamburger-menu-line"></div>
          <div class="hamburger-menu-line"></div>
          <div class="hamburger-menu-line"></div>
        </div>

        <nav id="nav">
          <a>Inicio</a>
          <div class="dropdown">
            <a id="regionsBtn">Regiones</a>
            <div class="dropdown-menu">
              <div data-region="pacifico-norte">Pacífico Norte</div>
              <div data-region="caribe">Caribe</div>
              <div data-region="valle-central">Valle Central</div>
              <div data-region="pacifico-central">Pacífico Central/Sur</div>
            </div>
          </div>
          <a>Sobre Nosotros</a>
          <a>Contacto</a>
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
    };
  }

  #bindEvents() {
    const { menuBtn, regionsBtn, regionItems } = this.#elements;

    menuBtn.addEventListener("click", (e) => this.#handleMenuToggle(e));
    regionsBtn.addEventListener("click", (e) => this.#handleDropdownToggle(e));
    regionItems.forEach(item => {
      item.addEventListener("click", (e) => this.#handleRegionSelect(e));
    });
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
    this.#dispatchRegionSelected(region);

    this.showRegions = false;
    this.isOpen = false;
  }

  #dispatchRegionSelected(region) {
    this.dispatchEvent(
      new CustomEvent(EVENTS.REGION_SELECTED, {
        detail: { region },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("app-header", AppHeader);