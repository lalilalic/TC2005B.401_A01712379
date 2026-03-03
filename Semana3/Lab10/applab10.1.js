const http = require("http");
const fs = require("fs");

const personajes = [
    {
        nombre: "Gwen",
        descripcion: `Gwen, una antigua muneca que se transformo y cobro vida a traves de la magia,
            usa las mismas herramientas que en su momento la crearon.
            Lleva el peso del amor de su creadora a cada paso, sin dar nada por sentado.
            Bajo su mando esta la Niebla Sagrada, una magia antigua y protectora que bendijo las tijeras,
            las agujas y el hilo de coser de Gwen. Muchas cosas son nuevas para Gwen,
            pero sigue decidida a luchar con gozo por el bien que prevalece en un mundo roto.`,
        tipo: "mago",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Gwen_0.jpg",
    },
    {
        nombre: "Mordekaiser",
        descripcion: `Mordekaiser es un senor de la guerra nigromante que domina el carril superior con
            dano magico sostenido, gran aguante y una definitiva que aisla a enemigos en su "reino de la muerte".
            Destaca por su pasiva de dano en area, su maza Ocaso y su capacidad para robar estadisticas,
            siendo popular por su contundencia.`,
        tipo: "tanque",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Mordekaiser_0.jpg",
    },
    {
        nombre: "Jax",
        descripcion: `Inigualable tanto en sus habilidades de armamentos unicos como en su mordaz sarcasmo,
            Jax es el ultimo maestro de armas conocido de Icathia.
            Despues de que su tierra natal fue destruida por su propia arrogancia al desencadenar el Vacio,
            Jax y su especie juraron proteger lo poco que quedo. Mientras la magia aumenta en el mundo,
            la amenaza durmiente se agita una vez mas, y Jax vaga por Valoran, portando la ultima luz de
            Icathia y poniendo a prueba a todos los guerreros que conoce para ver si son suficientemente
            fuertes para erguirse a su lado...`,
        tipo: "tanque",
        imagen: "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jax_0.jpg",
    },
];

const html_header = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>League of Legends</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css">
  </head>
  <body>
  <section class="section">
    <div class="container">
      <h1 class="title">
        <a href="/">League of Legends</a>
      </h1>
        <p class="subtitle">
            Practica de rutas y formularios
        </p>
`;

const html_footer = `
    </div>
  </section>
  </body>
</html>
`;

const html_form = `
    <form action="/new" method="POST">
        <div class="field">
            <label for="nombre" class="label">Nombre</label>
            <div class="control">
                <input id="nombre" name="nombre" class="input" type="text" placeholder="e.g Vi" required>
            </div>
        </div>

        <div class="field">
            <label for="descripcion" class="label">Descripcion</label>
            <div class="control">
                <input id="descripcion" name="descripcion" class="input" type="text" placeholder="e.g. Criada en las calles salvajes de Zaun..." required>
            </div>
        </div>

        <div class="field">
            <label for="tipo" class="label">Tipo</label>
            <div class="control">
                <input id="tipo" name="tipo" class="input" type="text" placeholder="e.g. Peleador" required>
            </div>
        </div>

        <div class="field">
            <label for="imagen" class="label">Imagen</label>
            <div class="control">
                <input id="imagen" name="imagen" class="input" type="url" placeholder="e.g. https://..." required>
            </div>
        </div>

        <input class="button is-primary" type="submit" value="Guardar personaje">
    </form>
`;

const html_menu = `
    <div class="buttons">
        <a class="button is-primary" href="/new">Nuevo personaje</a>
        <a class="button is-link" href="/personajes">Ver personajes (JSON)</a>
    </div>
`;

const server = http.createServer((request, response) => {
    if (request.url === "/" && request.method === "GET") {
        let html_index = `
            ${html_menu}
            <div class="columns is-multiline">
        `;

        for (const personaje of personajes) {
            html_index += `
                <div class="column is-one-third">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-4by3">
                                <img src="${personaje.imagen}" alt="${personaje.nombre}">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="title is-5">${personaje.nombre}</p>
                            <p><strong>Tipo:</strong> ${personaje.tipo}</p>
                        </div>
                    </div>
                </div>
            `;
        }

        html_index += `
                </div>
            </div>
        </section>
        `;

        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html_header + html_index + html_footer);
    } else if (request.url === "/new" && request.method === "GET") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html_header + html_menu + html_form + html_footer);
    } else if (request.url === "/personajes" && request.method === "GET") {
        response.statusCode = 200;
        response.setHeader("Content-Type", "application/json; charset=utf-8");
        response.end(JSON.stringify(personajes, null, 2));
    } else if (request.url === "/new" && request.method === "POST") {
        const datos_completos = [];

        request.on("data", (data) => {
            datos_completos.push(data);
        });

        request.on("end", () => {
            const body = Buffer.concat(datos_completos).toString();
            const params = new URLSearchParams(body);

            const nuevoPersonaje = {
                nombre: params.get("nombre") || "",
                descripcion: params.get("descripcion") || "",
                tipo: params.get("tipo") || "",
                imagen: params.get("imagen") || "",
            };

            personajes.push(nuevoPersonaje);

            const linea = `${new Date().toISOString()} | ${JSON.stringify(nuevoPersonaje)}\n`;

            fs.appendFile("personajes.txt", linea, (error) => {
                response.setHeader("Content-Type", "text/html; charset=utf-8");

                if (error) {
                    response.statusCode = 500;
                    response.end(html_header + "<p>Error al guardar en personajes.txt</p>" + html_footer);
                    return;
                }

                response.statusCode = 200;
                response.end(
                    html_header +
                    `<p>Se guardo el nuevo personaje:</p><pre>${JSON.stringify(nuevoPersonaje, null, 2)}</pre>` +
                    html_menu +
                    html_footer
                );
            });
        });
    } else {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html_header + "<h2 class='title is-4'>404 - Ruta no encontrada</h2>" + html_footer);
    }
});

server.listen(3000, () => {
    console.log("Servidor escuchando en http://localhost:3000");
});