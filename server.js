// Laboratorio 8
// Servidor web basico con Node.js.

const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = 3000;

const tipos = {
  ".css": "text/css; charset=utf-8",
  ".heic": "image/heic",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
};

function resolverRuta(url) {
  if (url === "/") {
    return path.join(__dirname, "old_labs", "index.html");
  }

  if (url === "/js/lol.js") {
    return path.join(__dirname, "old_labs", "js", "lol.js");
  }

  if (url === "/css/lol.css") {
    return path.join(__dirname, "old_labs", "css", "lol.css");
  }

  if (url === "/css/lol.min.css") {
    return path.join(__dirname, "old_labs", "css", "lol.min.css");
  }

  const archivosImagen = [
    "/Madrid.png",
    "/Mallorca.png",
    "/Marruecos.png",
    "/Toronto.png",
    "/Waterloo.png",
    "/San%20Miguel%20de%20Allende.png",
  ];

  if (archivosImagen.includes(url)) {
    return path.join(__dirname, decodeURIComponent(url.slice(1)));
  }

  return null;
}

const server = http.createServer((request, response) => {
  const rutaArchivo = resolverRuta(request.url);

  console.log(`Peticion recibida: ${request.method} ${request.url}`);

  if (!rutaArchivo) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("404 - Recurso no encontrado");
    return;
  }

  try {
    const extension = path.extname(rutaArchivo).toLowerCase();
    const tipo = tipos[extension] || "application/octet-stream";
    const contenido = fs.readFileSync(rutaArchivo);
    response.writeHead(200, { "Content-Type": tipo });
    response.end(contenido);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("500 - Error al leer el archivo solicitado");
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log("Abre esa direccion en el navegador para ver la pagina del laboratorio anterior.");
});
