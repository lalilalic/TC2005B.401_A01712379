module.exports = (request, response, next) => {
    let continuar = true;
    for (let permiso of request.session.permisos) {
        // Verificamos si el usuario tiene permiso para crear destinos
        if (permiso.nombre_privilegio == 'crear_destinos') {
            continuar = false;
            next();
        }
    }
    if (continuar) {
        request.session.error = 
            "No tiene autorizada esta parte de la aplicación, este incidente ha sido reportado.";
        return response.redirect('/users/login');
    }
};