//Import the mssql package
const sql = require('mssql');
const express = require('express');
const cors = require('cors');

//Set up express app
const app = express();
app.use(cors());

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

let status = false;
let message = 'data not loaded';
let dataSet = [];

const getData = () => {
    setTimeout(function () {
        var conn = new sql.ConnectionPool(dbConfig);

        conn.connect()

        .then(function() {
            var req = new sql.Request(conn);

            req.query("SELECT * FROM test")
            .then(function(recordset) {
                status = true;
                message = 'data retrieved successfully';
                dataSet = recordset;
                conn.close();
            })
            //SQL statement execution error
            .catch(function(err) {
                status = false;
                message = 'sql statement error'
                conn.close();
            })
        })
        //Connection error
        .catch(function(err) {
            status = false;
            message = 'connection error'
            console.log(err);
            conn.close()
        });
        getData();
    }, 1000)
}
getData();

app.get('/v1/data', (req, res) => {
    res.status(200).send({
        success: status,
        message: message,
        data: dataSet
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});