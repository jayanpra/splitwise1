const express = require('express');
const mysql = require('mysql')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const hashFunction = require('password-hash');
const cookieParser = require('cookie-parser');

app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "splitwiseStorage"
})
/*
app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });
*/
app.post('/register',function(req,res) {
    console.log("Its in Here");
    //console.log(req);
    let password = hashFunction.generate(req.body.password);
    let sqlInsert = `INSERT INTO userInfo (email, fname, lname, password) VALUES (\'${req.body.email}\',\'${req.body.fname}\',\'${req.body.lname}\',\'${password}\');`
    db.query(sqlInsert, (err, result) => {
        if (!err){
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Submitted");
        }
        else {
            res.writeHead(204,{
                'Content-Type' : 'text/plain'
            })
            res.end("Issue with data base", err)
        }
    })
});

app.post('/login', function(req,res) {
    let sqlQuery = `SELECT password  FROM userInfo WHERE email=\'${req.body.email}\';`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            if (result.length == 1 && hashFunction.verify(req.body.password, result[0].password)) {
                //res.cookie('cookie',req.body.email,{maxAge: 900000, httpOnly: false, path : '/'});
                //req.session.user = req.body.email;
                console.log("Successfully Verified", result)
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Successful Submitted");
            }
            else {
                res.writeHead(204,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Invalid Credentials")
            }
            
        }
        else {
            console.log(err)
            res.writeHead(204,{
                'Content-Type' : 'text/plain'
            })
            res.end("Issue with data base")
        }
    })
})

app.listen(3001, () => {
    console.log("listening on port 3001")
})