import "./components/AppHeader.js";
import "./components/GaleriaImagenes.js";
import "./components/AudioGuia.js";
import "./components/VideoDestino.js";
import "./components/DestinoList.js";
import "./components/SobreNosotros.js";
import "./components/Contacto.js";
import { initRegionController } from "./modules/regionController.js";

initRegionController();

// Cargar imágenes de todos los destinos en el carrusel de inicio
async function initCarruselInicio() {
  try {
    const resp = await fetch("./data/destinos.json");
    const datos = await resp.json();
    const todas = datos.regiones.flatMap((r) =>
      r.destinos.flatMap((d) => d.galeria ?? d.media?.imagenes ?? []),
    );
    const mezcladas = todas.sort(() => Math.random() - 0.5);
    const carrusel = document.getElementById("carrusel-inicio");
    if (carrusel) carrusel.setAttribute("imagenes", JSON.stringify(mezcladas));
  } catch (err) {
    console.error("Error cargando carrusel de inicio:", err);
  }
}

initCarruselInicio();

// ─── Controlador de Navegación entre vistas ───────────────────────────────────
document.addEventListener("navigate", (e) => {
  const page = e.detail.page;

  const heroInicio = document.getElementById("hero-inicio");
  const sectionDivider = document.querySelector(".section-divider");
  const mapa = document.querySelector("mapa-regiones");
  const destinos = document.querySelector("destino-list");
  const detalleContenedor = document.getElementById(
    "contenedor-destino-detalle",
  );
  const footer = document.querySelector(".page-footer");
  let sobreNosotros = document.querySelector("sobre-nosotros");
  let contactoSeccion = document.querySelector("contacto-seccion");

  if (!sobreNosotros) {
    sobreNosotros = document.createElement("sobre-nosotros");
    sobreNosotros.style.display = "none";
    document.body.appendChild(sobreNosotros);
  }
  if (!contactoSeccion) {
    contactoSeccion = document.createElement("contacto-seccion");
    contactoSeccion.style.display = "none";
    document.body.appendChild(contactoSeccion);
  }

  const ocultarTodo = () => {
    if (heroInicio) heroInicio.style.display = "none";
    if (sectionDivider) sectionDivider.style.display = "none";
    if (mapa) mapa.style.display = "none";
    if (destinos) destinos.style.display = "none";
    if (detalleContenedor) detalleContenedor.style.display = "none";
    if (footer) footer.style.display = "none";
    sobreNosotros.style.display = "none";
    contactoSeccion.style.display = "none";
  };

  ocultarTodo();

  if (page === "inicio") {
    if (heroInicio) heroInicio.style.display = "block";
    if (sectionDivider) sectionDivider.style.display = "flex";
    if (mapa) mapa.style.display = "block";
    if (destinos) destinos.style.display = "block";
    if (detalleContenedor) detalleContenedor.style.display = "block";
    if (footer) footer.style.display = "block";
  } else if (page === "sobre-nosotros") {
    sobreNosotros.style.display = "block";
  } else if (page === "contacto") {
    contactoSeccion.style.display = "block";
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
});
