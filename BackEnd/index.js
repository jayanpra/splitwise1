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
const kafka = require('./kafka/client')
const dotenv = require('dotenv')
const dbSQL = true
const User = require('./models/userModel')
const Group = require('./models/groupModel')
const gExpense = require('./models/gExpenseModel')
const iExpense = require('./models/iExpenseModel')
const Member = require('./models/memberModel')
const {GET_PROFILE, SAVE_PROFILE, GET_DASH, SETTLE_UP, ADD_COMMENT, ADD_EXPENSE, GET_COMMENT, GROUP_APPROVE, GROUP_CHANGE, GROUP_CREATE, GROUP_EXIT, GROUP_FILL, GROUP_SUGGEST, LOGIN, REGISTER} = require('./kafka/topics')


app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://18.237.56.160:3000', credentials: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use(express.static(path.resolve('./public')));
dotenv.config()

const db = mysql.createPool({
    host: "database-2.copvz5nsdbwv.us-west-2.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "splitwiseStorage"
})
// const kafka = new Kafka({
//     clientId: "splitwise",
//     brokers: ['18.237.56.160:9091', '18.237.56.160:9092']
// })

mongoose.connect('mongodb+srv://jayant29:jayant29@splitwise.spixx.mongodb.net/splitwiseStorage?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology:true},
    (req,res) => {
        console.log("Connected to mongodb")
    }
)



