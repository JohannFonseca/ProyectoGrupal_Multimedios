class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.isOpen = false;
    this.showRegions = false;
  }

  async connectedCallback() {
    const css = await fetch("./css/app-header.css").then((r) => r.text());

    this.shadowRoot.innerHTML = `
      <style>${css}</style>

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
            <div class="dropdown-menu ${this.showRegions ? "show" : ""}">
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

    this.addEvents();
  }

  addEvents() {

    const menuBtn = this.shadowRoot.getElementById("menuBtn");
    const nav = this.shadowRoot.getElementById("nav");
    const regionsBtn = this.shadowRoot.getElementById("regionsBtn");
    const regionItems = this.shadowRoot.querySelectorAll(".dropdown-menu div");


    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      this.isOpen = !this.isOpen;

      nav.classList.toggle("open", this.isOpen);
      menuBtn.classList.toggle("open", this.isOpen);

      if (!this.isOpen) {
        this.showRegions = false;
        this.updateDropdown();
      }
    });


    regionsBtn.addEventListener("click", (e) => {
      e.stopPropagation();

      this.showRegions = !this.showRegions;
      this.updateDropdown();
    });


    regionItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();

        const regionName = e.target.textContent.trim();


        this.dispatchEvent(
          new CustomEvent("region-selected", {
            detail: { region: e.target.dataset.region },
            bubbles: true,
            composed: true,
          }),
        );

        this.showRegions = false;
        this.updateDropdown();
        this.isOpen = false;

        const nav = this.shadowRoot.getElementById("nav");
        const menuBtn = this.shadowRoot.getElementById("menuBtn");

        nav.classList.remove("open");
        menuBtn.classList.remove("open");
      });
    });
  }
  updateDropdown() {
    const menu = this.shadowRoot.querySelector(".dropdown-menu");
    if (!menu) return;
    menu.classList.toggle("show", this.showRegions);
  }
}

customElements.define("app-header", AppHeader);