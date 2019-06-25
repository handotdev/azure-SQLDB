//Import the mssql package
const sql = require("mssql");
const express = require('express');

//Set up express app
const app = express();

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

let dataSet = [];

const getData = () => {
    setTimeout(function () {
        var conn = new sql.ConnectionPool(dbConfig);

        conn.connect()

        .then(function() {
            var req = new sql.Request(conn);

            req.query("SELECT * FROM test")
            .then(function(recordset) {
                dataSet = recordset;
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
        getData();
    }, 1000)
}
getData();

app.get('/api/v1/data', (req, res) => {
    res.status(200).send({
        success: true,
        message: 'data retrieved successfully',
        data: dataSet
    })
    console.log(dataSet);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});