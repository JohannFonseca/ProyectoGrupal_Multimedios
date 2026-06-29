# CRÉDITOS Y LICENCIAS DE RECURSOS MULTIMEDIA

**Proyecto:** Ruta del Sabor — Guía Turística Multimedia de Costa Rica  
**Curso:** IF7102 Multimedios — Universidad de Costa Rica  
**Autores:** Dariel Benavides Tapia · Eddy Josué González Quirós · Sofia Salazar Mata · José Daniel Solís Cordoncillo · Johann Fonseca Espinoza

---

## 1. IMÁGENES

Las imágenes de galería y portada de los destinos son fotografías propias tomadas por los integrantes del equipo durante visitas a los lugares documentados. Se distribuyen bajo la siguiente licencia:

**Licencia:** [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es)  
**Autores:** Equipo de desarrollo del proyecto (véase sección Autores)

### 1.1 Galería por destino

| Carpeta                                | Destino                                            | Cantidad de imágenes | Formato |
| -------------------------------------- | -------------------------------------------------- | -------------------- | ------- |
| `src/assets/images/1MercadoLiberia/`   | Mercado Municipal de Liberia (Liberia, Pac. Norte) | 11                   | .webp   |
| `src/assets/images/2LaTortilleria/`    | La Tortillería (Nicoya, Pac. Norte)                | 10                   | .webp   |
| `src/assets/images/3TamaraRestaurant/` | Tamara Restaurant (Puerto Viejo, Caribe)           | 10                   | .webp   |
| `src/assets/images/4DelritaPatty/`     | Delrita Patty (Cahuita, Caribe)                    | 10                   | .webp   |
| `src/assets/images/5BrittCoffeeTour/`  | Britt Coffee Tour (Heredia, Valle Central)         | 10                   | .webp   |
| `src/assets/images/6MiTierra/`         | Mi Tierra (Cartago, Valle Central)                 | 10                   | .webp   |
| `src/assets/images/7ElAvion/`          | El Avión (Manuel Antonio, Pac. Central y Sur)      | 10                   | .webp   |
| `src/assets/images/8LaLeda/`           | La Leda (Uvita, Pac. Central y Sur)                | 10                   | .webp   |

### 1.2 Recursos gráficos adicionales

| Archivo                                  | Descripción                                              | Autoría                              |
| ---------------------------------------- | -------------------------------------------------------- | ------------------------------------ |
| `src/assets/images/LogoRutaDelSabor.png` | Logotipo oficial del proyecto                            | Equipo de desarrollo (diseño propio) |
| `src/assets/images/mapa.svg`             | Mapa vectorial interactivo de las regiones de Costa Rica | Equipo de desarrollo (diseño propio) |

---

## 2. AUDIOS

Las audioguías son narraciones originales grabadas por los integrantes del equipo. El contenido es de elaboración propia.

**Formato:** M4A (AAC)  
**Licencia:** [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es)  
**Autores:** Equipo de desarrollo del proyecto

| Archivo                                  | Destino        | Región                 |
| ---------------------------------------- | -------------- | ---------------------- |
| `src/assets/audios/audioLberia.m4a`      | Liberia        | Pacífico Norte         |
| `src/assets/audios/audioNicoya.m4a`      | Nicoya         | Pacífico Norte         |
| `src/assets/audios/audioPuertoViejo.m4a` | Puerto Viejo   | Caribe                 |
| `src/assets/audios/audioCahuita.m4a`     | Cahuita        | Caribe                 |
| `src/assets/audios/audioHeredia.m4a`     | Heredia        | Valle Central          |
| `src/assets/audios/audioCartago.m4a`     | Cartago        | Valle Central          |
| `src/assets/audios/audioPuntarenas.m4a`  | Manuel Antonio | Pacífico Central y Sur |
| `src/assets/audios/audioCaldera.m4a`     | Uvita          | Pacífico Central y Sur |

---

## 3. VIDEOS

