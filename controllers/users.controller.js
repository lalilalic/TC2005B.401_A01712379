const User = require("../models/user.model");
const bcrypt = require('bcryptjs');

exports.get_login = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        error: error,
        username: request.session.username || '',
    }); 
};

exports.post_login = (request, response, next) => {
    User.fetchOne(request.body.username).then(([rows, fieldData]) => {
        if (rows.length > 0) {
            bcrypt.compare(request.body.password, rows[0].password).then((doMatch) => {
                if(doMatch) {
                    request.session.isLoggedIn = true;
                    request.session.user = {
                        username: rows[0].username,
                        nombre: rows[0].nombre,
                        correo: rows[0].correo,
                    };
                    request.session.username = rows[0].username;
                    return request.session.save(() => {
                        return response.redirect('/personajes');
                    }); 
                } else {
                    request.session.error = "Usario y/o contraseña no coinciden";
                    return response.redirect('/users/login');
                }
            }).catch((error) => {
                console.log(error);
                next(error);
            });
        } else {
            request.session.error = "Usario y/o contraseña no coinciden";
            return response.redirect('/users/login');
        }
    }).catch((error) => {
        console.log(error);
        next(error);
    });
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
    }

    User.fetchOne(request.body.username)
        .then(([rows, fieldData]) => {
            if (rows.length > 0) {
                request.session.error = 'El usuario ya existe';
                return response.redirect('/users/signup');
            }

            const user = new User(
                request.body.username,
                request.body.nombre,
                request.body.password,
                request.body.correo
            );

            return user.save().then(() => {
                return response.redirect('/users/login');
            });
        }).catch((error) => {
            console.log(error);
            next(error);
        });
};
