const User = require('../../models/userModel')
const get_id = require('../../models/verifyToken');

const handle_request = async (req, callback) => {
    console.log("inside get_profile", req.body)
    const id = get_id(req.body.token)
    if (!id){
        callback(null, {
            status: 203,
            message: "Token has expired",
            success: false,
        })
        return
    }
    console.log(get_id(req.body.token)," is ID")
    if (false) {
        const sqlQuery = `SELECT * from userInfo WHERE id=${id}`
        console.log(sqlQuery)
        db.query(sqlQuery, (err, result, fields) => {
            if (!err){
                console.log(result)
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                let pic_path;
                if (result[0].image!=null) {
                    pic_path = "/images/profilepics/"+ id + "/"+result[0].image
                }
                else{
                    pic_path=null
                }
                const endData = {auth:true, 
                    name: result[0].fname + " " + result[0].lname,
                    email: result[0].email,
                    phone: result[0].phone,
                    pic : pic_path, 
                    currency: result[0].currency,
                    timezone: result[0].timezone,
                    language: result[0].language}
                res.end(JSON.stringify(endData));    
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
        User.findOne({_id:id}, (err, user) => {
            if (!err) {
                const endData = {
                    auth:true, 
                    name: user.fname + " " + user.lname,
                    email: user.email,
                    phone: 'phone' in user ? user.phone : null,
                    pic : 'image' in user ? `${id}/${user.image}` : null, 
                    currency: 'currency' in user ? user.currency : USD, 
                    timezone: 'timezone' in user ? user.timezone : null, 
                    language: 'language' in user ? user.language : null, 
                }
                callback(null, {
                    status: 200,
                    data: endData,
                    success: true,
                })
            }
            else {
                callback(null, {
                    status: 204,
                    message: "Database Issue",
                    success: false,
                })
            }
        })
    }
};

exports.handle_request = handle_request;