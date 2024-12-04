var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "world_cup"
})

con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * from teams", function (err,result,fields) {
        if (err) throw err;
        console.log(result)
    })
    con.end()
})