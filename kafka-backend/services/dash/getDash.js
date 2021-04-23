const User = require('../../models/userModel')
const gExpense = require('../../models/gExpenseModel')
const iExpense = require("../../models/iExpenseModel")
const Group = require("../../models/groupModel")
const get_id = require('../../models/verifyToken');

const handle_request = async (req, callback) => {
    const id = get_id(req.body.token)
    if (!id){
        callback(null, {
            status: 204,
            message: "Token has expired",
            success: false,
        })
        return
    }
    let ledger = new Object();
    let object = new Object();
    if (false){
        
    }
    else {
        const expense_list = await iExpense.find({$or: [{lender_id: id}, {borrow_id: id}]
        }).populate('lender_id').populate('borrow_id')
        console.log(expense_list)
        for (let i in expense_list){
            if (expense_list[i].lender_id._id.toString() == expense_list[i].borrow_id._id.toString()){

            }
            else if (expense_list[i].borrow_id._id == id){
                if (expense_list[i].lender_id._id in ledger) {
                    ledger[expense_list[i].lender_id._id].push({color:"red", expense: expense_list[i].expense, person: expense_list[i].lender_id.fname, ename: expense_list[i].expense_name})
                    object[expense_list[i].lender_id._id] = object[expense_list[i].lender_id._id] - expense_list[i].expense
                }
                else{
                    ledger[expense_list[i].lender_id._id] = []
                    object[expense_list[i].lender_id._id] = 0.0
                    ledger[expense_list[i].lender_id._id].push({color:"red", expense: expense_list[i].expense, person: expense_list[i].lender_id.fname, ename: expense_list[i].expense_name})
                    object[expense_list[i].lender_id._id] = 0.0 - expense_list[i].expense
                }
            }
            else if (expense_list[i].lender_id._id == id){
                if (expense_list[i].borrow_id._id in ledger) {
                    ledger[expense_list[i].borrow_id._id].push({color:"green", expense: expense_list[i].expense, person: expense_list[i].borrow_id.fname, ename: expense_list[i].expense_name})
                    object[expense_list[i].borrow_id._id] = object[expense_list[i].borrow_id._id] + expense_list[i].expense
                }
                else{
                    ledger[expense_list[i].borrow_id._id] = []
                    object[expense_list[i].borrow_id._id] = 0.0
                    ledger[expense_list[i].borrow_id._id].push({color:"green", expense: expense_list[i].expense, person: expense_list[i].borrow_id.fname, ename: expense_list[i].expense_name})
                    object[expense_list[i].borrow_id._id] = expense_list[i].expense
                }
            }
        }
        console.log(ledger)
        console.log(object)
        const final_data = {accounts: ledger, balance: object}
        callback(null, {
            status: 200,
            data: final_data,
            success: true,
        })
    }
}

exports.handle_request = handle_request;