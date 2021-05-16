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
            message: "Token has expired",
            success: false,
        })
        return
    }
    if (false) {
        let sqlQuery = `INSERT INTO groupInfo (group_Name,owner_id) VALUES (\'${req.body.group_name}\',\'${id}\');`
        let group_id, user_list ;
        db.query(sqlQuery, (err, result) => {
            if (!err){
                group_id = result.insertId;
                user_list = '';
                for (i in req.body.group_members) {
                    user_list = user_list + `\'${req.body.group_members[i]}\', `
                }
                user_list = user_list.substring(0, user_list.length-2)
                sqlQuery = `Select id FROM userInfo WHERE email IN (${user_list});`;
                let act_user_list = []
                db.query(sqlQuery, (err, result) => {
                    if (!err){
                        let values = `(${group_id}, ${id}, 'active'), `;
                        for (let i in result){
                            values = values + `(${group_id}, ${result[i].id}, 'inactive'), `
                        }
                        values = values.substring(0, values.length-2)
                        sqlQuery = `INSERT INTO groupMem (group_id, member_id, active) VALUES ${values};`;
                        db.query(sqlQuery, (err, result) => {
                            if (!err){
                                res.writeHead(200,{
                                    'Content-Type' : 'text/plain'
                                })
                            res.end("Sucessful Operation")
                            }
                            else {
                                res.writeHead(204,{
                                    'Content-Type' : 'text/plain'
                                })
                                res.end("Issue with data base")
                            }
                        })
                    }
                    else {
                        res.writeHead(204,{
                            'Content-Type' : 'text/plain'
                        })
                        res.end("Issue with data base")
                    }
                })
            }
            else {
                res.writeHead(204,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Issue with data base")
            }
        })
    }
    else{
        console.log("id is ",id)
        const group = new Group({
            group_name: req.body.group_name,
            owner: id,
            member: [id],
        })
        const group_id = group._id
        await group.save((err) => {
            console.log
            if ( err && err.code !== 11000 ) {
                console.log(err)
                callback(null, {
                    status: 400,
                    message: "Database Issue",
                    success: false,
                })
                return
            }
            if ( err && err.code === 11000 ) {
                callback(null, {
                    status: 204,
                    message: 'duplicate element',
                    success: false
                })
                return
            }
        })
        const ps_member = await User.find({email: req.body.group_members})
        let member = []
        for (let i in ps_member){
            member.push({group_id: group_id, member_id: ps_member[i]._id, status: 'passive'})
        }
        Member.insertMany(member).then((result,err) => {
            if (!err) {
                callback(null, {
                    status: 200,
                    message: "Successful Submission",
                    success: true,
                })
            }
            else{
                callback(null, {
                    status: 400,
                    message: "Database Issue",
                    success: false,
                })
            }
        })
    }
}

exports.handle_request = handle_request;