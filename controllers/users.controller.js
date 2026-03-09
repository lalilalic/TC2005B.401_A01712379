const getCookieValue = (cookieHeader, name) => {
    if (!cookieHeader) {
        return '';
    }

    const cookie = cookieHeader
        .split(';')
        .map((item) => item.trim())
        .find((item) => item.startsWith(`${name}=`));

    if (!cookie) {
        return '';
    }

    return decodeURIComponent(cookie.split('=')[1] || '');
};

const setCookie = (response, cookieValue) => {
    const current = response.getHeader('Set-Cookie');
    if (!current) {
        response.setHeader('Set-Cookie', cookieValue);
        return;
    }

    const cookies = Array.isArray(current) ? current : [current];
    response.setHeader('Set-Cookie', [...cookies, cookieValue]);
};

exports.get_login = (request, response, next) => {
    const flashError = request.session.flashError || '';
    request.session.flashError = '';
    const cookieHeader = request.get('Cookie');
    const lastUsername = getCookieValue(cookieHeader, 'last_username');

    response.render('login', {
        username: request.session.username || lastUsername || '',
        error: flashError,
    });
};

exports.post_login = (request, response, next) => {
    const username = request.body.username ? request.body.username.trim() : '';
    const password = request.body.password ? request.body.password.trim() : '';

    if (!username || !password) {
        request.session.flashError = 'Debes capturar usuario y password.';
        return response.redirect('/users/login');
    }

    request.session.username = request.body.username;
    setCookie(response, `last_username=${encodeURIComponent(username)}; HttpOnly; Max-Age=86400; SameSite=Lax`);
    response.redirect('/personajes');
};

exports.get_logout = (request, response, next) => {
    request.session.destroy(() => {
        setCookie(response, 'last_username=; HttpOnly; Max-Age=0; SameSite=Lax');
        response.redirect('/users/login'); //Este código se ejecuta cuando la sesión se elimina.
    });
};
