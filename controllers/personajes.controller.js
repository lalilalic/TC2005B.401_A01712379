const Personaje = require('../models/personaje.model');
const Tipo = require('../models/tipo.model');

exports.get_add = (request, response, next) => {
    Tipo.fetchAll().then(([rows, fieldData]) => {
        response.render('new', {
            username: request.session.username || '',
            tipos: rows,
            personaje: {
                id: '',
                nombre: '',
                descripcion: '',
                tipo_id: rows.length > 0 ? rows[0].id : '',
                imagen: '',
            },
            editando: false,
        });
    }).catch((error) => {next(error)});
};

exports.post_add = (request, response, next) => {
    const personaje = new Personaje(request.body.nombre, 
        request.body.descripcion, request.body.tipo, request.body.imagen);
    personaje.save().then(() => {
        return response.redirect('/personajes');
    }).catch((error) => {next(error)});
};

exports.get_old = (request, response, next) => {
    const path = require('path');
    response.sendFile(path.join(__dirname, '..', 'old_labs', 'index.html'));
};

exports.get_list = (request, response, next) => {
    console.log(request.session.username);
    Personaje.fetch(request.params.personaje_id).then(([rows, fieldData]) => {
        return response.render('list', {
            username: request.session.username || '',
            personajes: rows,
        }); 
    }).catch((error) => {
        next(error);
    });
};

exports.get_edit = (request, response, next) => {
    Tipo.fetchAll().then(([rows, fieldData]) => {
        Personaje.fetchOne(request.params.personaje_id).then(([personajes, fieldData2]) => {
            if (personajes.length == 0) {
                return response.status(404).send('El personaje no existe');
            }

            response.render('new', {
                username: request.session.username || '',
                tipos: rows,
                personaje: personajes[0],
                editando: true,
            });
        }).catch((error) => {
            next(error);
        });
    }).catch((error) => {
        next(error);
    });
};

exports.post_edit = (request, response, next) => {
    const personaje = new Personaje(
        request.body.nombre,
        request.body.descripcion,
        request.body.tipo,
        request.body.imagen,
        request.body.personaje_id
    );

    personaje.update().then(() => {
        return response.redirect('/personajes');
    }).catch((error) => {
        next(error);
    });
};
