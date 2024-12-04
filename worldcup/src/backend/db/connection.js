const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'bigT3CHZ0N3',
    database: 'world_cup',
});

module.exports = pool;
