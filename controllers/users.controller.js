const User = require("../models/user.model");
const bcrypt = require('bcrypt');

exports.get_login = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    response.render('login', {
        csrfToken: request.csrfToken(),
        error: error,
        permisos: [],
        username: request.session.username || '',
    }); 
};

exports.post_login = (request, response, next) => {
    User.fetchOne(request.body.username).then(([usuarios, fieldData]) => {
        if (usuarios.length > 0) {
            bcrypt.compare(request.body.password, usuarios[0].password).then((doMatch) => {
                if(doMatch) {
                    request.session.isLoggedIn = true;
                    request.session.username = request.body.username;
                    User.getPermisos(request.body.username).then(([permisos, fieldData]) => {
                        request.session.permisos = permisos;
                        return User.getRoles(request.body.username);
                    }).then(([roles, fieldData]) => {
                        request.session.roles = roles;
                        return request.session.save(() => {
                            return response.redirect('/personajes');
                        });
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
        csrfToken: request.csrfToken(),
        permisos: [],
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

exports.get_rbac = (request, response, next) => {
    const error = request.session.error || '';
    request.session.error = '';
    Promise.all([
        User.fetchUsuariosRoles(),
        User.fetchRoles(),
        User.fetchPrivilegios(),
        User.fetchRolesPrivilegios(),
    ]).then((values) => {
        response.render('rbac-admin', {
            csrfToken: request.csrfToken(),
            error: error,
            permisos: request.session.permisos || [],
            username: request.session.username || '',
            usuarios_roles: values[0][0],
            roles: values[1][0],
            privilegios: values[2][0],
            roles_privilegios: values[3][0],
        });
    }).catch((error) => {
        console.log(error);
        next(error);
    });
};

exports.post_asignar_rol = (request, response, next) => {
    User.addRolUsuario(request.body.username, request.body.id_rol).then(() => {
        return response.redirect('/users/rbac');
    }).catch((error) => {
        console.log(error);
        next(error);
    });
};

exports.post_asignar_privilegio = (request, response, next) => {
    User.addPrivilegioRol(request.body.id_rol, request.body.id_privilegio).then(() => {
        return response.redirect('/users/rbac');
    }).catch((error) => {
        console.log(error);
        next(error);
    });
};

exports.get_info = (request, response, next) => {
    response.render('rbac-info', {
        permisos: request.session.permisos || [],
        username: request.session.username || '',
    });
};
