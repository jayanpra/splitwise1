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

    }
    else{
        const comment = {comment: req.body.text, author: id}

        const c_Expense = gExpense.findByIdAndUpdate(
            req.body.expense_id,
            {$push: {comment: comment}}).then((result,err) => {
                if(err){
                    callback(null, {
                        status: 204,
                        message: "Database Issue",
                        success: false,
                    })
                }
                else{
                    callback(null, {
                        status: 200,
                        message: "success",
                        success: true,
                    })
                }
            })
    }
}

exports.handle_request = handle_request;