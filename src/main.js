import "./components/AppHeader.js";
import "./components/DestinoList.js";
import "./components/SobreNosotros.js";
import "./components/Contacto.js";
import { initRegionController } from "./modules/regionController.js";

initRegionController();

// Controlador de Navegación entre vistas
document.addEventListener("navigate", (e) => {
  const page = e.detail.page;
  console.log("Navegación: Cambiando a vista →", page);

  const mapa = document.querySelector("mapa-regiones");
  const destinos = document.querySelector("destino-list");
  const detalleContenedor = document.getElementById("contenedor-destino-detalle");
  let sobreNosotros = document.querySelector("sobre-nosotros");
  let contactoSeccion = document.querySelector("contacto-seccion");

  // Crear dinámicamente los componentes si no existen en el DOM
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

  if (page === "sobre-nosotros") {
    if (mapa) mapa.style.display = "none";
    if (destinos) destinos.style.display = "none";
    if (detalleContenedor) detalleContenedor.style.display = "none";
    if (contactoSeccion) contactoSeccion.style.display = "none";
    sobreNosotros.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (page === "inicio") {
    if (mapa) mapa.style.display = "block";
    if (destinos) destinos.style.display = "block";
    if (detalleContenedor) detalleContenedor.style.display = "block";
    if (sobreNosotros) sobreNosotros.style.display = "none";
    if (contactoSeccion) contactoSeccion.style.display = "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (page === "contacto") {
    if (mapa) mapa.style.display = "none";
    if (destinos) destinos.style.display = "none";
    if (detalleContenedor) detalleContenedor.style.display = "none";
    if (sobreNosotros) sobreNosotros.style.display = "none";
    contactoSeccion.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
});

