const db = require('../util/database');
const bcrypt = require('bcrypt');

module.exports = class User {
    // Constructor le define las propiedades de un usuario
    constructor(mi_username, mi_nombre, mi_password, mi_correo) {
        this.username = mi_username;
        this.nombre = mi_nombre;
        this.password = mi_password;
        this.correo = mi_correo;
    }

    // Encripta la contraseña y guarda el usuario en la base de datos
    save() {
        // El 12 es el nivel de encriptación (salt rounds), entre más alto más seguro pero más lento
        return bcrypt.hash(this.password, 12).then((password_cifrado) => {
            return db.execute(
                "INSERT INTO usuarios(username, nombre, password, correo) VALUES (?, ?, ?, ?)",
                [this.username, this.nombre, password_cifrado, this.correo]
            ).then(() => {
                // Rol 1 = viajero, con permiso para ver destinos
                return db.execute(
                    "INSERT INTO tiene(id_usuario, id_rol) VALUES (?, ?)",
                    [this.username, 1]
                );
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    // Busca un usuario por su username para el login
    static fetchOne(username) {
        return db.execute("SELECT * FROM usuarios WHERE username = ?", [username]);
    }

    // Obtiene los permisos del usuario consultando varias tablas relacionadas
    // tiene ---- relaciona usuario con rol
    // roles --- los roles existentes
    // posee ---- relaciona rol con privilegios
    // privilegios ---- acciones que puede hacer el usuario
    static getPermisos(username) {
        return db.execute(
            `SELECT nombre_privilegio FROM tiene t, roles r, posee p, privilegios pr
            WHERE id_usuario = ? AND t.id_rol=r.id AND r.id=p.id_rol AND p.id_privilegio=pr.id`,
            [username]
        );
    }
}
