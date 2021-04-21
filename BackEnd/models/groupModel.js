const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupInfo = new Schema({
    group_name: {type: String, required: true, unique: true},
    group_pic: {type: String},
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    member: [{ type: Schema.Types.ObjectId, ref: 'User'}],
    expense: [{ type: Schema.Types.ObjectId, ref: 'gExpense'}],

})

module.exports = mongoose.model("Group", groupInfo)