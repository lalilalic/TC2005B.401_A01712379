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

// Recibe los datos del formulario de login y verifica si el usuario existe
exports.post_login = (request, response, next) => {
    // Buscamos el usuario en la base de datos por su username
    User.fetchOne(request.body.username).then(([usuarios, fieldData]) => {

        if (usuarios.length > 0) {
            // Si existe el usuario se comparam la contraseña ingresada con la encriptada en BD
            bcrypt.compare(request.body.password, usuarios[0].password).then((doMatch) => {
                
                if(doMatch) {
                    // Contraseña correcta lo guardamos en sesión que está logueado
                    request.session.isLoggedIn = true;
                    request.session.username = request.body.username;

                    // Obtenemos los permisos del usuario para controlar qué puede ver/hacer
                    User.getPermisos(request.body.username).then(([permisos, fieldData]) => {
                        request.session.permisos = permisos;

                        // Guardamos la sesión antes de redirigir para no perder los datos
                        return request.session.save(() => {
                            return response.redirect('/destinos'); // Redirigimos a la lista de destinos
                        }); 
                    }).catch((error) => {
                        console.log(error);
                        next(error);
                    });

              } else {
                    // Contraseña incorrecta se lo mandamos error y regresamos al login
                    request.session.error = "Usuario y/o contraseña no coinciden";
                    return response.redirect('/users/login');
                }
            }).catch((error) => {
                console.log(error);
                next(error);
            });

        } else {
            // Usuario no encontrado por ello el mismo mensaje para no revelar si existe o no
            request.session.error = "Usuario y/o contraseña no coinciden";
            return response.redirect('/users/login');
        }
    }).catch((error) => {
        console.log(error);
        next(error);
    });
};

// Cierra la sesión del usuario eliminando todos sus datos de sesión
exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        // Una vez destruida la sesión, mandamos al login
        response.redirect('/users/login');
    });
};

// Muestra el formulario de registro de nuevo usuario
exports.get_signup = (request, response, next) => {
    // Recuperamos error de sesión  y luego  limpiamos
    const error = request.session.error || '';
    request.session.error = '';

    response.render('signup', {
        csrfToken: request.csrfToken(),
        username: request.session.username || '',
        error: error,
    });
};

// Recibe los datos del formulario de registro y crea el nuevo usuario
exports.post_signup = (request, response, next) => {
    // Validamos que las contraseñas coincidan antes de guardar
    if (request.body.password != request.body.password_confirm) {
        request.session.error = 'Las contraseñas no coinciden';
        return response.redirect('/users/signup');
    } else {
        // Creamos el objeto User con los datos del formulario
        const user = new User(
            request.body.username,  // Nombre de usuario unico
            request.body.nombre,    // Nombre real del usuario
            request.body.password,  // Contraseña 
            request.body.correo     // Correo electrónico
        );

        // Guardamos el usuario y redirigimos al login para que inicie sesión
        user.save().then(() => {
            return response.redirect('/users/login');
        }).catch((error) => {
            console.log(error);
            next(error);
        });
    }
};