const db = require('../util/database');

module.exports = class Destino {
    // Constructor que define las propiedades de un destino
    constructor(mi_nombre, mi_descripcion, mi_continente, mi_imagen) {
        this.nombre = mi_nombre;
        this.descripcion = mi_descripcion;
        this.continente = mi_continente;
        this.imagen = mi_imagen;
    }

    // Guarda un nuevo destino en la base de datos
    save() {
        return db.execute(
            'INSERT INTO destinos(nombre, descripcion, continente_id, imagen) VALUES (?, ?, ?, ?)',
            [this.nombre, this.descripcion, this.continente, this.imagen]
        );
    }

    // Regresa todos los destinos
    static fetchAll() {
        return db.execute('SELECT * FROM destinos');
    }

    // Regresa un destino por su id
    static fetchOne(id) {
        return db.execute('SELECT * FROM destinos WHERE id = ?', [id]);
    }

    // Si recibe id busca uno, si no regresa todos
    static fetch(id) {
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }

    // Actualiza un destino existente en la base de datos
    static edit(id, nombre, descripcion, continente, imagen) {
        return db.execute(
            'UPDATE destinos SET nombre=?, descripcion=?, continente_id=?, imagen=? WHERE id=?',
            [nombre, descripcion, continente, imagen, id]
        );
    }
}