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

app.get('/v1/data', (req, res) => {
    sql.connect(dbConfig).then(() => {
        return sql.query`select * from test`
    }).then(result => {
        res.status(200).send({
            success: true,
            message: 'data retrieved successfully',
            data: result
        })
        sql.close();
    }).catch(err => {
        res.status(200).send({
            success: false,
            message: 'error'
        })
        console.log(err);
        sql.close();
    })

    sql.on('error', err => {
        res.status(200).send({
            success: false,
            message: 'connection error'
        })
        console.log(err);
        sql.close();
    })
});

app.get('/v1/sorted', (req, res) => {
    sql.connect(dbConfig).then(() => {
        return sql.query`select * from sortedDB_test`
    }).then(result => {
        res.status(200).send({
            success: true,
            message: 'sorted data retrieved successfully',
            data: result
        })
        sql.close();

    }).catch(err => {
        res.status(200).send({
            success: false,
            message: 'error'
        })
        console.log(err);
        sql.close();
    })

    sql.on('error', err => {
        res.status(200).send({
            success: false,
            message: 'connection error'
        })
        console.log(err);
        sql.close();
    })
});

app.get('/v1/login', (req, res) => {

    let email = req.query.email;
    let password = req.query.password;

    sql.connect(dbConfig).then(() => {
        return sql.query`select * from users`
    }).then(result => {

        let users = result.recordset;
        let auth = false;

        for(let i = 0; i < users.length; i++) {

            let user = users[i];
            if (user.Email === email && user.Password === password) {
                auth = true;
                break;
            }
        }

        res.status(200).send({
            success: auth
        })

        sql.close();
        
    }).catch(err => {
        res.status(200).send({
            success: false,
            message: 'error'
        })
        console.log(err);
        sql.close();
    })

    sql.on('error', err => {
        res.status(200).send({
            success: false,
            message: 'connection error'
        })
        console.log(err);
        sql.close();
    })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});