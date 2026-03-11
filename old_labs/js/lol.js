const destinos = [
  {
    nombre: "Madrid",
    pais: "Espana",
    emoji: "🏛️",
    resumen: "Una ciudad con mucha historia, plazas amplias y vida urbana muy activa.",
    descripcion:
      "Madrid fue uno de los destinos mas representativos del viaje. Destaco por su arquitectura, el ambiente en las calles y la mezcla entre cultura, comida y movimiento constante en la ciudad.",
    color: "linear-gradient(135deg, #d66d75 0%, #e29587 100%)",
    imagen: "/Madrid.png",
    etiquetas: ["Ciudad", "Historia", "Europa"],
  },
  {
    nombre: "Mallorca",
    pais: "Espana",
    emoji: "🏖️",
    resumen: "Paisajes costeros, clima agradable y una atmosfera relajada frente al mar.",
    descripcion:
      "Mallorca sobresale por sus vistas al mar y por el contraste entre zonas tranquilas y espacios turisticos. Es un lugar ideal para descansar y recorrer paisajes naturales.",
    color: "linear-gradient(135deg, #3a7bd5 0%, #7fd6ff 100%)",
    imagen: "/Mallorca.png",
    etiquetas: ["Playa", "Isla", "Descanso"],
  },
  {
    nombre: "Marruecos",
    pais: "Africa",
    emoji: "🐪",
    resumen: "Mercados, colores intensos y una experiencia cultural muy distinta.",
    descripcion:
      "Marruecos fue un destino muy llamativo por su identidad visual, sus calles y la experiencia cultural. Es un lugar que se recuerda por sus texturas, aromas y ambientes diferentes.",
    color: "linear-gradient(135deg, #b24592 0%, #f15f79 100%)",
    imagen: "/Marruecos.png",
    etiquetas: ["Cultura", "Mercados", "Aventura"],
  },
  {
    nombre: "Toronto",
    pais: "Canada",
    emoji: "🌆",
    resumen: "Una ciudad moderna, ordenada y con un estilo cosmopolita.",
    descripcion:
      "Toronto deja una impresion de ciudad internacional, con edificios altos, espacios urbanos bien organizados y una energia muy distinta a otros destinos del viaje.",
    color: "linear-gradient(135deg, #485563 0%, #29323c 100%)",
    imagen: "/Toronto.png",
    etiquetas: ["Urbano", "Canada", "Arquitectura"],
  },
  {
    nombre: "San Miguel de Allende",
    pais: "Mexico",
    emoji: "⛪",
    resumen: "Un destino con identidad colonial, color y mucho valor cultural.",
    descripcion:
      "San Miguel de Allende destaca por su estilo arquitectonico, sus calles y el ambiente tranquilo. Es un lugar con mucha personalidad y un caracter visual muy marcado.",
    color: "linear-gradient(135deg, #c79081 0%, #dfa579 100%)",
    imagen: "/San%20Miguel%20de%20Allende.png",
    etiquetas: ["Colonial", "Mexico", "Cultura"],
  },
  {
    nombre: "Waterloo",
    pais: "Canada",
    emoji: "🍁",
    resumen: "Un lugar asociado con tranquilidad, estudio y un ritmo mas sereno.",
    descripcion:
      "Waterloo representa una experiencia mas calmada, con un entorno ordenado y una sensacion distinta a la de una gran metropoli. Tiene una imagen muy limpia y agradable.",
    color: "linear-gradient(135deg, #4b79a1 0%, #7db7d8 100%)",
    imagen: "/Waterloo.png",
    etiquetas: ["Canada", "Tranquilo", "Recorrido"],
  },
  {
    nombre: "CDMX",
    pais: "Mexico",
    emoji: "🌮",
    resumen: "Una ciudad enorme, dinamica y llena de actividad en todo momento.",
    descripcion:
      "La Ciudad de Mexico ofrece una mezcla de movimiento, gastronomia, cultura y espacios emblematicos. Es un destino muy completo por la variedad de experiencias que concentra.",
    color: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
    etiquetas: ["Ciudad", "Gastronomia", "Mexico"],
  },
];

const contenedorDestinos = document.getElementById("destinos");
const contenedorSellos = document.getElementById("travel-stamps");
const contenidoModal = document.getElementById("contenido_modal");

function renderizarSellos() {
  contenedorSellos.innerHTML = destinos
    .map((destino) => `<span class="stamp">${destino.nombre}</span>`)
    .join("");
}

function abrirModal() {
  document.getElementById("modal-destino").classList.add("is-active");
}

function cerrarModal() {
  document.getElementById("modal-destino").classList.remove("is-active");
}

function mostrarDestinoEnModal(destino) {
  contenidoModal.innerHTML = `
    <p class="title is-3 mb-2">${destino.emoji} ${destino.nombre}</p>
    <p class="subtitle is-6 mb-4">${destino.pais}</p>
    <div class="mb-4">
      ${destino.etiquetas.map((etiqueta) => `<span class="tag is-light">${etiqueta}</span>`).join("")}
    </div>
    <p class="mb-3">${destino.descripcion}</p>
    <p class="has-text-grey">${destino.resumen}</p>
  `;

  abrirModal();
}

function crearTarjeta(destino) {
  const tarjeta = document.createElement("button");
  tarjeta.className = "travel-card";
  tarjeta.type = "button";
  const visualClass = destino.imagen ? "travel-visual has-image" : "travel-visual";
  const visualContenido = destino.imagen
    ? `
    <img class="travel-photo" src="${destino.imagen}" alt="${destino.nombre}">
    <div class="travel-overlay"></div>
    <div class="travel-visual-inner">
      <span class="travel-country">${destino.pais}</span>
      <span class="travel-emoji">${destino.emoji}</span>
    </div>
  `
    : `
    <div class="travel-visual-inner">
      <span class="travel-country">${destino.pais}</span>
      <span class="travel-emoji">${destino.emoji}</span>
    </div>
  `;

  tarjeta.innerHTML = `
    <div class="${visualClass}" style="background:${destino.color}">
      ${visualContenido}
    </div>
    <div class="travel-content">
      <p class="title is-4 mb-2">${destino.nombre}</p>
      <p>${destino.resumen}</p>
    </div>
  `;

  tarjeta.addEventListener("click", () => {
    mostrarDestinoEnModal(destino);
  });

  const imagen = tarjeta.querySelector(".travel-photo");
  if (imagen) {
    imagen.addEventListener("error", () => {
      imagen.remove();
      const overlay = tarjeta.querySelector(".travel-overlay");
      if (overlay) {
        overlay.remove();
      }
    });
  }

  return tarjeta;
}

function renderizarDestinos() {
  destinos.forEach((destino) => {
    contenedorDestinos.appendChild(crearTarjeta(destino));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarSellos();
  renderizarDestinos();

  document.querySelectorAll(".modal-background, .modal-close").forEach((elemento) => {
    elemento.addEventListener("click", cerrarModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      cerrarModal();
    }
  });
});
