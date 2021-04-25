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
    }
    else {
        const group = await Group.findOne({_id: req.body.group_id}).populate({path: 'expense', populate: {path: 'payee'}})
        console.log(group)
        if (group.expense.length === 0){
            const finaldata = {expense: []}
            callback(null, {
                status: 200,
                data: finaldata,
                success: true,
            })
        }
        else {
            for (let i in group.expense){
                if (group.expense[i].payee._id === id) {
                    expenses.push({ expense_id: group.expense[i]._id,
                                    expense_name: group.expense[i].exp_name, 
                                    date:group.expense[i].date, 
                                    shares:group.expense[i].shares, 
                                    payee: group.expense[i].payee.fname, 
                                    amount: group.expense[i].amount, color:'green'})
                }
                else{
                    expenses.push({ expense_id: group.expense[i]._id,
                        expense_name: group.expense[i].exp_name, 
                        date:group.expense[i].date, 
                        shares:group.expense[i].shares, 
                        payee: group.expense[i].payee.fname, 
                        amount: group.expense[i].amount, color:'red'})
                }
                const finaldata = {expense: expenses}
                callback(null, {
                    status: 200,
                    data: finaldata,
                    success: true,
                })
            }
        }
    }
}

exports.handle_request = handle_request;