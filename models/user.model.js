const db = require('../util/database');

module.exports = class User {

    constructor(mi_username, mi_nombre, mi_password, mi_correo) {
        this.username = mi_username;
        this.nombre = mi_nombre;
        this.password = mi_password;
        this.correo = mi_correo;
    }

    save() {
        
    }
    
    static fetchOne(username) {
        
    }

}