// const db = mysql.createPool({
//     host: "18.237.56.160",
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
    res.setHeader('Access-Control-Allow-Origin', 'http://18.237.56.160:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });
*/
app.post('/register', async function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(REGISTER, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // let password = hashFunction.generate(req.body.password);
    // if (false) {
    //     let sqlInsert = `INSERT INTO userInfo (email, fname, lname, password) VALUES (\'${req.body.email}\',\'${req.body.fname}\',\'${req.body.lname}\',\'${password}\');`
    //     db.query(sqlInsert, (err, result) => {
    //         if (!err){
    //             console.log(result.insertId)
    //             const id = result.insertId
    //             const token = jwtoken.sign({data: id},"jwtSecret", {
    //                 expiresIn: '1h'
    //             });
    //             console.log("Successfully Verified", result)
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log("Admitted", token)
    //             res.end(JSON.stringify({auth:true, token: token}));
    //         }
    //         else {
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base", err)
    //         }
    //     })
    // }
    // else {
    //     console.log("Tests")
    //     const record = new User({
    //         fname: req.body.fname,
    //         lname: req.body.lname,
    //         email: req.body.email,
    //         password: password,
    //     })
    //     const id = record._id
    //     await record.save((err) => {
    //         if (!err) {
    //             const token = jwtoken.sign({data: id},"jwtSecret", {
    //                 expiresIn: '1h'
    //             });
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end(JSON.stringify({auth:true, token: token}));
    //         }
    //         else{
    //             if (err.keyPattern.email === 1) {
    //                 res.writeHead(204,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("Email exist", err)
    //             }
    //             else {
    //                 res.writeHead(400,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("Issue with database", err)
    //             }

    //         }
    //     })
    // }
    
});

app.post('/profile/initialPull', function(req,res){
    const payload = { body: req.body};
    kafka.make_request(GET_PROFILE, payload, (error, results) => {
    if (!results.success) {
      res.status(400).send(results.data);
    } else {
      res.status(200).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // console.log(get_id(req.body.token)," is ID")
    // if (false) {
    //     const sqlQuery = `SELECT * from userInfo WHERE id=${id}`
    //     console.log(sqlQuery)
    //     db.query(sqlQuery, (err, result, fields) => {
    //         if (!err){
    //             console.log(result)
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             let pic_path;
    //             if (result[0].image!=null) {
    //                 pic_path = "/images/profilepics/"+ id + "/"+result[0].image
    //             }
    //             else{
    //                 pic_path=null
    //             }
    //             const endData = {auth:true, 
    //                 name: result[0].fname + " " + result[0].lname,
    //                 email: result[0].email,
    //                 phone: result[0].phone,
    //                 pic : pic_path, 
    //                 currency: result[0].currency,
    //                 timezone: result[0].timezone,
    //                 language: result[0].language}
    //             res.end(JSON.stringify(endData));    
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     User.findOne({_id:id}, (err, user) => {
    //         if (!err) {
    //             const endData = {auth:true, 
    //                 name: user.fname + " " + user.lname,
    //                 email: user.email,
    //                 phone: 'phone' in user ? user.phone : null,
    //                 pic : 'pic' in user ? user.pic : null, 
    //                 currency: 'currency' in user ? user.currency : USD, 
    //                 timezone: 'timezone' in user ? user.timezone : null, 
    //                 language: 'language' in user ? user.language : null, }
    //             //endData.serialize()
    //             res.end(JSON.stringify(endData));
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end(JSON.stringify({message: "Invalid Credentials"}))
    //         }
    //     })
    // }
    
})

app.post('/profile/update', async function(req,res){
    const payload = { body: req.body};
    kafka.make_request(SAVE_PROFILE, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // const field = req.body.data.type
    // const value = req.body.data.value
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false){
    //     const sqlQuery = `UPDATE userInfo SET ${req.body.data.type} = \'${req.body.data.value}\' WHERE id=${id};`
    //     console.log(sqlQuery)
    //     db.query(sqlQuery, (err, result, fields) => {
    //         if (!err){
    //             console.log(result)
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Successful Submission");    
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else{
    //     const val = await User.findById(id)
    //     switch (field){
    //         case 'name':{
    //             let name_list = value.split(" ")
    //             val.lname = ''
    //             for (let i in name_list){
    //                 if (i==0){
    //                     val.fname = name_list[0]
    //                 }
    //                 else if (i == 1){
    //                     val.lname = name_list[1]
    //                 }
    //                 else{
    //                     val.lname = val.lname + " " + name_list[i]
    //                 }
    //             }
    //             break
    //         }
    //         case 'email': {
    //             val.email = value
    //             break
    //         }
    //         case 'phone': {
    //             val.phone = value
    //             break
    //         }
    //         case 'currency':{
    //             val.currency = value
    //             break;
    //           }
    //         case 'timezone':{
    //             val.timezone = value
    //             break;
    //           }
    //         case 'language':{
    //             val.language = value
    //             break;
    //         }
    //         default:
    //             break;
    //     }
    //     console.log(field, " is a field", value)
    //     console.log(val)
    //     val.save((err) => {
    //         console.log
    //         if ( err && err.code !== 11000 ) {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //             return
    //         }
    //         if ( err && err.code === 11000 ) {
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //             return
    //         }
    //         res.writeHead(200,{
    //             'Content-Type' : 'text/plain'
    //         })
    //         res.end("Successful Submission"); 

    //     })
    // }
})

app.post('/groupCreate', async function(req,res){
    const payload = { body: req.body};
    kafka.make_request(GROUP_CREATE, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false) {
    //     let sqlQuery = `INSERT INTO groupInfo (group_Name,owner_id) VALUES (\'${req.body.group_name}\',\'${id}\');`
    //     let group_id, user_list ;
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             group_id = result.insertId;
    //             user_list = '';
    //             for (i in req.body.group_members) {
    //                 user_list = user_list + `\'${req.body.group_members[i]}\', `
    //             }
    //             user_list = user_list.substring(0, user_list.length-2)
    //             sqlQuery = `Select id FROM userInfo WHERE email IN (${user_list});`;
    //             let act_user_list = []
    //             db.query(sqlQuery, (err, result) => {
    //                 if (!err){
    //                     let values = `(${group_id}, ${id}, 'active'), `;
    //                     for (let i in result){
    //                         values = values + `(${group_id}, ${result[i].id}, 'inactive'), `
    //                     }
    //                     values = values.substring(0, values.length-2)
    //                     sqlQuery = `INSERT INTO groupMem (group_id, member_id, active) VALUES ${values};`;
    //                     db.query(sqlQuery, (err, result) => {
    //                         if (!err){
    //                             res.writeHead(200,{
    //                                 'Content-Type' : 'text/plain'
    //                             })
    //                         res.end("Sucessful Operation")
    //                         }
    //                         else {
    //                             res.writeHead(204,{
    //                                 'Content-Type' : 'text/plain'
    //                             })
    //                             res.end("Issue with data base")
    //                         }
    //                     })
    //                 }
    //                 else {
    //                     res.writeHead(204,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     res.end("Issue with data base")
    //                 }
    //             })
    //         }
    //         else {
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else{
    //     console.log("id is ",id)
    //     const group = new Group({
    //         group_name: req.body.group_name,
    //         owner: id,
    //         member: [id],
    //     })
    //     const group_id = group._id
    //     await group.save().then((result,err) => {
    //         if (err){
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Duplicate Group", err)
    //             return
    //         }
    //     })
    //     const ps_member = await User.find({email: req.body.group_members})
    //     let member = []
    //     for (let i in ps_member){
    //         member.push({group_id: group_id, member_id: ps_member[i]._id, status: 'passive'})
    //     }
    //     Member.insertMany(member).then((result,err) => {
    //         if (!err) {
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("successful addition");
    //         }
    //         else{
    //             res.writeHead(400,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with database", err)
    //         }
    //     })
    // }
    
    
})

app.post('/login', function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(LOGIN, payload, (error, results) => {
    if (!results.success) {
        console.log(results.message)
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // if (false){
    //     let sqlQuery = `SELECT * FROM userInfo WHERE email=\'${req.body.email}\';`
    //     console.log(sqlQuery)
    //     db.query(sqlQuery, (err, result, fields) => {
    //         if (!err){
    //             if (result.length == 1 && hashFunction.verify(req.body.password, result[0].password)) {
    //                 const id = result[0].id
    //                 const token = jwtoken.sign({data: id},"jwtSecret", {
    //                     expiresIn: '1h'
    //                 })
    //                 console.log("Successfully Verified", result)
    //                 res.writeHead(200,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 console.log("Admitted", token)
    //                 res.end(JSON.stringify({auth:true, token: token}));
    //             }
    //             else {
    //                 res.writeHead(204,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("Invalid Credentials")
    //             }
                
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {

    //     User.findOne({email:req.body.email}, (err, user) => {
    //         if (!err) {
    //             if (hashFunction.verify(req.body.password, user.password)){
    //                 const token = jwtoken.sign({data: user._id},"jwtSecret", {
    //                     expiresIn: '1h'
    //                 })
    //                 res.writeHead(200,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 console.log("Admitted", token)
    //                 res.end(JSON.stringify({auth:true, token: token}));
    //             }
    //             else {
    //                 res.writeHead(204,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("Invalid Credentials")
    //             }
    //         }
    //         else {
    //             console.log("error is", err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Invalid Credentials")
    //         }
    //     })
    // }
   
})

app.post('/groupFill', async function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(GROUP_FILL, payload, (error, results) => {
    console.log(results)
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false){
    //     let sqlQuery = `SELECT T1.group_id AS gid, T1.active AS act, T2.group_name AS name, T2.group_Pic as pic 
    //                 FROM groupMem AS T1 LEFT JOIN groupInfo AS T2 ON  T1.group_id = T2.group_id 
    //                 WHERE T1.member_id = ${id};`
    //     let group_list=[];
    //     let expenses=[];
    //     let pic=null;
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             pic = result[0].pic
    //             for (let i in result) {
    //                 group_list.push({name:result[i].name, id:result[i].gid, active: result[i].act})
    //             }
    //             if (group_list.length === 0){
    //                 const finaldata = {group:[], expense: []}
    //                     res.writeHead(200,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     console.log(finaldata)
    //                     res.end(JSON.stringify(finaldata))
    //                     return
    //             }
    //             let sqlQuery = `SELECT T1.date AS date, T1.expense_name as exp_name, T1.shares AS share, T2.id as pid, T2.fname AS fname, T1.amount as amount FROM gExpense AS T1 LEFT JOIN userInfo AS T2 ON  T1.payee_id = T2.id WHERE T1.group_id = ${group_list[0].id};`
    //             db.query(sqlQuery, (err, result) => {
    //                 if (!err){
    //                     console.log(result)
    //                     for (let i in result) {
    //                         if (result[i].pid === id) {
    //                             expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'green'})
    //                         }
    //                         else{
    //                             expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'red'})
    //                         }
    //                     }
    //                     const finaldata = {group:group_list, expense: expenses, pics: pic}
    //                     res.writeHead(200,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     console.log(finaldata)
    //                     res.end(JSON.stringify(finaldata))
    //                 }
    //                 else {
    //                     console.log(err)
    //                     res.writeHead(204,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     res.end("Issue with data base")
    //                 }
    //             })
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else{
    //     let group_list =[];
    //     const group = await Group.find({member: id}).populate({path: 'expense', populate: {path: 'payee'}})
    //     for (let i in group){
    //         group_list.push({name:group[i].group_name, id:group[i]._id, active: 'active'})
    //     }
    //     const request = await Member.find({member_id: id}).populate('group_id')
    //     for (let i in request){
    //         group_list.push({name:request[i].group_id.group_name, id:request[i].group_id._id, active: 'passive'})
    //     }
    //     console.log(group_list)
    //     if (group.length === 0 || group[0].expense.length === 0){
    //         const finaldata = {group:group_list, expense: []}
    //         res.writeHead(200,{
    //             'Content-Type' : 'text/plain'
    //         })
    //         console.log(finaldata)
    //         res.end(JSON.stringify(finaldata))
    //     }
    //     else{
    //         let expenses = []
    //         for (let i in group[0].expense){
    //             if (group[0].expense[i].payee._id == id) {
    //                 expenses.push({ expense_id: group[0].expense[i]._id,
    //                                 expense_name: group[0].expense[i].expense_name, 
    //                                 date:group[0].expense[i].date, 
    //                                 shares:group[0].expense[i].shares, 
    //                                 payee: group[0].expense[i].payee.fname, 
    //                                 amount: group[0].expense[i].amount, color:'green'})
    //             }
    //             else{
    //                 expenses.push({ expense_id: group[0].expense[i]._id,
    //                     expense_name: group[0].expense[i].expense_name, 
    //                     date:group[0].expense[i].date, 
    //                     shares:group[0].expense[i].shares, 
    //                     payee: group[0].expense[i].payee.fname, 
    //                     amount: group[0].expense[i].amount, color:'red'})
    //             }
    //         }
    //         const finaldata = {group:group_list, expense: expenses}
    //         res.writeHead(200,{
    //             'Content-Type' : 'text/plain'
    //         })
    //         console.log(finaldata)
    //         res.end(JSON.stringify(finaldata))
    //     }
    // }
    
})

app.post('/getcomment', async function(req,res){
    const payload = { body: req.body};
    kafka.make_request(GET_COMMENT, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false){

    // }
    // else{
    //     console.log(req.body)
    //     const c_Expense = await gExpense.find({_id: req.body.expense_id}).populate({path:'comment', populate:{path:'author'}})
    //     let comments = []
    //     console.log(c_Expense)
    //     if (c_Expense[0]){
    //         for (let i in c_Expense[0].comment){
    //             comments.push({text: c_Expense[0].comment[i].comment, author: c_Expense[0].comment[i].author.fname + " " + c_Expense[0].comment[i].author.lname})
    //         }
    //     }
    //     const finaldata = {comment_list: comments}
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end(JSON.stringify(finaldata))
    // }
})

app.post('/addcomment', function(req,res){
    const payload = { body: req.body};
    kafka.make_request(ADD_COMMENT, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.message);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false){

    // }
    // else{
    //     const comment = {comment: req.body.text, author: id}

    //     const c_Expense = gExpense.findByIdAndUpdate(
    //         req.body.expense_id,
    //         {$push: {comment: comment}}).then((result,err) => {
    //             if(err){
    //                 res.writeHead(204,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("database_issue")
    //             }
    //             else{
    //                 res.writeHead(200,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("sucessfully updated")
    //             }
    //         })
    // }
})

app.post('/altergroup',function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(GROUP_APPROVE, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.message);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false){
    //     console.log(req.body)
    //     const group_id = req.body.group_id;
    //     const sqlQuery = `UPDATE groupMem SET active = 'active' WHERE group_id=${group_id} AND member_id=${id};`
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             console.log(result)
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Successful Submission");    
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     console.log(req.body.group_id)
    //     Group.findByIdAndUpdate(
    //         req.body.group_id,
    //         {$push: {member: id}}).then((result,err) => {
    //             if(err){
    //                 console.log(err)
    //             }
    //             else{
    //                 console.log(err)
    //             }
    //         })
    //     Member.findOneAndDelete({member_id: id, group_id: req.body.group_id},((err) => {
    //         if(err) {
    //             console.log(err);
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //         else {
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Successful Submission");  
    //         }
            
    //       }))
    // }
})

app.post('/expenseAdd',async function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(ADD_EXPENSE, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.message);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // const group_name = req.body.group_name;
    // const expense = req.body.expense;
    // const expense_name = req.body.expense_name;
    // if (false) {
    //     let sqlQuery = `SELECT T1.member_id AS mem, T1.group_id AS gid  FROM groupMem as T1 LEFT JOIN groupInfo as T2 ON T1.group_id = T2.group_ID WHERE T2.group_Name = \'${group_name}\' AND T1.active = \'active\' ;`
    //     let member_inv=[];
    //     let expenses='';
    //     let expense_per_person = 0.0;
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             const group_id = result[0].gid
    //             expense_per_person = (expense / parseFloat(result.length)).toFixed(2);
    //             let date = new Date();
    //             const date_string = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    //             for (let i in result) {
    //                 member_inv.push(result[i].mem)
    //             }
    //             sqlQuery = `INSERT INTO gExpense (group_id,date,payee_id,amount,shares,expense_name) VALUES (${group_id}, \'${date_string}\',${id}, ${expense}, ${member_inv.length}, \'${expense_name}\');`
    //             db.query(sqlQuery, (err, result) => {
    //                 if (!err){
    //                     let expense_id = result.insertId;
    //                     for (let i in member_inv){
    //                         expenses = expenses + `(${id}, ${member_inv[i]}, ${expense_per_person}, ${group_id}, ${expense_id}, \'${expense_name}\'), ` 
    //                     }
    //                     expenses = expenses.substring(0, expenses.length-2)
    //                     sqlQuery = `INSERT INTO iExpense (lender_id,borrow_id,expense,group_id,expense_id, expense_name) VALUES ${expenses};`
    //                     console.log(sqlQuery)
    //                     db.query(sqlQuery, (err, result) => {
    //                         if (!err){
    //                             res.writeHead(200,{
    //                                 'Content-Type' : 'text/plain'
    //                             })
    //                             res.end("Sucessfully Added")
                                
    //                         }
    //                         else {
    //                             console.log(err)
    //                             res.writeHead(204,{
    //                                 'Content-Type' : 'text/plain'
    //                             })
    //                             res.end("Issue with data base")
    //                         }
    //                     })
    //                 }
    //                 else {
    //                     console.log(err)
    //                     res.writeHead(204,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     res.end("Issue with data base")
    //                 }
    //             })
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     const group = await Group.findOne({group_name: req.body.group_name})
    //     console.log(group)
    //     const shares = group.member.length
    //     const date_string = new Date().toISOString()
    //     const g_exp = new gExpense({
    //         date: date_string,
    //         payee: id,
    //         amount: req.body.expense,
    //         shares: shares,
    //         expense_name: req.body.expense_name,
    //         comment: [],
    //     });
    //     g_exp.save()
    //     const expense_per_person = (expense / parseFloat(shares)).toFixed(2);
    //     for (i in group.member){
    //         const i_exp = new iExpense({
    //             lender_id: id,
    //             borrow_id: group.member[i],
    //             group_id: group._id,
    //             expense_id: g_exp._id,
    //             expense_name: req.body.expense_name,
    //             expense: expense_per_person,
    //             date: date_string,
    //         })
    //         i_exp.save()
    //     }
    //     group.expense.push(g_exp._id)
    //     group.save((err) => {
    //         if (!err) {
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Sucessful Submission");
    //         }
    //         else{
    //             res.writeHead(204,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //             res.end("Server issue", err)
    //         }
    //     })

    // }
    
})

app.post('/groupChange', async function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(GROUP_CHANGE, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      console.log(results.data)
      res.status(results.status).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // let expenses=[];
    // if (false){
    //     let sqlQuery = `SELECT T1.date AS date, T1.expense_name as exp_name, T1.shares AS share, T2.id as pid, T2.fname AS fname, T1.amount as amount FROM gExpense AS T1 LEFT JOIN userInfo AS T2 ON  T1.payee_id = T2.id WHERE T1.group_id = ${req.body.group_id};`
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             console.log(result)
    //             for (let i in result) {
    //                 if (result[i].pid === id) {
    //                     expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'green'})
    //                 }
    //                 else{
    //                 expenses.push({expense_name:result[i].exp_name, date:result[i].date, shares:result[i].share, payee: result[i].fname, amount: result[i].amount, color:'red'})
    //                 }
    //             }
    //             const finaldata = {expense: expenses}
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log(finaldata)
    //             res.end(JSON.stringify(finaldata))
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     const group = await Group.findOne({_id: req.body.group_id}).populate({path: 'expense', populate: {path: 'payee'}})
    //     console.log(group)
    //     if (group.expense.length === 0){
    //         const finaldata = {expense: []}
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log(finaldata)
    //             res.end(JSON.stringify(finaldata))
    //     }
    //     else {
    //         for (let i in group.expense){
    //             if (group.expense[i].payee._id === id) {
    //                 expenses.push({ expense_id: group.expense[i]._id,
    //                                 expense_name: group.expense[i].exp_name, 
    //                                 date:group.expense[i].date, 
    //                                 shares:group.expense[i].share, 
    //                                 payee: group.expense[i].payee.fname, 
    //                                 amount: group.expense[i].amount, color:'green'})
    //             }
    //             else{
    //                 expenses.push({ expense_id: group[0].expense[i]._id,
    //                     expense_name: group.expense[i].exp_name, 
    //                     date:group.expense[i].date, 
    //                     shares:group.expense[i].share, 
    //                     payee: group.expense[i].payee.fname, 
    //                     amount: group.expense[i].amount, color:'red'})
    //             }
    //             const finaldata = {expense: expenses}
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log(finaldata)
    //             res.end(JSON.stringify(finaldata))
    //         }
    //     }
    // }
    
})

app.post('/pullRecent', async function(req,res){
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
    if (false){
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
    }
    else {
        console.log(id)
        let expense_data = []
        let expense_ids = []
        const expense = await iExpense.find({$or: [{lender_id: id},{borrow_id: id}]}).populate('lender_id').populate('group_id').populate('expense_id')
        // .then((result,err) => {
        //     if(err){
        //         console.log(err)
        //         res.writeHead(204,{
        //                 'Content-Type' : 'text/plain'
        //         })
        //         res.end("Issue with data base")
        //     }
        //     else {
        //         console.log(result)
        //     }
        // })
        console.log(expense.length)
        for (let i in expense){
            if (typeof expense[i].expense_id === 'undefined'){
                continue
            }
            if (expense_ids.includes(expense[i].expense_id._id.toString())){
                continue
            }
            if (expense[i].lender_id._id.toString() == id){
                expense_data.push({ expense_id: expense[i].expense_id,
                                    uname: expense[i].lender_id.fname, 
                                    ename: expense[i].expense_name, 
                                    gname: expense[i].group_id.group_name, 
                                    color: "green", 
                                    date:expense[i].expense_id.date, 
                                    amount: expense[i].expense_id.amount - expense[i].expense, 
                                    share:expense[i].expense_id.shares
                                })
            }
            else {
                expense_data.push({ expense_id: expense[i].expense_id,
                    uname: expense[i].lender_id.fname, 
                    ename: expense[i].expense_name, 
                    gname: expense[i].group_id.group_name, 
                    color: "red", 
                    date:expense[i].expense_id.date, 
                    amount: expense[i].expense, 
                    share:expense[i].expense_id.shares
                })
            }
            expense_ids.push(expense[i].expense_id._id.toString())

            //console.log("Till Now, ",expense_data)
        }
        res.writeHead(200,{
            'Content-Type' : 'text/plain'
        })
        const finaldata = {expense: expense_data}
        console.log(finaldata)
        res.end(JSON.stringify(finaldata))
    }
    
})

app.post('/getDash', async function(req,res){
    const payload = { body: req.body};
    kafka.make_request(GET_DASH, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // console.log("All Okay Here")
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // let ledger = new Object();
    // let object = new Object();
    // if (false){
    //     const sqlQuery = `SELECT T1.borrow_id as bid, T1.expense_name as ename, T1.expense as amt, T2.fname AS fname 
    //                 FROM iExpense AS T1 LEFT JOIN userInfo AS T2 ON T1.borrow_id = T2.id
    //                 WHERE T1.lender_id=${id} AND T1.lender_id != T1.borrow_id;`
    //     console.log(sqlQuery)
    //     db.query(sqlQuery, (err, result, fields) => {
    //         if (!err){
    //             for (let i in result){
    //                 if (result[i].bid in ledger) {
    //                     ledger[result[i].bid].push({color:"green", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
    //                     object[result[i].bid] = object[result[i].bid] + result[i].amt
    //                 }
    //                 else{
    //                     ledger[result[i].bid] = []
    //                     object[result[i].bid] = 0.0
    //                     ledger[result[i].bid].push({color:"green", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
    //                     object[result[i].bid] = result[i].amt
    //                 }
    //             }
    //             const sqlQuery = `SELECT T1.lender_id as lid, T1.expense_name as ename, T1.expense as amt, T2.fname AS fname 
    //                     FROM iExpense AS T1 LEFT JOIN userInfo AS T2 ON T1.lender_id = T2.id
    //                     WHERE T1.borrow_id=${id} AND T1.lender_id != T1.borrow_id;`
    //             db.query(sqlQuery, (err, result, fields) => {
    //                 if (!err){
    //                     for (let i in result){
    //                         if (result[i].lid in ledger) {
    //                             ledger[result[i].lid].push({color:"red", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
    //                             object[result[i].lid] = object[result[i].lid] - result[i].amt
    //                         }
    //                         else{
    //                             ledger[result[i].lid] = []
    //                             object[result[i].lid] = 0.0
    //                             ledger[result[i].lid].push({color:"red", expense: result[i].amt, person: result[i].fname, ename: result[i].ename})
    //                             object[result[i].lid] = 0.0 - result[i].amt
    //                         }
    //                     }
    //                     console.log(object)
    //                     const final_data = {accounts: ledger, balance: object}
    //                     res.writeHead(200,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     res.end(JSON.stringify(final_data))
    //                 }
    //                 else{
    //                     console.log(err)
    //                     res.writeHead(204,{
    //                         'Content-Type' : 'text/plain'
    //                     })
    //                     res.end("Issue with data base")
    //                 }
    //             })
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     const expense_list = await iExpense.find({$or: [{lender_id: id}, {borrow_id: id}]
    //     }).populate('lender_id').populate('borrow_id')
    //     console.log(expense_list)
    //     for (let i in expense_list){
    //         //console.log(expense_list[i].lender_id._id, expense_list[i].borrow_id._id, expense_list[i].lender_id._id.toString() == expense_list[i].borrow_id._id)
    //         if (expense_list[i].lender_id._id.toString() == expense_list[i].borrow_id._id.toString()){

    //         }
    //         else if (expense_list[i].borrow_id._id == id){
    //             if (expense_list[i].lender_id._id in ledger) {
    //                 ledger[expense_list[i].lender_id._id].push({color:"red", expense: expense_list[i].expense, person: expense_list[i].lender_id.fname, ename: expense_list[i].expense_name})
    //                 object[expense_list[i].lender_id._id] = object[expense_list[i].lender_id._id] - expense_list[i].expense
    //             }
    //             else{
    //                 ledger[expense_list[i].lender_id._id] = []
    //                 object[expense_list[i].lender_id._id] = 0.0
    //                 ledger[expense_list[i].lender_id._id].push({color:"red", expense: expense_list[i].expense, person: expense_list[i].lender_id.fname, ename: expense_list[i].expense_name})
    //                 object[expense_list[i].lender_id._id] = 0.0 - expense_list[i].expense
    //             }
    //         }
    //         else if (expense_list[i].lender_id._id == id){
    //             if (expense_list[i].borrow_id._id in ledger) {
    //                 ledger[expense_list[i].borrow_id._id].push({color:"green", expense: expense_list[i].expense, person: expense_list[i].borrow_id.fname, ename: expense_list[i].expense_name})
    //                 object[expense_list[i].borrow_id._id] = object[expense_list[i].borrow_id._id] + expense_list[i].expense
    //             }
    //             else{
    //                 ledger[expense_list[i].borrow_id._id] = []
    //                 object[expense_list[i].borrow_id._id] = 0.0
    //                 ledger[expense_list[i].borrow_id._id].push({color:"green", expense: expense_list[i].expense, person: expense_list[i].borrow_id.fname, ename: expense_list[i].expense_name})
    //                 object[expense_list[i].borrow_id._id] = expense_list[i].expense
    //             }
    //         }
    //     }
    //     console.log(ledger)
    //     console.log(object)
    //     const final_data = {accounts: ledger, balance: object}
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end(JSON.stringify(final_data))
    // }
    
})

app.post('/settleUp', function(req,res){
    const payload = { body: req.body};
    kafka.make_request(SETTLE_UP, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.message);
    }
  });
    // console.log(req.body)
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(203,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // if (false){
    //     settle_values = ''
    // const settle_data = req.body.settle
    // let keys = Object.keys(settle_data)
    // for (let i in keys){
    //     if (settle_data[keys[i]] > 0){
    //         settle_values = settle_values + `(${keys[i]}, ${id}, ${settle_data[keys[i]]}, 0, 0, \'settle_up\'), `
    //     }
    //     else {
    //         settle_values = settle_values + `(${id}, ${keys[i]}, ${settle_data[keys[i]] * -1}, 0, 0, \'settle_up\'), `
    //     }
    // }
    // settle_values = settle_values.substring(0, settle_values.length-2)
    // const sqlQuery = `INSERT INTO iExpense(lender_id,borrow_id,expense,group_id,expense_id, expense_name) VALUES ${settle_values} ;`
    // console.log(sqlQuery)
    // db.query(sqlQuery, (err, result, fields) => {
    //     if (!err){
    //         console.log(result)
    //         res.writeHead(200,{
    //             'Content-Type' : 'text/plain'
    //         })
    //         res.end("Successful Submission");    
    //     }
    //     else {
    //         console.log(err)
    //         res.writeHead(204,{
    //             'Content-Type' : 'text/plain'
    //         })
    //         res.end("Issue with data base")
    //     }
    // })
    // }
    // else{
    //     const settle_data = req.body.settle
    //     const date_string = new Date().toISOString()
    //     let settle_entry = []
    //     let keys = Object.keys(settle_data)
    //     for (let i in keys){
    //         if (settle_data[keys[i]] > 0){
    //             settle_entry.push({
    //                 lender_id: keys[i],
    //                 borrow_id: id,
    //                 expense_name: 'Settle Up Amount',
    //                 expense: settle_data[keys[i]],
    //                 date: date_string,
    //             })
    //         }
    //         else {
    //             settle_entry.push({
    //                 lender_id: keys[i],
    //                 borrow_id: id,
    //                 expense_name: 'Settle Up Amount',
    //                 expense: settle_data[keys[i]] * -1,
    //                 date: date_string,
    //             })
    //         }
    //     }
    //     iExpense.insertMany(settle_entry, (err,docs) => {
    //         if (err){
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //         else {
    //             console.log(docs)
    //             res.writeHead(200,{
    //             'Content-Type' : 'text/plain'
    //                 })
    //             res.end("Successful Submission");
    //         }
    //     })
    // }
    
})

app.post('/groupSuggest', async function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(GROUP_SUGGEST, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // if (false){
    //     const sqlQuery = `SELECT email AS em FROM userInfo;`
    //     let list = [];
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             console.log("Result, ")
    //             for (let i in result){
    //                 list.push(result[i].em)
    //             }
    //             res.writeHead(200,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             console.log(list)
    //             const final_data = {list: list}
    //             res.end(JSON.stringify(final_data));    
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     const user = await User.find()
    //     let list = []
    //     for (let i in user){
    //         list.push(user[i].email)
    //     }
    //     res.writeHead(200,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     console.log(list)
    //     const final_data = {list: list}
    //     res.end(JSON.stringify(final_data)); 
    // }
    
})

app.post('/groupExit',async function(req,res) {
    const payload = { body: req.body};
    kafka.make_request(GROUP_EXIT, payload, (error, results) => {
    if (!results.success) {
      res.status(results.status).send(results.message);
    } else {
      res.status(results.status).send(results.data);
    }
  });
    // const id = get_id(req.body.token)
    // if (!id){
    //     res.writeHead(204,{
    //         'Content-Type' : 'text/plain'
    //     })
    //     res.end("Token has expired")
    //     return
    // }
    // console.log(req.body)
    // const group_id = req.body.group_id;
    // if (false) {
    //     let sqlQuery = `Select * FROM iExpense WHERE group_id = ${group_id} OR group_id = 0`
    //     db.query(sqlQuery, (err, result) => {
    //         if (!err){
    //             let balance = 0.0
    //             for (let i in result){
    //                 if (result[i].lender_id === result[i].borrow_id){
    //                     continue
    //                 }
    //                 if (result[i].lender_id === id){
    //                     balance =  balance + result[i].expense
    //                 }
    //                 else if (result[i].borrow_id === id){
    //                     balance = balance - result[i].expense
    //                 }
    //             }
    //             if (balance < 0){
    //                 balance = balance * -1
    //             }
    //             if (balance > 0.01){
    //                 const data = {message: "Group Not Settled"}
    //                 res.writeHead(200,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end(JSON.stringify(data));
    //             }
    //             else {
    //                 sqlQuery = `DELETE FROM groupMem WHERE group_id = ${group_id} AND member_id = ${id}`
    //                 db.query(sqlQuery, (err, result) => {
    //                     if (!err){
    //                         const data = {message: "Group Settled"}
    //                         res.writeHead(200,{
    //                             'Content-Type' : 'text/plain'
    //                         })
    //                         res.end(JSON.stringify(data));
    //                     }
    //                 });
    //             }   
    //         }
    //         else {
    //             console.log(err)
    //             res.writeHead(204,{
    //                 'Content-Type' : 'text/plain'
    //             })
    //             res.end("Issue with data base")
    //         }
    //     })
    // }
    // else {
    //     const ind_expense = await iExpense.find({group_id: group_id})
    //     let balance = 0.0
    //     for (let i in ind_expense){
    //         if (ind_expense[i].lender_id.toString == id){
    //             balance = balance + ind_expense[i].expense
    //         }
    //         else if (ind_expense[i].borrow_id.toString == id){
    //             balance = balance - ind_expense[i].expense
    //         }
    //     }
    //     if (balance < 0){
    //         balance = balance * -1
    //     }
    //     if (balance > 0.01){
    //         const data = {message: "Group Not Settled"}
    //         res.writeHead(200,{
    //             'Content-Type' : 'text/plain'
    //         })
    //         res.end(JSON.stringify(data));
    //     }
    //     else {
    //         Group.findByIdAndUpdate(
    //             req.body.group_id,
    //             {$pull: {member: id}})
    //         .then((result,err) => {
    //             if(err){
    //                 console.log(err)
    //                 res.writeHead(204,{
    //                         'Content-Type' : 'text/plain'
    //                 })
    //                 res.end("Issue with data base")
    //             }
    //             else{
    //                 const data = {message: "Group Settled"}
    //                 res.writeHead(200,{
    //                     'Content-Type' : 'text/plain'
    //                 })
    //                 res.end(JSON.stringify(data));
    //             }
    //         })
    //     }
    // }
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
    if (!userID){
        res.writeHead(204,{
            'Content-Type' : 'text/plain'
        })
        res.end("Token has expired")
        return
    }
    const fileName = req.files.profileImage.name.split(',')[0];
    console.log(__dirname);
    var pathToImage = path.join(__dirname, './public');

    const filePathwithoutfileName = pathToImage + '/images/profilepics/' + userID;
    console.log(filePathwithoutfileName);
    const filePath = pathToImage + '/images/profilepics/' + userID + '/' + fileName;

    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    file.mv(filePath, async err => {
        if (err) {
            return res.status(500).end(err);
        }
        else {
            console.log(fileName, " -----", userID)
            if (false){
                // var sql = `UPDATE userInfo SET image='${fileName}' WHERE id=${userID}`;
                // db.query(sql, (err, results) => {
                //     if (err) {
                //         console.log(err);
                //         res.status(400).end("Error:", err);
                //     }
                // });
            }
            else {
                const val = await User.findById(userID)
                val.image = fileName
                val.save((err) => {
                    console.log
                    if ( err && err.code !== 11000 ) {
                        res.status(204).send("Database Issue");
                        return
                    }
                    if ( err && err.code === 11000 ) {
                        res.status(204).send("Database Issue");
                        return
                    }
                    res.status(200).send("UpDate Successful");
                })

            }
            
        }
    })
    
});

app.post('/imagegroupupdate', function(req,res) {
    if (req.files === null) {
        return res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    var x = req.files.profileImage.name.split(',')[1];
    const userID = x;
    const fileName = req.files.profileImage.name.split(',')[0];
    console.log(__dirname);
    var pathToImage = path.join(__dirname, './public');

    const filePathwithoutfileName = pathToImage + '/images/grouppics/' + userID;
    console.log(filePathwithoutfileName);
    const filePath = pathToImage + '/images/grouppics/' + userID + '/' + fileName;

    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    file.mv(filePath, async err => {
        if (err) {
            return res.status(500).end(err);
        }
        else {
            if (false){
                // var sql = `UPDATE userInfo SET image='${fileName}' WHERE id=${userID}`;
                // db.query(sql, (err, results) => {
                //     if (err) {
                //         console.log(err);
                //         res.status(400).end("Error:", err);
                //     }
                // });
            }
            else {
                const val = await Group.findById(userID)
                val.group_pic = fileName
                val.save((err) => {
                    console.log
                    if ( err && err.code !== 11000 ) {
                        res.status(204).send("Database Issue");
                        return
                    }
                    if ( err && err.code === 11000 ) {
                        res.status(204).send("Database Issue");
                        return
                    }
                    res.status(200).send("UpDate Successful");
                })

            }
        }
    })
});