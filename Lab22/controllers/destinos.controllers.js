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
