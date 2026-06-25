# Ruta del Sabor

Guía turística multimedia enfocada en destinos gastronómicos de Costa Rica.

Este proyecto fue desarrollado para el curso IF7102 Multimedios de la Universidad de Costa Rica. La aplicación permite seleccionar una región del país, consultar sus destinos y acceder a información como descripciones, actividades, fotografías, audio y video.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- Web Components
- Custom Elements
- Shadow DOM
- ES Modules
- Archivos JSON para los datos de los destinos

La interfaz fue construida con tecnologías nativas del navegador, sin frameworks externos.

## Contenido

La guía incluye cuatro regiones turísticas con dos destinos cada una:

- Pacífico Norte: Liberia y Nicoya
- Caribe: Puerto Viejo y Cahuita
- Valle Central: Heredia y Cartago
- Pacífico Central y Sur: Manuel Antonio y Uvita

Los datos se encuentran en `src/data/destinos.json` y se cargan dinámicamente mediante `fetch()`.

## Componentes principales

- `<app-header>`: navegación principal y menú de regiones.
- `<mapa-regiones>`: mapa interactivo para seleccionar una región.
- `<destino-list>`: carga y muestra los destinos de la región seleccionada.
- `<destino-card>`: presenta el resumen de cada destino.
- `<destino-detalle>`: muestra la información completa del destino elegido.
- `<galeria-imagenes>`: carrusel de imágenes con navegación y vista ampliada.
- `<audio-guia>`: reproductor de audio con controles personalizados.
- `<video-destino>`: muestra el video asociado al destino.
- `<sobre-nosotros>`: información sobre el equipo.
- `<contacto-seccion>`: directorio de los destinos gastronómicos.

Cada componente se encuentra en su propio archivo dentro de `src/components/`.

## Comunicación entre componentes

La aplicación utiliza eventos personalizados para conectar los componentes sin acoplarlos directamente:

- `navigate`: cambia entre las vistas principales.
- `region-selected`: comunica la región seleccionada desde el encabezado o el mapa.
- `region-hover`: sincroniza el resaltado de las regiones.
- `destino-selected`: envía el ID del destino seleccionado.

Cuando se selecciona una tarjeta, `<destino-list>` busca el destino por su ID y entrega el objeto completo a `<destino-detalle>` mediante una propiedad.

## Estructura general

```text
src/
├── assets/
│   ├── audios/
│   └── images/
├── components/
│   ├── AppHeader.js
│   ├── AudioGuia.js
│   ├── Contacto.js
│   ├── DestinoCard.js
│   ├── DestinoDetalle.js
│   ├── DestinoList.js
│   ├── GaleriaImagenes.js
│   ├── MapaRegiones.js
│   ├── SobreNosotros.js
│   └── VideoDestino.js
├── css/
├── data/
│   ├── destinos.json
│   └── regiones.js
├── modules/
│   └── regionController.js
├── index.html
└── main.js
```

## Ejecución local

Se necesita Node.js y pnpm.

Primero se instalan las dependencias:

```bash
pnpm install
```

Luego se inicia el servidor local:

```bash
pnpm dev
```

La aplicación estará disponible en:

```text
http://localhost:1234
```

No se recomienda abrir `src/index.html` directamente, ya que los ES Modules y las solicitudes realizadas con `fetch()` necesitan un servidor local.

## Autores

- Dariel Benavides Tapia
- Eddy Josué González Quirós
- Sofia Salazar Mata
- José Daniel Solís Cordoncillo
- Johann Fonseca Espinoza
