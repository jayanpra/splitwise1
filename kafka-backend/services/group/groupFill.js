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
    if (false){
        let sqlQuery = `SELECT T1.group_id AS gid, T1.active AS act, T2.group_name AS name, T2.group_Pic as pic 
                    FROM groupMem AS T1 LEFT JOIN groupInfo AS T2 ON  T1.group_id = T2.group_id 
                    WHERE T1.member_id = ${id};`
        let group_list=[];
        let expenses=[];
        let pic=null;
        db.query(sqlQuery, (err, result) => {
            if (!err){
                pic = result[0].pic
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
                        const finaldata = {group:group_list, expense: expenses, pics: pic}
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
    }
    else{
        let group_list =[];
        const group = await Group.find({member: id}).populate({path: 'expense', populate: {path: 'payee'}})
        for (let i in group){
            group_list.push({name:group[i].group_name, id:group[i]._id, active: 'active'})
        }
        const request = await Member.find({member_id: id}).populate('group_id')
        for (let i in request){
            group_list.push({name:request[i].group_id.group_name, id:request[i].group_id._id, active: 'passive'})
        }
        console.log(group_list)
        if (group.length === 0 || group[0].expense.length === 0){
            const finaldata = {group:group_list, expense: []}
            callback(null, {
                status: 200,
                data: finaldata,
                success: true,
            })
            return
        }
        else{
            let expenses = []
            for (let i in group[0].expense){
                if (group[0].expense[i].payee._id == id) {
                    expenses.push({ expense_id: group[0].expense[i]._id,
                                    expense_name: group[0].expense[i].expense_name, 
                                    date:group[0].expense[i].date, 
                                    shares:group[0].expense[i].shares, 
                                    payee: group[0].expense[i].payee.fname, 
                                    amount: group[0].expense[i].amount, color:'green'})
                }
                else{
                    expenses.push({ expense_id: group[0].expense[i]._id,
                        expense_name: group[0].expense[i].expense_name, 
                        date:group[0].expense[i].date, 
                        shares:group[0].expense[i].shares, 
                        payee: group[0].expense[i].payee.fname, 
                        amount: group[0].expense[i].amount, color:'red'})
                }
            }
            const finaldata = {group:group_list, expense: expenses}
            callback(null, {
                status: 200,
                data: finaldata,
                success: true,
            })
        }
    }
}

exports.handle_request = handle_request;