const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const i_Expense = new Schema({
    lender_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    borrow_id: { type: Schema.Types.ObjectId, ref: 'User', required: true},
    group_id: {type: Schema.Types.ObjectId, ref: 'Group'},
    expense_id: {type: Schema.Types.ObjectId, ref: 'gExpense'},
    expense_name: {type: String, required: true},
    expense: {type: Number, required: true},
    date: {type: Date, required: true},
})

  module.exports = mongoose.model("iExpense", i_Expense)