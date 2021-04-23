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
    const group_name = req.body.group_name;
    const expense = req.body.expense;
    const expense_name = req.body.expense_name;
    if (false) {
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
    }
    else {
        const group = await Group.findOne({group_name: req.body.group_name})
        const shares = group.member.length
        const date_string = new Date().toISOString()
        const g_exp = new gExpense({
            date: date_string,
            payee: id,
            amount: req.body.expense,
            shares: shares,
            expense_name: req.body.expense_name,
            comment: [],
        });
        g_exp.save()
        const expense_per_person = (expense / parseFloat(shares)).toFixed(2);
        for (i in group.member){
            const i_exp = new iExpense({
                lender_id: id,
                borrow_id: group.member[i],
                group_id: group._id,
                expense_id: g_exp._id,
                expense_name: req.body.expense_name,
                expense: expense_per_person,
                date: date_string,
            })
            i_exp.save()
        }
        group.expense.push(g_exp._id)
        group.save((err) => {
            if (!err) {
                callback(null, {
                    status: 200,
                    message: "Successful Submission",
                    success: true,
                })
            }
            else{
                callback(null, {
                    status: 204,
                    message: "DataBase Issue",
                    success: false,
                })
            }
        })

    }
}

exports.handle_request = handle_request;