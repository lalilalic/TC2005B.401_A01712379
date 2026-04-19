// Importamos el modelo de usuario y bcrypt para comparar contraseñas encriptadas
const User = require("../models/user.model");
const bcrypt = require('bcrypt');

// Muestra el formulario de login
exports.get_login = (request, response, next) => {
    // Recuperamos el error de la sesión (ej: "contraseña incorrecta") y lo limpiamos
    const error = request.session.error || '';
    request.session.error = '';

    response.render('login', {
        csrfToken: request.csrfToken(), // Token de seguridad contra CSRF
        error: error,                   // Mensaje de error si hubo uno
        username: request.session.username || '', // Usuario en sesión si ya estaba logueado
    }); 
};
