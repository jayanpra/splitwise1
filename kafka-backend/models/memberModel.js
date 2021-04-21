const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const member = new Schema({
    group_id: {type: Schema.Types.ObjectId, ref: 'Group', required: true},
    member_id: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: true },
})

  module.exports = mongoose.model("Member", member)