const User = require('../../models/userModel')
const hashFunction = require('password-hash');
const jwtoken= require('jsonwebtoken');

const handle_request = async (req, callback) => {
    if (false){
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
    }
    else {
        User.findOne({email:req.body.email}, (err, user) => {
            if (!err) {
                if (hashFunction.verify(req.body.password, user.password)){
                    const token = jwtoken.sign({data: user._id},"jwtSecret", {
                        expiresIn: '1h'
                    })
                    callback(null, {
                        status: 200,
                        data: {auth:true, token: token, name: user.fname, currency: user.currency},
                        success: true,
                    })
                }
                else {
                    callback(null, {
                        status: 204,
                        message: "Invalid Credentials",
                        success: false,
                    })
                }
            }
            else {
                callback(null, {
                    status: 400,
                    message: "DataBase Issue",
                    success: false,
                })
            }
        })
    }
};

exports.handle_request = handle_request;