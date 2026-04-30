import "./components/AppHeader.js";

document.addEventListener("region-selected", (e) => {
    console.log("Evento recibido:", e.detail.region);
});

const regionMap = {
    "pacifico-norte": ["pacifico-norte"],
    "caribe": ["caribe"],
    "valle-central": ["valle-central"],
    "pacifico-central": ["pacifico-central"]
};

function clearSelectedRegion() {
    document.querySelectorAll(".region-active").forEach((el) => {
        el.classList.remove("region-active");
    });
}
const originalColors = {
    "pacifico-norte": "#F02525",
    "caribe": "#00830D",
    "valle-central": "#004AAD",
    "pacifico-central": "#6F4E37"
};

function resetRegions() {
    Object.keys(originalColors).forEach((id) => {
        const regionSelected = document.getElementById(id);
        if (!regionSelected) return;

        const paths = regionSelected.querySelectorAll("path");

        if (paths.length > 0) {
            paths.forEach((p) => {
                p.style.fill = originalColors[id];
            });
        } else {
            regionSelected.style.fill = originalColors[id];
        }
    });
}
function highlightRegion(regionKey) {
    console.log("Seleccion:", regionKey);

    const allRegions = ["pacifico-norte", "caribe", "valle-central", "pacifico-central"];

   
    allRegions.forEach(id => {
        const regionSelected = document.getElementById(id);
        if (!regionSelected) return;

        const paths = regionSelected.querySelectorAll("path");

        if (paths.length > 0) {
            paths.forEach(p => {
                p.removeAttribute("style");
                p.setAttribute("fill", "#fff8e7");
                p.setAttribute("fill-opacity", "1");
                p.setAttribute("stroke", "#000000");
                p.setAttribute("stroke-width", "1.88976");

            });
        } else {
            regionSelected.removeAttribute("style");
            regionSelected.setAttribute("fill", "#fff8e7");
            regionSelected.setAttribute("fill-opacity", "1");
            regionSelected.setAttribute("stroke", "#000000");
            regionSelected.setAttribute("stroke-width", "1.88976");

        }
    });

    const selected = document.getElementById(regionKey);

    if (!selected) {
        console.log("NO ENCONTRADO:", regionKey);
        return;
    }

    const colorMap = {
        "pacifico-norte": "#F02525",
        "caribe": "#00830D",
        "valle-central": "#004AAD",
        "pacifico-central": "#6F4E37"
    };

    const paths = selected.querySelectorAll("path");

    if (paths.length > 0) {
        paths.forEach(p => {
            p.removeAttribute("style");
            p.setAttribute("fill", colorMap[regionKey]);
        });
    } else {
        selected.removeAttribute("style");
        selected.setAttribute("fill", colorMap[regionKey]);
    }
}

document.addEventListener("region-selected", (e) => {
    highlightRegion(e.detail.region);
});