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
    if (false){
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
    }
    else{
        const settle_data = req.body.settle
        const date_string = new Date().toISOString()
        let settle_entry = []
        let keys = Object.keys(settle_data)
        for (let i in keys){
            if (settle_data[keys[i]] > 0){
                settle_entry.push({
                    lender_id: keys[i],
                    borrow_id: id,
                    expense_name: 'Settle Up Amount',
                    expense: settle_data[keys[i]].toFixed(2),
                    date: date_string,
                })
            }
            else {
                settle_entry.push({
                    lender_id: id,
                    borrow_id: keys[i],
                    expense_name: 'Settle Up Amount',
                    expense: settle_data[keys[i]].toFixed(2) * -1,
                    date: date_string,
                })
            }
        }
        iExpense.insertMany(settle_entry, (err,docs) => {
            if (err){
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
        })
    }
}

exports.handle_request = handle_request;