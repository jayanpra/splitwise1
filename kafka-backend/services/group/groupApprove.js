const User = require('../../models/userModel')
const gExpense = require('../../models/gExpenseModel')
const iExpense = require("../../models/iExpenseModel")
const Group = require("../../models/groupModel")
const Member = require("../../models/memberModel")
const get_id = require('../../models/verifyToken');

const handle_request = async (req, callback) => {
    const id = get_id(req.body.token)
    if (!id){
        callback(null, {
            status: 203,
            message: "Token has expired",
            success: false,
        })
        return
    }
    let expenses=[];
    if (false){
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
    }
    else {
        console.log(req.body.group_id)
        Group.findByIdAndUpdate(
            req.body.group_id,
            {$push: {member: id}}).then((result,err) => {
                if(err){
                    console.log(err)
                    callback(null, {
                        status: 400,
                        message: 'issue with database',
                        success: false,
                    })
                    return
                }
                else{
                    console.log(err)
                }
            })
        Member.findOneAndDelete({member_id: id, group_id: req.body.group_id},((err) => {
            if(err) {
                console.log(err);
                callback(null, {
                    status: 400,
                    message: 'issue with database',
                    success: false,
                })
            }
            else {
                callback(null, {
                    status: 200,
                    message: 'successful submission',
                    success: true,
                })
            }
            
          }))
    }
}

exports.handle_request = handle_request;