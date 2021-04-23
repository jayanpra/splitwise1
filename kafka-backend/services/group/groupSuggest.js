const User = require('../../models/userModel')

const handle_request = async (req, callback) => {
    if (false){
        const sqlQuery = `SELECT email AS em FROM userInfo;`
        let list = [];
        db.query(sqlQuery, (err, result) => {
            if (!err){
                console.log("Result, ")
                for (let i in result){
                    list.push(result[i].em)
                }
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log(list)
                const final_data = {list: list}
                res.end(JSON.stringify(final_data));    
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
        const user = await User.find()
        let list = []
        for (let i in user){
            list.push(user[i].email)
        }
        const final_data = {list: list}
        callback(null, {
            status: 200,
            data: final_data,
            success: true,
        })
    }
}

exports.handle_request = handle_request;