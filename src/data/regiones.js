export const REGIONS_CONFIG = {
    "pacifico-norte": { color: "#F02525" },
    "caribe": { color: "#00830D" },
    "valle-central": { color: "#004AAD" },
    "pacifico-central": { color: "#6F4E37" }
};

export function applySVGStyles(element, fillColor, isIdle = false) {
    if (!element) return;

    element.style.removeProperty('fill');
    element.removeAttribute("fill");
    element.removeAttribute("class");

    if (isIdle) {
        element.style.fill = "#fff8e7";
        element.style.fillOpacity = "1";
        element.style.stroke = "#000000";
    } else {
        element.style.fill = fillColor;
        element.style.fillOpacity = "";
        element.style.stroke = "";
    }
}

export function applySVGHoverStyles(element, fillColor) {
    if (!element) return;

    element.style.removeProperty('fill');
    element.removeAttribute("fill");
    element.removeAttribute("class");

    
    element.style.fill = fillColor;
    element.style.fillOpacity = "0.55";
    element.style.stroke = "";
    element.style.translate = '';
    element.style.scale = '';
    element.style.filter = '';
}