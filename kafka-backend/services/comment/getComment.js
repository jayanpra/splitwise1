const User = require('../../models/userModel')
const gExpense = require('../../models/gExpenseModel')
const iExpense = require("../../models/iExpenseModel")
const Group = require("../../models/groupModel")
const get_id = require('../../models/verifyToken');

const handle_request = async (req, callback) => {
    const id = get_id(req.body.token)
    if (!id){
        callback(null, {
            status:203,
            message: "Token has expired",
            success: false,
        })
        return
    }
    if (false){

    }
    else{
        console.log(req.body)
        const c_Expense = await gExpense.find({_id: req.body.expense_id}).populate({path:'comment', populate:{path:'author'}})
        let comments = []
        console.log(c_Expense)
        if (c_Expense[0]){
            for (let i in c_Expense[0].comment){
                comments.push({text: c_Expense[0].comment[i].comment, author: c_Expense[0].comment[i].author.fname + " " + c_Expense[0].comment[i].author.lname})
            }
        }
        const finaldata = {comment_list: comments}
        callback(null, {
            status: 200,
            data: finaldata,
            success: true,
        })
    }
}

exports.handle_request = handle_request;