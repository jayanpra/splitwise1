const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const mysql = require('mysql')
const app = express();
const cors = require('cors')
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql')
const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');
const jwtoken= require('jsonwebtoken');
const passport = require("passport");
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')
const kafka = require('./kafka/client')
const dotenv = require('dotenv')
const dbSQL = true
const QlSchema = require("./QlSchema/schema")
const QlResolver = require('./QlResolvers/userResolver')
const {GET_PROFILE, SAVE_PROFILE, GET_DASH, SETTLE_UP, ADD_COMMENT, ADD_EXPENSE, GET_COMMENT, GROUP_APPROVE, GROUP_CHANGE, GROUP_CREATE, GROUP_EXIT, GROUP_FILL, GROUP_SUGGEST, LOGIN, REGISTER} = require('./kafka/topics')

const { initializePassport } = require("./passport");
const { requireSignIn } = require("./passport");
app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use(express.static(path.resolve('./public')));
// Using Passport for authentication
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
dotenv.config()

const db = mysql.createPool({
    host: "database-2.copvz5nsdbwv.us-west-2.rds.amazonaws.com",
    user: "admin",
    password: "password",
    database: "splitwiseStorage"
})
// const kafka = new Kafka({
//     clientId: "splitwise",
//     brokers: ['localhost:9091', 'localhost:9092']
// })

mongoose.connect('mongodb+srv://jayant29:jayant29@splitwise.spixx.mongodb.net/splitwiseStorage?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology:true},
    (req,res) => {
        console.log("Connected to mongodb")
    }
)

app.use('/graphql', 
  graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
  graphqlHTTP({
    schema: QlSchema,
    rootValue: QlResolver,
    graphiql: true
}))
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


app.listen(3001, () => {
    console.log("listening on port 3001")
})
