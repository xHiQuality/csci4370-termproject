const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'samantha1234',
    database: 'world_cup',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


module.exports = pool;