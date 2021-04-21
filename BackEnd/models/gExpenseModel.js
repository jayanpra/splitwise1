const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const g_Expense = new Schema({
    date: {type: Date, required: true},
    payee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: {type: Number, required: true },
    shares: {type: Number, required: true },
    expense_name: { type: String, required: true},
    comment: [{comment: { type: String, required: true}, author: { type: Schema.Types.ObjectId, ref: 'User', required: true }}],
})

  module.exports = mongoose.model("gExpense", g_Expense)