Los videos fueron producidos por el equipo y se alojan en Google Drive. Se enlazan de forma externa desde la aplicación mediante el componente `<video-destino>`.

**Licencia:** [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es)  
**Autores:** Equipo de desarrollo del proyecto

| Destino        | Región                 | Enlace                                                                 |
| -------------- | ---------------------- | ---------------------------------------------------------------------- |
| Liberia        | Pacífico Norte         | https://drive.google.com/file/d/1RtFP2ZxlbB6ifsnHOMsv6EgyVCCOlqXY/view |
| Nicoya         | Pacífico Norte         | https://drive.google.com/file/d/1ZG0EZxr7DQ_qMcXnDW3LKAH_BLLJEU_J/view |
| Puerto Viejo   | Caribe                 | https://drive.google.com/file/d/1rFyLEIyhjzzpvo0KBe1baH6PUC060-G_/view |
| Cahuita        | Caribe                 | https://drive.google.com/file/d/1bWx_oLWKIxaFF51VyA0YRz90EwC3ybLM/view |
| Heredia        | Valle Central          | https://drive.google.com/file/d/1juIipPQRvu17ByA4Kf-UxHa7YjDR8z1_/view |
| Cartago        | Valle Central          | https://drive.google.com/file/d/1yflLMknhajZb0WqSTG2MKVcNfBERyHp9/view |
| Manuel Antonio | Pacífico Central y Sur | https://drive.google.com/file/d/1AcL_vsK5aM3E8DpLZOYZhXo_hkiw1LaJ/view |
| Uvita          | Pacífico Central y Sur | https://drive.google.com/file/d/1oQ0HypJgHkvfnK1tCPxkyzkM7IrQPP62/view |

---

## 4. CÓDIGO FUENTE Y TECNOLOGÍAS

El código fuente del proyecto es de elaboración propia y se desarrolló con tecnologías nativas del navegador (HTML5, CSS3, JavaScript ES6+, Web Components, Shadow DOM, ES Modules), sin dependencia de frameworks externos.

**Licencia del código:** [MIT License](https://opensource.org/licenses/MIT)

### 4.1 Dependencias de desarrollo (package.json)

Las siguientes herramientas se usaron únicamente durante el desarrollo local y no forman parte del producto final desplegado:

| Paquete                         | Versión                | Licencia | Uso                              |
| ------------------------------- | ---------------------- | -------- | -------------------------------- |
| [Parcel](https://parceljs.org/) | según `pnpm-lock.yaml` | MIT      | Servidor de desarrollo y bundler |

> Las dependencias exactas y sus versiones están especificadas en `pnpm-lock.yaml`.

---

## 5. TEXTOS Y CONTENIDO EDITORIAL

Las descripciones de destinos, restaurantes y actividades son textos de elaboración propia redactados por el equipo con base en investigación y visitas a los lugares.

**Licencia:** [Creative Commons Atribución 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/deed.es)

---

## 6. NOTA SOBRE LICENCIAS

| Tipo de recurso                     | Licencia aplicada |
| ----------------------------------- | ----------------- |
| Imágenes (fotografías propias)      | CC BY 4.0         |
| Audioguías (grabaciones propias)    | CC BY 4.0         |
| Videos (producción propia)          | CC BY 4.0         |
| Logotipo y mapa SVG (diseño propio) | CC BY 4.0         |
| Textos y contenido editorial        | CC BY 4.0         |
| Código fuente                       | MIT               |

La licencia **CC BY 4.0** permite compartir y adaptar el material para cualquier propósito, siempre que se otorgue el crédito correspondiente al equipo de desarrollo. Más información en: https://creativecommons.org/licenses/by/4.0/deed.es

La licencia **MIT** permite usar, copiar, modificar y distribuir el código fuente con o sin modificaciones, siempre que se incluya el aviso de copyright original.

---

_Documento generado para el curso IF7102 Multimedios — Universidad de Costa Rica, Sede Guanacaste._
