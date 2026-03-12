const db = require('../util/database');
const bcrypt = require('bcrypt');

module.exports = class User {

    constructor(mi_username, mi_nombre, mi_password, mi_correo) {
        this.username = mi_username;
        this.nombre = mi_nombre;
        this.password = mi_password;
        this.correo = mi_correo;
    }

    save() {
        return bcrypt.hash(this.password, 12).then((password_cifrado) => {
            return db.execute(
                "INSERT INTO usuarios(username, nombre, password, correo) VALUES (?, ?, ?, ?)" ,
                [this.username, this.nombre, password_cifrado, this.correo]
            ).then(() => {
                return db.execute(
                    "INSERT INTO tiene(id_usuario, id_rol) VALUES (?, ?)",
                    [this.username, 1]
                );
            });
        }).catch((error) => {
            console.log(error);
            throw error;
        });
    }
    
    static fetchOne(username) {
        return db.execute("SELECT * FROM usuarios WHERE username = ?", [username]);
    }

    static getPermisos(username) {
        return db.execute(
            `SELECT DISTINCT nombre_privilegio FROM tiene t, roles r, posee p, privilegios pr
            WHERE id_usuario = ? AND t.id_rol=r.id AND r.id=p.id_rol AND p.id_privilegio=pr.id`, 
            [username]);
    }

    static getRoles(username) {
        return db.execute(
            `SELECT DISTINCT nombre_rol FROM tiene t, roles r
            WHERE t.id_usuario = ? AND t.id_rol = r.id`,
            [username]
        );
    }

    static fetchUsuariosRoles() {
        return db.execute(
            `SELECT u.username, u.nombre, r.id AS id_rol, r.nombre_rol
            FROM usuarios u
            LEFT JOIN tiene t ON u.username = t.id_usuario
            LEFT JOIN roles r ON t.id_rol = r.id
            ORDER BY u.username, r.nombre_rol`
        );
    }

    static fetchRoles() {
        return db.execute("SELECT * FROM roles ORDER BY nombre_rol");
    }

    static fetchPrivilegios() {
        return db.execute("SELECT * FROM privilegios ORDER BY nombre_privilegio");
    }

    static fetchRolesPrivilegios() {
        return db.execute(
            `SELECT r.id AS id_rol, r.nombre_rol, p.id AS id_privilegio, p.nombre_privilegio
            FROM roles r
            LEFT JOIN posee po ON r.id = po.id_rol
            LEFT JOIN privilegios p ON po.id_privilegio = p.id
            ORDER BY r.nombre_rol, p.nombre_privilegio`
        );
    }

    static addRolUsuario(username, id_rol) {
        return db.execute(
            "INSERT IGNORE INTO tiene(id_usuario, id_rol) VALUES (?, ?)",
            [username, id_rol]
        );
    }

    static addPrivilegioRol(id_rol, id_privilegio) {
        return db.execute(
            "INSERT IGNORE INTO posee(id_rol, id_privilegio) VALUES (?, ?)",
            [id_rol, id_privilegio]
        );
    }

}
