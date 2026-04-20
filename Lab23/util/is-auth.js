// Middleware que verifica si el usuario tiene sesión activa
// Si no está logueado lo manda al login
module.exports = (request, response, next) => {
    if (!request.session.isLoggedIn) {
        return response.redirect('/users/login');
    }
    next();
};