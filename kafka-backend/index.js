const express = require('express');
// const mysql = require('mysql')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const hashFunction = require('password-hash');
const fileUpload = require('express-fileupload');
const jwtoken= require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose')
// const {Kafka} = require('kafkajs')
const Kafka = require('kafka-node')
const dotenv = require('dotenv')
const dbSQL = true
const connection = require('./kafka/connection')


app.set('view engine', 'ejs');
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use(express.static(path.resolve('./public')));
dotenv.config()

const {GET_PROFILE, SAVE_PROFILE, GET_DASH, SETTLE_UP, ADD_COMMENT, ADD_EXPENSE, GET_COMMENT, GROUP_APPROVE, GROUP_CHANGE, GROUP_CREATE, GROUP_EXIT, GROUP_FILL, GROUP_SUGGEST, LOGIN, REGISTER} = require('./kafka/topics');


const getProfile = require('./services/profile/getProfile');
const saveProfile = require('./services/profile/saveProfile');
const getDash = require('./services/dash/getDash');
const addExpense = require('./services/dash/addExpense')
const settleUp = require('./services/dash/settleUp')
const addComment = require('./services/comment/addComment')
const getComment = require('./services/comment/getComment')
const groupApprove = require('./services/group/groupApprove')
const groupChange = require('./services/group/groupChange')
const groupCreate = require('./services/group/groupCreate')
const groupExit = require('./services/group/groupExit')
const groupFill = require('./services/group/groupFill')
const groupSuggest = require('./services/group/groupSuggest')
const login = require('./services/Logister/Login')
const register = require('./services/Logister/Register')

// const db = mysql.createPool({
//     host: "database-2.copvz5nsdbwv.us-west-2.rds.amazonaws.com",
//     user: "admin",
//     password: "password",
//     database: "splitwiseStorage"
// })

mongoose.connect('mongodb+srv://jayant29:jayant29@splitwise.spixx.mongodb.net/splitwiseStorage?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology:true},
    (req,res) => {
        console.log("Connected to mongodb")
    }
)


app.listen(3002, () => {
    console.log("listening on port 3001")
})

function handleTopicRequest(topic_name, fname) {
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log("server is running ");
    consumer.on("message", function (message) {
        console.log("message received for " + topic_name + " ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        fname.handle_request(data.data, function (err, res) {
            console.log("after handle" + res);
            var payloads = [
                {
                    topic: data.replyTo,
                    messages: JSON.stringify({
                        correlationId: data.correlationId,
                        data: res,
                    }),
                    partition: 0,
                },
            ];
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
            return;
        });
    });
}

handleTopicRequest(GET_PROFILE, getProfile);
handleTopicRequest(SAVE_PROFILE, saveProfile);
handleTopicRequest(GET_DASH, getDash);
handleTopicRequest(SETTLE_UP, settleUp);
handleTopicRequest(ADD_EXPENSE, addExpense);
handleTopicRequest(GET_COMMENT, getComment);
handleTopicRequest(ADD_COMMENT, addComment);
handleTopicRequest(LOGIN,login);
handleTopicRequest(REGISTER, register);
handleTopicRequest(GROUP_APPROVE, groupApprove);
handleTopicRequest(GROUP_CHANGE, groupChange);
handleTopicRequest(GROUP_CREATE, groupCreate);
handleTopicRequest(GROUP_EXIT,groupExit);
handleTopicRequest(GROUP_FILL, groupFill);
handleTopicRequest(GROUP_SUGGEST, groupSuggest);

