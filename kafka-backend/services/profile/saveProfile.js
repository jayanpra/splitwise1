const User = require('../../models/userModel')
const get_id = require('../../models/verifyToken');

const handle_request = async (req, callback) => {
    const id = get_id(req.body.token)
    const field = req.body.data.type
    const value = req.body.data.value
    if (!id){
        callback(null, {
            message: "Token has expired",
            success: false,
        })
        return
    }
    if (false){
        const sqlQuery = `UPDATE userInfo SET ${req.body.data.type} = \'${req.body.data.value}\' WHERE id=${id};`
        console.log(sqlQuery)
        db.query(sqlQuery, (err, result, fields) => {
            if (!err){
                console.log(result)
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                res.end("Successful Submission");    
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
        const val = await User.findById(id)
        switch (field){
            case 'name':{
                let name_list = value.split(" ")
                val.lname = ''
                for (let i in name_list){
                    if (i==0){
                        val.fname = name_list[0]
                    }
                    else if (i == 1){
                        val.lname = name_list[1]
                    }
                    else{
                        val.lname = val.lname + " " + name_list[i]
                    }
                }
                break
            }
            case 'email': {
                val.email = value
                break
            }
            case 'phone': {
                val.phone = value
                break
            }
            case 'currency':{
                val.currency = value
                break;
              }
            case 'timezone':{
                val.timezone = value
                break;
              }
            case 'language':{
                val.language = value
                break;
            }
            default:
                break;
        }
        console.log(field, " is a field", value)
        console.log(val)
        val.save((err) => {
            console.log
            if ( err && err.code !== 11000 ) {
                console.log(err)
                callback(null, {
                    message: "Database Issue",
                    success: false,
                })
                return
            }
            if ( err && err.code === 11000 ) {
                callback(null, {
                    message: 'duplicate element',
                    success: false
                })
                return
            }
            callback(null, {
                message: 'successful submission',
                success: true
            })
        })
    }
};

exports.handle_request = handle_request;