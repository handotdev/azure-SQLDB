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

// Raw Data
let status = false;
let message = 'data not loaded';
let dataSet = [];

// Sorted Data
let sortedStatus = false;
let sortedMessage = 'sorted data not loaded';
let sortedDataSet = [];

// Login
let login = false;
let usersData = [];

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
                // SQL statement execution error
                .catch(function(err) {
                    console.log(err);
                    conn.close();
                });
            req.query("SELECT * FROM users")
                .then(function(usersset) {
                    login = true;
                    usersData = usersset;
                    conn.close();
                })
                .catch(function(err) {
                    console.log(err);
                    conn.close();
                });
            req.query("SELECT * FROM sortedDB_test")
                .then(function(sortedset) {
                    sortedStatus = true;
                    sortedMessage = 'sorted data retrieved successfully';
                    sortedDataSet = sortedset;
                    conn.close();
                })
                .catch(function(err) {
                    console.log(err);
                    conn.close();
                });
        })
        //Connection error
        .catch(function(err) {
            status = false;
            message = 'connection error';
            console.log(err);
            conn.close();
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

app.get('/v1/sorted', (req, res) => {
    res.status(200).send({
        success: sortedStatus,
        message: sortedMessage,
        data: sortedDataSet
    })
});

app.get('/v1/login', (req, res) => {

    let username = req.query.username;
    let password = req.query.password;

    let users = usersData.recordset;

    for(let i = 0; i < users.length; i++) {

        let user = users[i];

        if (user.Email === username && user.Password === password) {
            res.status(200).send({
                success: true
            });
            break;
        }
    }

    res.status(200).send({
        success: false
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});