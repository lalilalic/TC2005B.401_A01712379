const db = require('../util/database');

module.exports = class Personaje {

    //Constructor de la clase. Sirve para crear un nuevo objeto, y en él se definen las propiedades del modelo
    constructor(mi_nombre, mi_descripcion, mi_tipo, mi_imagen, mi_id = null) {
        this.nombre = mi_nombre;
        this.descripcion = mi_descripcion;
        this.tipo = mi_tipo;
        this.imagen = mi_imagen;
        this.id = mi_id;
    }

    //Este método servirá para guardar de manera persistente el nuevo objeto. 
    save() {
        return db.execute(
            'INSERT INTO personajes(nombre, descripcion, tipo_id, imagen) values (?, ?, ?, ?)', 
            [this.nombre, this.descripcion, this.tipo, this.imagen]
        );
    }

    update() {
        return db.execute(
            'UPDATE personajes SET nombre = ?, descripcion = ?, tipo_id = ?, imagen = ? WHERE id = ?',
            [this.nombre, this.descripcion, this.tipo, this.imagen, this.id]
        );
    }

    //Este método servirá para devolver los objetos del almacenamiento persistente.
    static fetchAll() {
        return db.execute('SELECT * FROM personajes');
    }

    static fetchOne(id) {
        return db.execute('SELECT * FROM personajes WHERE id = ?', [id]);
    }

    static fetch(id) {
        if (id) {
            return this.fetchOne(id);
        } else {
            return this.fetchAll();
        }
    }

}
