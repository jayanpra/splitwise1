const express = require('express');
const mysql = require('mysql')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const hashFunction = require('password-hash');
const jwtoken= require('jsonwebtoken');

app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "splitwiseStorage"
})
const get_id = (token) => {
    if (!token){
        return null;
    }
    else {
        let data
        jwtoken.verify(token,"jwtSecret", (err,decoded) => {
            if (err) {
                data = null;
            }
            else {
                data = decoded['data'];
            }
        })
        return data;
    }
}
const verifyToken = (req,res,next) => {
    const token =  req.headers["x-access-token"]
    if (!token){
        res.send("No Token found")
    }
    else {
        jwtoken.verify(token,"jwtSecret", (err,decoded) => {
            if (err) {
                res.json({auth: false, message: "Authentication failed"})
            }
            else {
                res.userID = decoded.data.id;
                next();
            }
        })
    }

}

app.get("/check/auth", verifyToken,(req,res) => {
    res.send("Authentication Successful")
});
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
app.post('/profile/initialPull', function(req,res){
    const id = get_id(req.body.token)
    console.log(get_id(req.body.token)," is ID")
    const sqlQuery = `SELECT * from userInfo WHERE id=${id}`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            console.log(result)
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            const endData = {auth:true, 
                name: result[0].fname + " " + result[0].lname,
                email: result[0].email,
                phone: result[0].phone,
                currency: result[0].currency,
                timezone: result[0].timezone,
                language: result[0].language,
                image: result[0].image}
            res.end(JSON.stringify(endData));    
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
app.post('/login', function(req,res) {
    let sqlQuery = `SELECT * FROM userInfo WHERE email=\'${req.body.email}\';`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            if (result.length == 1 && hashFunction.verify(req.body.password, result[0].password)) {
                const id = result[0].id
                const token = jwtoken.sign({data: id},"jwtSecret", {
                    expiresIn: '1h'
                })
                console.log("Successfully Verified", result)
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log("Admitted", token)
                res.end(JSON.stringify({auth:true, token: token}));
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