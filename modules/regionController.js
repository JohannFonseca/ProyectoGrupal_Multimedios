import '../components/AppHeader.js';
import '../components/MapaRegiones.js';

export function initRegionController() {
    const appHeader = document.querySelector("app-header");
    const mapaRegiones = document.querySelector("mapa-regiones");

    if (!appHeader || !mapaRegiones) {
        console.error("Faltan componentes necesarios en el DOM");
        return;
    }

    document.addEventListener("region-selected", (e) => {
        const regionKey = e.detail.region;
        console.log("Controlador: Región seleccionada ->", regionKey);
        mapaRegiones.region = regionKey;
    });
}