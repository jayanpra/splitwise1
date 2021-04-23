const User = require('../../models/userModel')
const gExpense = require('../../models/gExpenseModel')
const iExpense = require("../../models/iExpenseModel")
const Group = require("../../models/groupModel")
const get_id = require('../../models/verifyToken');

const handle_request = async (req, callback) => {
    console.log(req.body)
    const id = get_id(req.body.token)
    if (!id){
        callback(null, {
            status: 203,
            message: "Token has expired",
            success: false,
        })
        return
    }
    const group_id = req.body.group_id;
    if (false) {
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
    }
    else {
        const ind_expense = await iExpense.find({group_id: group_id})
        let balance = 0.0
        for (let i in ind_expense){
            if (ind_expense[i].lender_id.toString == id){
                balance = balance + ind_expense[i].expense
            }
            else if (ind_expense[i].borrow_id.toString == id){
                balance = balance - ind_expense[i].expense
            }
        }
        if (balance < 0){
            balance = balance * -1
        }
        if (balance > 0.01){
            const data = {message: "Group Not Settled"}
            callback(null, {
                status: 200,
                data: data,
                success: true,
            })
            return
        }
        else {
            Group.findByIdAndUpdate(
                req.body.group_id,
                {$pull: {member: id}})
            .then((result,err) => {
                if(err){
                    console.log(err)
                    callback(null, {
                        status: 400,
                        message: "Database Issue",
                        success: false,
                    })
                    return
                }
                else{
                    const data = {message: "Group Settled"}
                    callback(null, {
                        status: 200,
                        data: data,
                        success: true,
                    })
                }
            })
        }
    }
}

exports.handle_request = handle_request;