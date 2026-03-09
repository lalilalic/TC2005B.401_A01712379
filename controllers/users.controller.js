const User = require("../models/user.model");

exports.get_login = (request, response, next) => {
    response.render('login', {
        username: request.session.username || '',
    });
};

exports.post_login = (request, response, next) => {
    request.session.username = request.body.username;
    response.redirect('/personajes');
};

exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        response.redirect('/users/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};

exports.get_signup = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('signup', {
        username: request.session.username || '',
        error: error,
    })
};

exports.post_signup = (request, response, next) => {
    if (request.body.password != request.body.password_confirm) {
        request.session.error = 'Las contraseñas no coinciden';
        return response.redirect('/users/signup');
    } else {
        const user = new User(
            request.body.username, request.body.nombre, request.body.password, request.body.correo);
        user.save().then(() => {
            return response.redirect('/users/login');
        }).catch((error) => {
            console.log(error);
            next(error);
        });
    }
};