// Import the mssql package
const sql = require("mssql");

var dbConfig = {
    server: "foodful.database.windows.net",
    database: "Database",
    user: "foodful",
    password: "DreamTeam2019",
    port: 1433,

    options: {
        encrypt: true
    }
};

const getData = () => {
    var conn = new sql.ConnectionPool(dbConfig);

    conn.connect()

    .then(function() {
        var req = new sql.Request(conn);

        req.query("SELECT * FROM test")
        .then(function(recordset) {
            console.log(recordset);
            conn.close();
        })
        //SQL statement execution error
        .catch(function(err) {
            console.log(err);
            conn.close();
        })
    })
    //Connection error
    .catch(function(err) {
        console.log(err);
        conn.close()
    });

}

getData();