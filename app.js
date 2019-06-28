// Import modules
const sql = require('mssql');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');

// Set up express app
const app = express();
app.use(cors());

// Bcrypt settings
const saltRounds = 10;

// Email settings
sgMail.setApiKey('SG.-S_BbBRMRLyyIkjGFQQqwg.L_NHq1UU1ZcBBnJJie9LbgZymyNSbhSJJURLwoGXdJs');

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
        return sql.query`SELECT * FROM test`
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

        let userData = null;

        for(let i = 0; i < users.length; i++) {

            let user = users[i];
            if (user.Email === email && bcrypt.compareSync(password, user.Password)) {
                auth = true;
                userData = user;
            }
        }

        res.status(200).send({
            success: auth,
            user: userData
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

app.post('/v1/register', (req, res) => {
    let name = req.query.name;
    let email = req.query.email;
    let password = req.query.password;

    let farmID = 'test';

    bcrypt.hash(password, saltRounds, function(err, hash) {
        sql.connect(dbConfig).then(() => {
            return sql.query`INSERT INTO users VALUES (${email}, ${hash}, ${farmID}, ${name})`
        }).then(result => {
            console.log(result);
            sql.close();
        }).catch(err => {
            console.log(err);
            sql.close();
        })
    });
});

app.post('/email', (req, res) => {
    let msg = req.query.msg;

    if (msg) {
        const email = {
            to: 'han@foodful.farm',
            from: 'signup@foodful.farm',
            subject: 'Website Sign Up',
            html: `${msg}`,
          };
        sgMail.send(email)
          .then(() => {console.log('email sent')}).catch(()=> {console.log('email failed')});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});