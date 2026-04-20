const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Esto hace que Express pueda mostrar los archivos de la carpeta public
app.use(express.static(path.join(__dirname, "public")));

// Esta ruta consulta el API de Vimeo
app.get("/api/vimeo", async (_req, res) => {
  try {
    // Hacemos la peticion al API
    const respuesta = await fetch(
      "https://vimeo.com/api/oembed.json?url=https://vimeo.com/76979871"
    );

    // Convertimos la respuesta a json
    const datos = await respuesta.json();

    // Mandamos los datos al frontend
    res.json(datos);
  } catch (error) {
    // Si algo falla, mandamos un mensaje de error
    res.json({
      error: "No se pudo conectar con Vimeo",
    });
  }
});

// Encendemos el servidor
app.listen(PORT, () => {
  console.log("Servidor en http://localhost:3000");
});
