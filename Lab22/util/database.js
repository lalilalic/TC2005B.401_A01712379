const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'viajes', // cambiamos lol por viajes
    password: '',
});

module.exports = pool.promise();