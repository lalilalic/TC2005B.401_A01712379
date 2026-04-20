// Importamos los modelos de Destino y Continente 
const Destino = require('../model/destino.model');
const Continente = require('../model/continente.model');

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
    console.log(request.file); // Verificar si la imagen llego 
    
    // Creamos el objeto Destino con los datos del formulario
    const destino = new Destino(
        request.body.nombre,       // Nombre del destino 
        request.body.descripcion,  // Descripción del viaje o lugar
        request.body.continente,   // Continente al que pertenece

        request.file ? request.file.filename : request.body.imagen // Si no subió imagen nueva, conserva la anterior
    );

    // Guardamos en la base de datos y redirigimos a la lista
    destino.save().then(() => {
        return response.redirect('/destinos');
    }).catch((error) => {next(error)});
};

// Muestra la lista de destinos
exports.get_list = (request, response, next) => {
    console.log(request.session.permisos); // Revisamos qué permisos tiene el usuario

    // Traemos los destinos de la base de datos
    Destino.fetch(request.params.destino_id).then(([rows, fieldData]) => {
        return response.render('list', {
            permisos: request.session.permisos || [], // Permisos para mostrar u ocultar botones en la vista
            username: request.session.username || '', // Nombre del usuario en sesión
            destinos: rows, // Lista de destinos a mostrar
        }); 
    }).catch((error) => {
        next(error);
    });
};

// Muestra el formulario de edición con los datos actuales del destino
exports.get_edit = (request, response, next) => {
    // Primero buscamos el destino que se quiere editar
    Destino.fetchOne(request.params.destino_id).then(([destino, fieldData]) => {
        console.log(destino[0]); // Verificamos que encontró el destino correcto

        // Luego traemos los continentes para el select del formulario
        Continente.fetchAll().then(([rows, fieldData]) => {
            response.render('new', {
                edit: true,           // Le decimos a la vista que es edición
                destino: destino[0],  // Los datos actuales del destino
                csrfToken: request.csrfToken(),
                username: request.session.username || '',
                continentes: rows,    // Continentes para el select
            });
        }).catch((error) => {next(error)});
    }).catch((error) => {next(error)});
};

// Recibe los datos editados y actualiza el destino en la base de datos
exports.post_edit = (request, response, next) => {
    // Si se subió una nueva imagen la usamos, si no conservamos la que ya tenía
    const imagen = request.file ? request.file.filename : request.body.imagen;

    Destino.edit(
        request.body.id,          // ID del destino a editar
        request.body.nombre,      // Nuevo nombre
        request.body.descripcion, // Nueva descripción
        request.body.continente,  // Nuevo continente
        imagen                    // Imagen nueva o la que ya tenía
    ).then(() => {
        return response.redirect('/destinos');
    }).catch((error) => {next(error)});
};

// Busca destinos y regresa los resultados en formato JSON para AJAX
exports.get_buscar = (request, response, next) => {
    Destino.buscar(request.params.busqueda).then(([destinos, fieldData]) => {
        // Regresamos los destinos en JSON en lugar de renderizar una vista
        return response.status(200).json({destinos: destinos});
    }).catch((error) => {
        return response.status(500).json({message: error.stack});
    });
}