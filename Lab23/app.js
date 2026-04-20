const express = require('express');
const app = express();
const path = require("path");

// use __dirname para que agarre bien las carpetas aunque corra desde otra ruta
app.use(express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static(path.join(__dirname, 'public')));
// esto lo puse para que si cargara mi css local
app.use('/css', express.static(path.join(__dirname, 'css')));

// Configuramos EJS como motor de vistas
app.set('view engine', 'ejs');
// con esto ya encontro bien las vistas de lab23
app.set('views', path.join(__dirname, 'views'));

// Configuración de sesiones
const session = require('express-session');
app.use(session({
    secret: 'mi string secreto que debe ser un string aleatorio muy largo, no como éste', 
    resave: false, // La sesion no se guardara en cada peticion sino que solo si algo cambio
    saveUninitialized: false, // No se guarda sesión para peticiones que no lo necesitan
}));

// bodyParser para leer datos de formularios
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

// Configuracion de multer para subida de imágenes
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (request, file, callback) => {
        // aqui tambien use __dirname para que no se perdiera la ruta
        callback(null, path.join(__dirname, 'public/uploads'));
    },
    filename: (request, file, callback) => {
        // Concatenamos timestamp para evitar conflictos si dos imagenes tienen el mismo nombre
        callback(null, new Date().getMilliseconds() + '-' + file.originalname);
    },
});

// Filtramos para aceptar solo imagenes png, jpg y jpeg
const fileFilter = (request, file, callback) => {
    if (file.mimetype == 'image/png' || 
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg') {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

// Registramos multer con la configuración de almacenamiento y filtro  'imagen' es el name del input type file en el formulario
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('imagen'));

// Proteccion de CSRF para todos los formularios
const csrf = require('csurf');
const csrfProtection = csrf();
app.use(csrfProtection);

// Rutas de usuarios (login, signup, logout)
const rutas_usuarios = require('./routes/users.routes');
app.use('/users', rutas_usuarios);

// Rutas de destinos (listar, crear, editar)
const rutas_destinos = require('./routes/destinoss.routes');
app.use('/destinos', rutas_destinos);

// esta ruta la puse para que localhost no mande error
app.get('/', (request, response) => {
    if (request.session.isLoggedIn) {
        return response.redirect('/destinos');
    }
    return response.redirect('/users/login');
});

// Middleware de manejo de errores internos
app.use((error, request, response, next) => {
    response.status(500).send(`Error interno del servidor: ${error.stack}`);
});

// Middleware para rutas no encontradas
app.use((request, response, next) => {
    response.status(404).send("La ruta no existe");
});

// lo deje asi para poder usar otro puerto si 3000 ya estaba ocupado
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
