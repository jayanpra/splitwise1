const User = require('../../models/userModel')
const hashFunction = require('password-hash');
const jwtoken= require('jsonwebtoken');

const handle_request = async (req, callback) => {
    let password = hashFunction.generate(req.body.password);
    if (false) {
        let sqlInsert = `INSERT INTO userInfo (email, fname, lname, password) VALUES (\'${req.body.email}\',\'${req.body.fname}\',\'${req.body.lname}\',\'${password}\');`
        db.query(sqlInsert, (err, result) => {
            if (!err){
                console.log(result.insertId)
                const id = result.insertId
                const token = jwtoken.sign({data: id},"jwtSecret", {
                    expiresIn: '1h'
                });
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
                res.end("Issue with data base", err)
            }
        })
    }
    else {
        console.log("Tests")
        const record = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: password,
            currency: "USD",
        })
        const id = record._id
        await record.save((err) => {
            if (!err) {
                const token = jwtoken.sign({data: id},"jwtSecret", {
                    expiresIn: '1h'
                });
                callback(null, {
                    status: 200,
                    data: {auth:true, token: token, name: req.body.fname, currency: "USD"},
                    success: true,
                })
            }
            else{
                if (err.keyPattern.email === 1) {
                    callback(null, {
                        status: 204,
                        message: "Email exist",
                        success: false,
                    })
                }
                else {
                    callback(null, {
                        status: 400,
                        message: "Issue with database",
                        success: false,
                    })
                }
            }
        })
    }
};

exports.handle_request = handle_request;