var mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    database: "world_cup"
})

async function loadTeams(con) {
    return new Promise((resolve, reject) => {
        con.connect(function(err) {
            if (err) return reject(err);
            
            con.query("SELECT country_name FROM teams", function(err, result, fields) {
                if (err) {
                    con.end();
                    return reject(err);
                }
                con.end();
                resolve(result);
            });
        });
    });
}

// Example usage
(async () => {
    try {
        const teams = await loadTeams(con);
        console.log(teams);
    } catch (error) {
        console.error('Error loading teams:', error);
    }
})();


