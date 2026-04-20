const db = require('../util/database');

module.exports = class Continente {
    // Solo necesitamos traer todos los continentes para el select del formulario
    static fetchAll() {
        return db.execute('SELECT * FROM continentes');
    }
}