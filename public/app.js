const boton = document.getElementById("boton");
const mensaje = document.getElementById("mensaje");
const resultado = document.getElementById("resultado");
const titulo = document.getElementById("titulo");
const autor = document.getElementById("autor");
const imagen = document.getElementById("imagen");
const video = document.getElementById("video");

// Esta funcion pide los datos al servidor
async function cargarDatos() {
  mensaje.textContent = "Cargando...";
  // Pedimos los datos de Vimeo a nuestra ruta
  const respuesta = await fetch("/api/vimeo");
  const datos = await respuesta.json();

  // Si viene un error, lo mostramos
  if (datos.error) {
    mensaje.textContent = datos.error;
    resultado.hidden = true;
  } else {
    // Ponemos los datos en la pagina
    titulo.textContent = datos.title;
    autor.textContent = datos.author_name;
    imagen.src = datos.thumbnail_url;
    video.innerHTML = datos.html;

    mensaje.textContent = "Datos cargados";
    resultado.hidden = false;
  }
}

// Cuando se haga click en el boton, se ejecuta la funcion
boton.addEventListener("click", cargarDatos);
