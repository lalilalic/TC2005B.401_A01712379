// Importamos los modelos de Destino y Continente 
const Destino = require('../models/destino.model');
const Continente = require('../models/continente.model');

// Muestra el formulario para agregar un nuevo destino
exports.get_add = (request, response, next) => {
    // Obtenemos todos los continentes para mostrarlos en el select del formulario
    Continente.fetchAll().then(([rows, fieldData]) => {
        response.render('new', {
            edit: false, // Le decimos a la vista que es un formulario de creación, no edición
            csrfToken: request.csrfToken(), // Token de seguridad contra ataques CSRF
            username: request.session.username || '', // Usuario de la sesión activa
            continentes: rows, // Lista de continentes para el select
        });
    }).catch((error) => {next(error)});
};

// Recibe los datos del formulario y guarda el nuevo destino
exports.post_add = (request, response, next) => {
    console.log(request.file); // Verificamos que la imagen llegó correctamente
    
    // Creamos el objeto Destino con los datos del formulario
    const destino = new Destino(
        request.body.nombre,       // Nombre del destino ej: "París"
        request.body.descripcion,  // Descripción del viaje o lugar
        request.body.continente,   // Continente al que pertenece
        request.file ? request.file.filename : request.body.imagen // Si no subió imagen nueva, conserva la anterior
    );

    // Guardamos en la base de datos y redirigimos a la lista
    destino.save().then(() => {
        return response.redirect('/destinos');
    }).catch((error) => {next(error)});
};

