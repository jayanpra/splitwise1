const express = require('express');
const mysql = require('mysql')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const hashFunction = require('password-hash');
const fileUpload = require('express-fileupload');
const jwtoken= require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')

app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use(express.static(path.resolve('./public')));

const db = mysql.createPool({
    host: "database-2.copvz5nsdbwv.us-west-2.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "splitwiseStorage"
})

mongoose.connect("mongodb+srv://jayant:jayant@splitwise.spixx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    (req,res) => {
        console.log("Connected to mongodb")
    }
)
// const db = mysql.createPool({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "splitwiseStorage"
// })
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
            console.log(result.insertId)
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
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    console.log(get_id(req.body.token)," is ID")
    const sqlQuery = `SELECT * from userInfo WHERE id=${id}`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            console.log(result)
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            let pic_path;
            if (result[0].image!=null) {
                pic_path = "/images/profilepics/"+ id + "/"+result[0].image
            }
            else{
                pic_path=null
            }
            const endData = {auth:true, 
                name: result[0].fname + " " + result[0].lname,
                email: result[0].email,
                phone: result[0].phone,
                pic : pic_path, 
                currency: result[0].currency,
                timezone: result[0].timezone,
                language: result[0].language}
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

app.post('/profile/update', function(req,res){
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    const sqlQuery = `UPDATE userInfo SET ${req.body.data.type} = \'${req.body.data.value}\' WHERE id=${id};`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            console.log(result)
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Submission");    
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

app.post('/groupCreate', function(req,res){
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    let sqlQuery = `INSERT INTO groupInfo (group_Name,owner_id) VALUES (\'${req.body.group_name}\',\'${id}\');`
    let group_id, user_list ;
    db.query(sqlQuery, (err, result) => {
        if (!err){
            group_id = result.insertId;
            user_list = '';
            for (i in req.body.group_members) {
                user_list = user_list + `\'${req.body.group_members[i]}\', `
            }
            user_list = user_list.substring(0, user_list.length-2)
            sqlQuery = `Select id FROM userInfo WHERE email IN (${user_list});`;
            let act_user_list = []
            db.query(sqlQuery, (err, result) => {
                if (!err){
                    let values = `(${group_id}, ${id}, 'active'), `;
                    for (let i in result){
                        values = values + `(${group_id}, ${result[i].id}, 'inactive'), `
                    }
                    values = values.substring(0, values.length-2)
                    sqlQuery = `INSERT INTO groupMem (group_id, member_id, active) VALUES ${values};`;
                    db.query(sqlQuery, (err, result) => {
                        if (!err){
                            res.writeHead(200,{
                                'Content-Type' : 'text/plain'
                            })
                        res.end("Sucessful Operation")
                        }
                        else {
                            res.writeHead(204,{
                                'Content-Type' : 'text/plain'
                            })
                            res.end("Issue with data base")
                        }
                    })
                }
                else {
                    res.writeHead(204,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Issue with data base")
                }
            })
        }
        else {
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

app.post('/groupFill', function(req,res) {
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    let sqlQuery = `SELECT T1.group_id AS gid, T1.active AS act, T2.group_name AS name 
                    FROM groupMem AS T1 LEFT JOIN groupInfo AS T2 ON  T1.group_id = T2.group_id 
                    WHERE T1.member_id = ${id};`
    let group_list=[];
    let expenses=[];
    db.query(sqlQuery, (err, result) => {
        if (!err){
            for (let i in result) {
                group_list.push({name:result[i].name, id:result[i].gid, active: result[i].act})
            }
            if (group_list.length === 0){
                const finaldata = {group:[], expense: []}
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    console.log(finaldata)
                    res.end(JSON.stringify(finaldata))
                    return
            }
            let sqlQuery = `SELECT T1.date AS date, T1.expense_name as exp_name, T1.shares AS share, T2.id as pid, T2.fname AS fname, T1.amount as amount FROM gExpense AS T1 LEFT JOIN userInfo AS T2 ON  T1.payee_id = T2.id WHERE T1.group_id = ${group_list[0].id};`
            db.query(sqlQuery, (err, result) => {
                if (!err){
                    console.log(result)
                    for (let i in result) {
                        if (result[i].pid === id) {
                            expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'green'})
                        }
                        else{
                            expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'red'})
                        }
                    }
                    const finaldata = {group:group_list, expense: expenses}
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    console.log(finaldata)
                    res.end(JSON.stringify(finaldata))
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
            console.log(err)
            res.writeHead(204,{
                'Content-Type' : 'text/plain'
            })
            res.end("Issue with data base")
        }
    })
})

app.post('/altergroup',function(req,res) {
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    console.log(req.body)
    const group_id = req.body.group_id;
    const sqlQuery = `UPDATE groupMem SET active = 'active' WHERE group_id=${group_id} AND member_id=${id};`
    db.query(sqlQuery, (err, result) => {
        if (!err){
            console.log(result)
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Submission");    
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

app.post('/expenseAdd',function(req,res) {
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    const group_name = req.body.group_name;
    const expense = req.body.expense;
    const expense_name = req.body.expense_name;
    let sqlQuery = `SELECT T1.member_id AS mem, T1.group_id AS gid  FROM groupMem as T1 LEFT JOIN groupInfo as T2 ON T1.group_id = T2.group_ID WHERE T2.group_Name = \'${group_name}\' AND T1.active = \'active\' ;`
    let member_inv=[];
    let expenses='';
    let expense_per_person = 0.0;
    db.query(sqlQuery, (err, result) => {
        if (!err){
            const group_id = result[0].gid
            expense_per_person = (expense / parseFloat(result.length)).toFixed(2);
            let date = new Date();
            const date_string = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            for (let i in result) {
                member_inv.push(result[i].mem)
            }
            sqlQuery = `INSERT INTO gExpense (group_id,date,payee_id,amount,shares,expense_name) VALUES (${group_id}, \'${date_string}\',${id}, ${expense}, ${member_inv.length}, \'${expense_name}\');`
            db.query(sqlQuery, (err, result) => {
                if (!err){
                    let expense_id = result.insertId;
                    for (let i in member_inv){
                        expenses = expenses + `(${id}, ${member_inv[i]}, ${expense_per_person}, ${group_id}, ${expense_id}, \'${expense_name}\'), ` 
                    }
                    expenses = expenses.substring(0, expenses.length-2)
                    sqlQuery = `INSERT INTO iExpense (lender_id,borrow_id,expense,group_id,expense_id, expense_name) VALUES ${expenses};`
                    console.log(sqlQuery)
                    db.query(sqlQuery, (err, result) => {
                        if (!err){
                            res.writeHead(200,{
                                'Content-Type' : 'text/plain'
                            })
                            res.end("Sucessfully Added")
                            
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
                    console.log(err)
                    res.writeHead(204,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Issue with data base")
                }
            })
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

app.post('/groupChange',function(req,res) {
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    let expenses=[];
    let sqlQuery = `SELECT T1.date AS date, T1.expense_name as exp_name, T1.shares AS share, T2.id as pid, T2.fname AS fname, T1.amount as amount FROM gExpense AS T1 LEFT JOIN userInfo AS T2 ON  T1.payee_id = T2.id WHERE T1.group_id = ${req.body.group_id};`
    db.query(sqlQuery, (err, result) => {
        if (!err){
            console.log(result)
            for (let i in result) {
                if (result[i].pid === id) {
                    expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'green'})
                }
                else{
                expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'red'})
                }
            }
            const finaldata = {expense: expenses}
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            console.log(finaldata)
            res.end(JSON.stringify(finaldata))
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

app.post('/pullRecent', function(req,res){
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    let group_ids = '';
    let group_list = []
    let sqlQuery = `SELECT T1.group_id as gid, T2.group_name AS name 
                    FROM groupMem AS T1 LEFT JOIN groupInfo AS T2 ON T1.group_id = T2.group_ID 
                    WHERE T1.member_id = ${id} AND T1.active='active';`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            console.log(result)
            for (let i in result){
                group_ids = group_ids + `${result[i].gid}, `
                group_list = [...group_list, {id: result[i].gid, name:result[i].name}]
            } 
            group_ids = group_ids.substring(0,group_ids.length-2);
            sqlQuery = `SELECT T1.group_id AS gid, T1.date AS date, T1.amount AS amt, T1.shares as share, T1.expense_name AS exp_name, T1.payee_id as pid, T2.fname AS name
                        FROM gExpense AS T1 LEFT JOIN userInfo AS T2 ON T1.payee_id = T2.id
                        WHERE T1.expense_id = ANY (SELECT expense_id FROM iExpense WHERE lender_id = ${id} OR borrow_id = ${id});`
            console.log(sqlQuery)
            db.query(sqlQuery, (err, result, fields) => {
                if (!err){
                    let expense_data = [];
                    console.log(result)
                    for (let i in result){
                        group_name = '';
                        for (let j in group_list){
                            if (result[i].gid === group_list[j].id){
                                group_name = group_list[j].name
                                break
                            }
                        }
                        if (result[i].pid === id){
                            expense_data.push({uname: result[i].name, ename: result[i].exp_name, gname: group_name, color: "green", date:result[i].date, amount:result[i].amt, share:result[i].share})
                        }
                        else{
                            expense_data.push({uname: result[i].name, ename: result[i].exp_name, gname: group_name, color: "red", date:result[i].date, amount:result[i].amt, share:result[i].share})
                        }
                    }
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    const finaldata = {expense: expense_data}
                    console.log(finaldata)
                    res.end(JSON.stringify(finaldata))
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
            console.log(err)
            res.writeHead(204,{
                'Content-Type' : 'text/plain'
            })
            res.end("Issue with data base")
        }
    })
})

app.post('/getDash', function(req,res){
    console.log("All Okay Here")
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    let ledger = new Object();
    let object = new Object();
    const sqlQuery = `SELECT T1.borrow_id as bid, T1.expense_name as ename, T1.expense as amt, T2.fname AS fname 
                    FROM iExpense AS T1 LEFT JOIN userInfo AS T2 ON T1.borrow_id = T2.id
                    WHERE T1.lender_id=${id} AND T1.lender_id != T1.borrow_id;`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            for (let i in result){
                if (result[i].bid in ledger) {
                    ledger[result[i].bid].push({color:"green", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
                    object[result[i].bid] = object[result[i].lid] + result[i].amt
                }
                else{
                    ledger[result[i].bid] = []
                    object[result[i].bid] = 0.0
                    ledger[result[i].bid].push({color:"green", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
                    object[result[i].bid] = result[i].amt
                }
            }
            const sqlQuery = `SELECT T1.lender_id as lid, T1.expense_name as ename, T1.expense as amt, T2.fname AS fname 
                    FROM iExpense AS T1 LEFT JOIN userInfo AS T2 ON T1.lender_id = T2.id
                    WHERE T1.borrow_id=${id} AND T1.lender_id != T1.borrow_id;`
            db.query(sqlQuery, (err, result, fields) => {
                if (!err){
                    for (let i in result){
                        if (result[i].lid in ledger) {
                            ledger[result[i].lid].push({color:"red", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
                            object[result[i].lid] = object[result[i].lid] - result[i].amt
                        }
                        else{
                            ledger[result[i].lid] = []
                            object[result[i].lid] = 0.0
                            ledger[result[i].lid].push({color:"red", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
                            object[result[i].lid] = 0.0 - result[i].amt
                        }
                    }
                    console.log(object)
                    const final_data = {accounts: ledger, balance: object}
                    res.writeHead(200,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end(JSON.stringify(final_data))
                }
                else{
                    console.log(err)
                    res.writeHead(204,{
                        'Content-Type' : 'text/plain'
                    })
                    res.end("Issue with data base")
                }
            })
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

app.post('/settleUp', function(req,res){
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(203,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    settle_values = ''
    const settle_data = req.body.settle
    let keys = Object.keys(settle_data)
    for (let i in keys){
        if (settle_data[keys[i]] > 0){
            settle_values = settle_values + `(${keys[i]}, ${id}, ${settle_data[keys[i]]}, 0, 0, \'settle_up\'), `
        }
        else {
            settle_values = settle_values + `(${id}, ${keys[i]}, ${settle_data[keys[i]] * -1}, 0, 0, \'settle_up\'), `
        }
    }
    settle_values = settle_values.substring(0, settle_values.length-2)
    const sqlQuery = `INSERT INTO iExpense(lender_id,borrow_id,expense,group_id,expense_id, expense_name) VALUES ${settle_values} ;`
    console.log(sqlQuery)
    db.query(sqlQuery, (err, result, fields) => {
        if (!err){
            console.log(result)
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Submission");    
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

app.post('/groupSuggest',function(req,res) {
    const sqlQuery = `SELECT email AS em FROM userInfo;`
    let list = [];
    db.query(sqlQuery, (err, result) => {
        if (!err){
            console.log("Result, ")
            for (let i in result){
                list.push(result[i].em)
            }
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            console.log(list)
            const final_data = {list: list}
            res.end(JSON.stringify(final_data));    
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

app.post('/groupExit',function(req,res) {
    const id = get_id(req.body.token)
    if (!id){
        res.writeHead(204,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    console.log(req.body)
    const group_id = req.body.group_id;
    let sqlQuery = `Select * FROM iExpense WHERE group_id = ${group_id} OR group_id = 0`
    db.query(sqlQuery, (err, result) => {
        if (!err){
            let balance = 0.0
            for (let i in result){
                if (result[i].lender_id === result[i].borrow_id){
                    continue
                }
                if (result[i].lender_id === id){
                    balance =  balance + result[i].expense
                }
                else if (result[i].borrow_id === id){
                    balance = balance - result[i].expense
                }
            }
            if (balance < 0){
                balance = balance * -1
            }
            if (balance > 0.01){
                const data = {message: "Group Not Settled"}
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end(JSON.stringify(data));
            }
            else {
                sqlQuery = `DELETE FROM groupMem WHERE group_id = ${group_id} AND member_id = ${id}`
                db.query(sqlQuery, (err, result) => {
                    if (!err){
                        const data = {message: "Group Settled"}
                        res.writeHead(200,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end(JSON.stringify(data));
                    }
                });
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
app.post('/imageupdate', function(req,res) {
    if (req.files === null) {
        return res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    var x = req.files.profileImage.name.split(',')[1];
    const userID = get_id(x);
    const fileName = req.files.profileImage.name.split(',')[0];
    console.log(__dirname);
    var pathToImage = path.join(__dirname, './public');

    const filePathwithoutfileName = pathToImage + '/images/profilepics/' + userID;
    console.log(filePathwithoutfileName);
    const filePath = pathToImage + '/images/profilepics/' + userID + '/' + fileName;

    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    file.mv(filePath, err => {
        if (err) {
            return res.status(500).end(err);
        }
        else {
            var sql = `UPDATE userInfo SET image='${fileName}' WHERE id=${userID}`;
            db.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(400).end("Error:", err);
                }
            });
        }
    })
    res.json({
        fileName: fileName,
        filePath: filePath
    })
});