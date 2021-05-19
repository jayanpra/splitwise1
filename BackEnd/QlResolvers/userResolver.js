const jwtoken= require('jsonwebtoken');
const hashFunction = require('password-hash');
const User = require('../models/userModel')
const Group = require('../models/groupModel')
const gExpense = require('../models/gExpenseModel')
const iExpense = require('../models/iExpenseModel')
const Member = require('../models/memberModel')

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

module.exports = {
    checkLogin: async args => {
    const payload = { body: {email: args.email, password: args.password}};
    const user = await User.findOne({email: args.email})
    if (typeof user !== 'object'){
        return {status: 205, 
            data: null, 
            message: "Database Issue"
        }
    }
    if (hashFunction.verify(args.password, user.password)){
        const token = jwtoken.sign({data: user._id},"jwtSecret", {
                    expiresIn: '1h'
        })
        return {
            status: 200, 
            data: {
                token: token, 
                name: user.fname,
                currency: user.currency
            }, 
            message: "message true"
        }
    }
    else {
        return {
            status: 203,  
            data: null, 
            message: "Invalid Credentials"
        }
    }
},

registerUser: async args => {
    console.log("in here")
    const record = new User({
        fname: args.fname,
        lname: args.lname,
        email: args.email,
        password: hashFunction.generate(args.password),
        currency: "USD",
    })
    const id = record._id
    try {
        await record.save()
        const token = jwtoken.sign({data: id},"jwtSecret", {
            expiresIn: '1h'
        });
        return {
            status: 200, 
            data: {
                token: token, 
                name: record.fname,
                currency: "USD"
            }, 
            message: "message true"
        }
    }
    catch(err) {
        if (err.keyPattern && err.keyPattern.email === 1) {
            return {
                status: 203,  
                data: null, 
                message: "User Already Exist"
            }
        }
        else {
            return {
                status: 204,  
                data: null, 
                message: "DataBase Issue"
            }
        }
    }
},

getDash: async args => {
        const id = get_id(args.token)
        console.log("In here")
        if (!id){
            return {
                status: 203,
                data: null,
                message: "no Token"
            }
        }
        let ledger = new Object();
        let object = new Object();
        if (false){
            
        }
        else {
            const expense_list = await iExpense.find({$or: [{lender_id: id}, {borrow_id: id}]
            }).populate('lender_id').populate('borrow_id')
            console.log(expense_list)
            for (let i in expense_list){
                if (expense_list[i].lender_id._id.toString() == expense_list[i].borrow_id._id.toString()){
    
                }
                else if (expense_list[i].borrow_id._id == id){
                    if (expense_list[i].lender_id._id in ledger) {
                        ledger[expense_list[i].lender_id._id].push({color:"red", expense: expense_list[i].expense, person: expense_list[i].lender_id.fname, ename: expense_list[i].expense_name})
                        object[expense_list[i].lender_id._id] = object[expense_list[i].lender_id._id] - expense_list[i].expense
                    }
                    else{
                        ledger[expense_list[i].lender_id._id] = []
                        object[expense_list[i].lender_id._id] = 0.0
                        ledger[expense_list[i].lender_id._id].push({color:"red", expense: expense_list[i].expense, person: expense_list[i].lender_id.fname, ename: expense_list[i].expense_name})
                        object[expense_list[i].lender_id._id] = 0.0 - expense_list[i].expense
                    }
                }
                else if (expense_list[i].lender_id._id == id){
                    if (expense_list[i].borrow_id._id in ledger) {
                        ledger[expense_list[i].borrow_id._id].push({color:"green", expense: expense_list[i].expense, person: expense_list[i].borrow_id.fname, ename: expense_list[i].expense_name})
                        object[expense_list[i].borrow_id._id] = object[expense_list[i].borrow_id._id] + expense_list[i].expense
                    }
                    else{
                        ledger[expense_list[i].borrow_id._id] = []
                        object[expense_list[i].borrow_id._id] = 0.0
                        ledger[expense_list[i].borrow_id._id].push({color:"green", expense: expense_list[i].expense, person: expense_list[i].borrow_id.fname, ename: expense_list[i].expense_name})
                        object[expense_list[i].borrow_id._id] = expense_list[i].expense
                    }
                }
            }
            const dash = []
            for (const [key, value] of Object.entries(ledger)) {
                    dash.push({key: key, data: value})
                
            }
            const balance = []
            for (const [key, value] of Object.entries(object)) {
                balance.push({key: key, value: value})
            }
            const final_data = {accounts: dash, balances: balance}
            console.log(final_data.balance)
            return {status: 200, data: final_data, message:"success"}
        }
    
    },
    getProfile: async args => {
        const id = get_id(args.token)
        if (!id){
            return {
                status: 203,
                data: null,
                message: "Token has expired",
            }
        }
        try{
            const user = await User.findOne({_id:id})
            const endData = {
                    name: user.fname + " " + user.lname,
                    email: user.email,
                    phone: user.phone ? user.phone : '',
                    pic : user.image ? `${id}/${user.image}` : '', 
                    currency: user.currency ? user.currency : 'USD', 
                    timezone: user.timezone ? user.timezone : '', 
                    language: user.language ? user.language : '', 
                }
            console.log(endData)
            return {
                    status: 200,
                    response: endData,
                    message: "Successfully Get",
            }
        }
        catch(err) {
            return {
                    status: 203,
                    data: null,
                    message: "DataBase Issue",
            }
        }
    },
    saveProfile: async args => {
        const id = get_id(args.token)
        const field = args.data.type
        const value = args.data.value
        if (!id){
            callback(null, {
                message: "Token has expired",
                success: false,
            })
            return
        }
    }
}