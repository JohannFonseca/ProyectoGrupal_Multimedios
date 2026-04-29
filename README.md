# Ruta del Sabor

Guía Turística Multimedia de Costa Rica

Proyecto Final – IF7102 Multimedios
Universidad de Costa Rica

---

## Descripción

Aplicación web interactiva orientada al turismo gastronómico de Costa Rica. Permite explorar regiones del país y visualizar destinos mediante contenido multimedia y navegación basada en Web Components.

El sistema está construido utilizando tecnologías nativas del navegador, sin uso de frameworks externos.

---

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6+
- Web Components (Custom Elements y Shadow DOM)
- ES Modules

---

## Estructura del proyecto

```plaintext
src/
│
├── assets/
│   └── images/
│       └── LogoRutaDelSabor.png
│
├── components/
│   └── AppHeader.js
│
├── css/
│   ├── app-header.css
│   ├── global.css
│   └── variables.css
│
├── index.html
├── main.js
│
├── .gitignore
├── README.md
├── package.json
└── pnpm-lock.yaml
```

---

## Componente implementado

### AppHeader (Web Component)

- Barra de navegación principal
- Implementado como Custom Element
- Utiliza Shadow DOM para encapsulación de estilos
- Permite interacción mediante eventos personalizados
- Representa el primer componente funcional del sistema

---

## Ejecución del proyecto

Este proyecto utiliza ES Modules, por lo que debe ejecutarse en un servidor local.

### Opción 1: Live Server (Visual Studio Code)

1. Instalar la extensión "Live Server"
2. Abrir la carpeta del proyecto
3. Ejecutar `index.html` con Live Server

---

### Opción 2: Node.js (http-server)

Instalar el servidor:

```bash
npm install -g http-server
```

Ejecutar en la carpeta del proyecto:

```bash
http-server ./src
```

Abrir en el navegador:

```plaintext
http://localhost:8080
```

---

### Opción 3: Python

```bash
python -m http.server
```

Abrir en el navegador:

```plaintext
http://localhost:8000/src
```

---

## Nota técnica

No es posible ejecutar correctamente el proyecto abriendo el archivo `index.html` directamente en el navegador debido a restricciones de seguridad relacionadas con ES Modules (CORS).

---

## Estado del proyecto

- Estructura base definida
- Primer Web Component funcional implementado (`AppHeader`)
- Estilos globales configurados
- Organización modular del código establecida

---

## Autores

- Dariel Benavides Tapia
- Eddy Josué González Quirós
- Sofia Salazar Mata
- José Daniel Solís Cordoncillo
- Johan Fonseca Espinoza
