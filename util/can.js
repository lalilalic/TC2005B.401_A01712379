module.exports = (permiso_requerido) => {
    return (request, response, next) => {
        let continuar = true;
        for (let permiso of request.session.permisos || []) {
            if (permiso.nombre_privilegio == permiso_requerido) {
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
};
