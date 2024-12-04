const mysql = require('mysql2');


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'samantha1234',
    database: 'world_cup',
});

module.exports = pool;
