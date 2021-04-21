const jwtoken= require('jsonwebtoken');

const get_id = (token) => {
    if (!token){
        return null;
    }
    else {
        let data
        jwtoken.verify(token,"jwtSecret", (err,decoded) => {
            if (err) {
                data = null;
            }
            else {
                data = decoded['data'];
            }
        })
        return data;
    }
}

module.exports = get_id;