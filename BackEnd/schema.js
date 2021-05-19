const graphql = require('graphql');
const jwtoken= require('jsonwebtoken');
const hashFunction = require('password-hash');
const User = require('./models/userModel')
const Group = require('./models/groupModel')
const gExpense = require('./models/gExpenseModel')
const iExpense = require('./models/iExpenseModel')
const Member = require('./models/memberModel')

const userNamesDict = {};
async function getUserNameById(id) {
    if (id == null) {
        return '';
    } else if (userNamesDict[id] != null) {
        return userNamesDict[id];
    } else {
        const tempUser = await users.findById(id);
        userNamesDict[id] = tempUser.name;
        return tempUser.name;
    }
}

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

const {
    GraphQLDate,
    GraphQLObjectType,
    GraphQLFloat,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLBoolean,
    GraphQLInt,
    GraphQLList
} = graphql;

const userType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        _id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        currency: { type: GraphQLString },
        pic: { type: GraphQLString },
        language: { type: GraphQLString },
        timezone: { type: GraphQLString },
    })
});
const groupType = new GraphQLObjectType({
    name: 'Group',
    fields: () => ({
        _id: { type: GraphQLID },
        date: { type: GraphQLString },
        payee: { type: GraphQLID },
        amount: { type: new GraphQLList(GraphQLID) },
        expense: { type: new GraphQLList(GraphQLID) },
    })
});
const gExpenseType = new GraphQLObjectType({
    name: 'gExpense',
    fields: () => ({
        _id: { type: GraphQLID },
        date: { type: GraphQLString },
        payee: { type: GraphQLID },
        amount: { type: GraphQLFloat },
        shares: { type: GraphQLInt },
        expense_name: { type: GraphQLString },
        comment: { type: new GraphQLList({comment: {type: GraphQLString}, author:{ type: GraphQLID}})},
    })
}); 
const iExpenseType = new GraphQLObjectType({
    name: 'iExpense', fields: () => ({
        _id: { type: GraphQLID },
        lender_id: { type: GraphQLID },
        borrow_id: { type: GraphQLID },
        group_id: { type: GraphQLID },
        expense_id: { type: GraphQLID },
        expense: { type: GraphQLFloat },
        date: { type: GraphQLString },
    })
});

const memberType = new GraphQLObjectType({
    name: "Member", fields: () => ({
        _id: { type: GraphQLID },
        group_id: { type: GraphQLID },
        member_id: { type: GraphQLID },
        status: { type: GraphQLString },
    })
});


const RootType = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        getProfile: {
            type: userType,
            args: {
                token: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                console.log("Getting User Profile");
                const id = get_id(args.token)
                if (!id){
                    return {
                        msg: "Token has expired",
                        success: true
                    }
                }
                try {
                    const doc = await User.findById(id)
                    if (doc) {
                        return {
                            ...doc.toObject(),
                            name: doc.fname+ " "+ doc.lname,
                            email: doc.email,
                            currency: doc.currency,
                            pic: doc.photo,
                            phone: doc.phone,
                            language: doc.language,
                            timezone: doc.timezone,
                            msg: 'Profile Loaded',
                            success: true
                        };
                    } else {
                        return {
                            msg: 'Profile not found',
                            success: true
                        }
                    }
                } catch (err) {
                    console.log('Error: ', err);
                    return {
                        msg: err.message,
                        success: false
                    }
                }
            }
        },
        getDash: {
            type: iExpenseType,
            args: {
                token: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                const id = get_id(args.token)
                if (!id){
                    return {
                        msg: "Token has expired",
                        success: true
                    }
                }
                try {
                    const grps = await iExpense.find($or[{lender_id: id},{borrow_id: id}]);
                    if (grps) {
                        return {
                            grps,
                            msg: 'Group names retrieved',
                            success: true
                        };
                    }
                } catch (error) {
                    return {
                        errors: [error.message],
                        msg: `${error.message}`,
                        success: false
                    };
                }
            }
        },
        getGroup: {
            type: gExpense,
            args: {
                group_id: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                try {
                    //get all user email, except current user's email    
                    const docs = await gExpense.findById(group_id).populate("payee");
                    const expenses = [];
                    if (docs) {
                        docs.forEach((doc) => {
                            expense.push({
                                _id: doc._id,
                                date: doc.expense,
                                payee: doc.payee.name,
                                amount: doc.amount,
                                shares: doc.shares,
                                expense_name: doc.expense_name})
                        });
                        return {
                            expenses,
                            msg: "Record returned successfully",
                            success: true
                        }
                    }
                    else {
                        return {
                            expenses,
                            msg: 'Records could not be returned',
                            success: true
                        }
                    }
                }
                catch (err) {
                    return {
                        msg: err.message,
                        success: false
                    }
                }
            }
        },
        getRecent: {
            type: gExpense,
            args: {
                userId: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const doc = await gExpense.find({payee: args.userId}).populate('payee')
                    const expenses = [];
                    if (docs) {
                        docs.forEach((doc) => {
                            expense.push({
                                _id: doc._id,
                                date: doc.expense,
                                payee: doc.payee.name,
                                amount: doc.amount,
                                shares: doc.shares,
                                expense_name: doc.expense_name})
                        });
                        return {
                            expenses,
                            msg: "Record returned successfully",
                            success: true
                        }
                    }
                    else {
                        return {
                            expenses,
                            msg: 'Records could not be returned',
                            success: true
                        }
                    }
                }
                catch (err) {
                    return {
                        msg: err.message,
                        success: false
                    }
                }
            }
        },
        getComment: {
            type: gExpense,
            args: {
                expense_id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    let comment = {}
                    const doc = await gExpense.findById(expense_id).populate({path: "comment", populate: {path:"author"}})
                    if (docs) {
                        comment = {
                                _id: args._id,
                                comment: doc.comment.comment,
                                author: doc.comment.author,
                        };
                        return {
                            comment,
                            msg: "Record returned successfully",
                            success: true
                        }
                    }
                    else {
                        return {
                            comment,
                            msg: 'Records could not be returned',
                            success: true
                        }
                    }
                }
                catch (err) {
                    return {
                        msg: err.message,
                        success: false
                    }
                }
            }
        },
        getGroupRequests: {
            type: groupType,
            args: {
                id: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const grp = await Group.findById(args.id);
                    if (grp) {
                        return {
                            group: grp,
                            msg: "Group retrieved successfully",
                            success: true
                        };
                    } else {
                        return {
                            group: grp,
                            msg: "Group not found",
                            success: true
                        };
                    }
                } catch (error) {
                    return {
                        errors: [error.message],
                        msg: 'Group could not be retrieved',
                        success: false
                    };
                }
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        checkLogin: {
            type: userType,
            args: {
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            async resolve(parent, args) {
                const doc = await Users.findOne({ email: args.email });
                if (doc === null) {
                    return {
                        msg: 'Account Not Found',
                        success: false
                    }
                }
                else {
                    //check if password in DB matches the one entered
                    if (hashFunction.verify(args.password, doc.password)) {
                        let payload = {
                            _id: doc._id,
                            userId: doc._id,
                            email: doc.email,
                            name: doc.name
                        }
                        let token = jwtoken.sign({data: user._id},"jwtSecret", {
                            expiresIn: '1h'
                        })

                        return {
                            token: "token",
                            msg: 'Logged in successfully',
                            userId: doc._id,
                            role: 'User',
                            success: true
                        }
                    } else {
                        return {
                            msg: 'Invalid Credentials Entered',
                            success: false
                        }
                    }
                }
            }
        },
        registerUser: {
            type: userType,
            args: {
                lname: { type: GraphQLString },
                fname: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString },
            },
            async resolve(parent, args) {
                const record = new User({
                    fname: args.fname,
                    lname: args.lname,
                    email: args.email,
                    password: hashFunction.generate(args.password),
                    currency: "USD",
                    
                })
                record.save()
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
                
            }
        },
        saveProfile: {
            type: userType,
            args: {
                token: { type: GraphQLString },
                type: { type: GraphQLString },
                value: {type: GraphQLString},
            },
            async resolve(parent, args) {
                try {
                    //check whether the user is a valid user
                    const id = get_id(args.token)
                    console.log("In here")
                    if (!id){
                        return {
                            message: "no Token",
                            success: false
                        }
                    }
                    const val = await users.findById(id);
                    if (!val) {
                        return {
                            errors: ['User not found!'],
                            msg: "User not found",
                            success: false
                        };
                    }
                    else {
                        switch (args.type){
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
                        await val.save()
                        return {
                            msg: "successfully updated",
                            success: true
                        };
                        
                    }
                }
                catch (error) {
                    let errors = [];
                    if (error.error) {
                        error.errors.map((e) => {
                            errors.push(e.message);
                        });
                        return {
                            errors,
                            success: false
                        };
                    } else {
                        return {
                            errors: [error.message],
                            success: false
                        };
                    }
                }
            }
        },
        addExpense: {
            type: groupType,
            args: {
                userId: {
                    type: GraphQLString
                },
                inviteId: {
                    type: GraphQLString
                },

            },
            async resolve(parent, args) {
                try {
                    //check if invitation is valid
                    const currentUser = await users.findById(args.userId);
                    if (!currentUser) {
                        return {
                            msg: 'User not found',
                            success: false
                        };
                    }
                    let invitedToGroupId;
                    currentUser.invitedToGroups.forEach((groupId) => {
                        //try to replace foreach loop as we need to set invitedToGroup only once
                        if (String(groupId) === String(args.inviteId)) {
                            invitedToGroupId = groupId;
                        }
                    });
                    if (!invitedToGroupId) {
                        return {
                            errors: ['Invitation not found'],
                            msg: 'Invitation not found',
                            success: false
                        };
                    }

                    //check if 'group to accept' is a valid group
                    const groupToAccept = await Group.findById(invitedToGroupId);
                    if (!groupToAccept) {
                        return {
                            errors: ['Group does not exist!'],
                            msg: 'Group does not exist',
                            success: false
                        };
                    }

                    //check if user is already a member of the group - User Model
                    let isGrpAccepted = false;
                    for (let group of currentUser.groups) {
                        if (String(group._id) === String(args.inviteId)) {
                            isGrpAccepted = true;
                            break;
                        }
                    }
                    if (isGrpAccepted) {
                        return {
                            errors: ['Group invitation is already accepted!'],
                            msg: 'Group invitation is already accepted',
                            success: false
                        };
                    }

                    //check if user is already a member of the group - Group Model
                    let isUserAMember = false;
                    for (let memberId of groupToAccept.members) {
                        if (String(memberId) === String(currentUser._id)) {
                            isUserAMember = true;
                            break;
                        }
                    }
                    if (isUserAMember) {
                        return {
                            errors: ['User is already a member of the group!'],
                            msg: 'User is already a member of the group',
                            success: false
                        };
                    }
                    await currentUser.update({ groups: [...currentUser.groups, groupToAccept._id] });
                    await groupToAccept.update({ members: [...groupToAccept.members, currentUser._id] });

                    //remove group from 'invitedToGroups' once accepted
                    await users.findOneAndUpdate(
                        { _id: currentUser._id },
                        {
                            $pull: {
                                invitedToGroups: invitedToGroupId,
                            },
                        }
                    );

                    //remove user from 'invitedUsers' once the group is accepted
                    await Group.findOneAndUpdate(
                        { _id: invitedToGroupId },
                        {
                            $pull: {
                                invitedUserIds: currentUser._id,
                            },
                        }
                    );
                    return {
                        msg: 'Invitation Accepted',
                        success: true
                    };
                }
                catch (error) {
                    let errors = [];
                    if (error.error) {
                        error.errors.map((e) => {
                            errors.push(e.message);
                        });
                        return {
                            errors,
                            success: false
                        };
                    } else {
                        return {
                            errors: [error.message],
                            success: false
                        };
                    }
                }
            }
        },
        addComment: {
            type: groupType,
            args: {
                userId: {
                    type: GraphQLString
                }
            },
            async resolve(parent, args) {
                const user = await users.findById(args.userId).populate('invitedToGroups');
                const invites = user.invitedToGroups;
                return {
                    invites,
                    msg: 'Invites retrieved',
                    success: true
                };
            }
        },
        groupApprove: {
            type: groupType,
            args: {
                userId: { type: GraphQLString },
                photo: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const user = await Member.updateOne({ _id: args.userId }, {
                        $set: {
                            photo: args.photo
                        }
                    },
                        {
                            upsert: true
                        });
                    if (user) {
                        return {
                            msg: 'Updated Profile picture',
                            photo: args.photo,
                            success: true
                        };
                    };
                } catch (error) {
                    return {
                        msg: error.message,
                        success: false
                    };
                }
            }
        },
        groupCreate: {
            type: groupType,
            args: {
                userId: { type: GraphQLString },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                phone: { type: GraphQLString },
                photo: { type: GraphQLString },
                currency: { type: GraphQLString },
                timezone: { type: GraphQLString },
                language: { type: GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const user = await users.findById(args.userId);
                    if (user) {
                        const modUser = await users.findOneAndUpdate(
                            { _id: user._id },
                            {
                                $set:
                                {
                                    name: args.name,
                                    email: args.email,
                                    phone: args.phone,
                                    photo: args.photo ? args.photo : "",
                                    currency: args.currency,
                                    timezone: args.timezone,
                                    language: args.language
                                },
                            },
                            { new: true }
                        );
                        if (modUser) {
                            return {
                                ...modUser.toObject(),
                                password: '',
                                msg: "Profile updated",
                                success: true
                            };
                        }
                        else {
                            return {
                                user: {
                                    msg: "User not found"
                                },
                                success: true
                            };
                        }
                    }
                } catch (error) {
                    return {
                        msg: error.message,
                        success: false
                    };
                }
            }
        },
        groupExit: {
            type: commentType,
            args: {
                userId: { type: GraphQLString },
                name: { type: GraphQLString },
                comment: { type: GraphQLString },
                expId: { type: GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const newComment = new comments({
                        comment: args.comment,
                        authorId: args.userId,
                        expenseId: args.expId
                    });

                    const savedComment = await newComment.save()
                    const currentExpense = await histories.findById(args.expId);
                    await currentExpense.update({
                        comments: [
                            ...currentExpense.comments,
                            savedComment._id
                        ]
                    })

                    try {
                        //add entry for the expense in the History Model
                        await histories.create({
                            authorId: args.userId,
                            authorName: args.name,
                            groupId: currentExpense.groupId,
                            groupName: currentExpense.groupName,
                            title: `${args.name} added comment "${args.comment}" for expense "${currentExpense.transName}"`,
                            amount: 0
                        })
                    }
                    catch (errr) {
                        console.log("test", errr);

                    }


                    return {
                        msg: "Comment Added Successfully",
                        success: true
                    };
                }
                catch (error) {
                    return {
                        errors: [error.message],
                        msg: "Could not add comment",
                        success: false
                    };
                }
            }
        },
        groupDeleteComment: {
            type: commentType,
            args: {
                userId: { type: GraphQLString },
                commentId: { type: GraphQLString },
                expId: { type: GraphQLString },
            },
            async resolve(parent, args) {
                try {
                    const comment = await comments.findById(args.commentId)
                    if (comment) {
                        if (String(comment.authorId) === String(args.userId)) {
                            const hist = await histories.findById(args.expId)
                            if (hist === null) {
                                return {
                                    msg: "Comment not found",
                                    success: false
                                };
                            }
                            else {
                                // remove comment from Expense model
                                await histories.findOneAndUpdate(
                                    { _id: args.expId },
                                    {
                                        $pull: {
                                            comments: args.commentId,
                                        },
                                    }
                                );
                                //remove comment from Comment model
                                await comments.findOneAndDelete(
                                    { _id: args.commentId }
                                );
                                return {
                                    msg: "Comment Deleted",
                                    success: true
                                };
                            }
                        }
                        else {
                            return {
                                msg: "You can delete only your comments",
                                success: true
                            };
                        }
                    }
                }
                catch (err) {
                    return {
                        errors: err,
                        msg: "Could not delete comment",
                        success: false
                    };
                }
            }
        },
        settleUp: {
            type: iExpenseType,
            args: {
                gid: { type: GraphQLString }
            },
            async resolve(parent, args) {
                try {
                    const group = await Group.findById(args.gid);
                    const membersOfGroup = group.members;
                    const dictionary = {};
                    const groupBalances = [];
                    const owesMe = {};
                    const iOwe = {};

                    //save member names and their id, in key-value pair
                    for (let index = 0; index < membersOfGroup.length; index++) {
                        let tempUser = await users.findById(membersOfGroup[index]);
                        dictionary[membersOfGroup[index]] = tempUser.name;
                    }

                    //get current group
                    const orgGrp = await Group.findById(args.gid);

                    //get indexes of all the non-zero balances from the current group
                    let indexes = [];
                    for (i = 0; i < orgGrp.balances.length; i++) {
                        if (orgGrp.balances[i].balance !== 0) {
                            indexes.push(i);
                        }
                    };

                    //save all the non-zero balances of the current group along with who owe/get back...
                    //...how much amount
                    let newG = [];
                    indexes.forEach(index => {
                        newG.push(orgGrp.balances[index]);
                    });

                    await newG.forEach((gBalance) => {
                        groupBalances.push(
                            gBalance.balance > 0
                                ? dictionary[gBalance.memberId] + ' gets back $' + parseFloat(gBalance.balance).toFixed(2)
                                : dictionary[gBalance.memberId] + ' owes $' + parseFloat(-gBalance.balance).toFixed(2)
                        );
                    });

                    //get all the unsettled transactions for the current group
                    const g = await transactions.find({
                        groupId: args.gid,
                        settled: false
                    })
                        .populate('payerId')
                        .populate('borrowerId');

                    let to = new Map();
                    let tb = new Map();
                    let usrs = new Map();

                    //save how much the payer get backs in key-value pair
                    g.map((t) => {
                        if (to.has(t.payerId._id)) {
                            to.set(t.payerId._id, +to.get(t.payerId._id) + +t.amount);
                        } else {
                            usrs.set(t.payerId._id, { name: t.payerId.name, crr: t.currency });
                            to.set(t.payerId._id, +t.amount);
                        }
                    });

                    //save how much the borrower owes in key-value pair
                    g.map((t) => {
                        if (tb.has(t.borrowerId._id)) {
                            tb.set(t.borrowerId._id, (+tb.get(t.borrowerId._id) + +t.amount) * -1);
                        } else {
                            usrs.set(t.borrowerId._id, { name: t.borrowerId.name, crr: t.currency });
                            tb.set(t.borrowerId._id, +t.amount * -1);
                        }
                    });

                    let result = [];
                    try {
                        if (Array.from(to).length >= Array.from(tb).length) {
                            to.forEach((val, key) => {
                                if (tb.has(key)) {
                                    let sum = (+val + +tb.get(key)).toFixed(2);
                                    if (sum > 0) {
                                        result.push(
                                            `${usrs.get(key).name} gets back ${getCurrencySymbol(usrs.get(key).crr)} ${sum}`
                                        );
                                    }
                                    if (sum < 0) {
                                        result.push(
                                            `${usrs.get(key).name} pays ${getCurrencySymbol(usrs.get(key).crr)} ${Math.abs(
                                                sum
                                            )}`
                                        );
                                    }
                                } else {
                                    let sum = (+val).toFixed(2);
                                    if (sum > 0) {
                                        result.push(
                                            `${usrs.get(key).name} gets back ${getCurrencySymbol(usrs.get(key).crr)} ${sum}`
                                        );
                                    }
                                    if (sum < 0) {
                                        result.push(
                                            `${usrs.get(key).name} pays ${getCurrencySymbol(usrs.get(key).crr)} ${Math.abs(
                                                sum
                                            )}`
                                        );
                                    }
                                }
                            });
                        } else {
                            tb.forEach((val, key) => {
                                if (to.has(key)) {
                                    let sum = (+to.get(key) + +val).toFixed(2);
                                    if (sum > 0) {
                                        result.push(
                                            `${usrs.get(key).name} gets back ${getCurrencySymbol(usrs.get(key).crr)} ${sum}`
                                        );
                                    }
                                    if (sum < 0) {
                                        result.push(
                                            `${usrs.get(key).name} pays ${getCurrencySymbol(usrs.get(key).crr)} ${Math.abs(
                                                sum
                                            )}`
                                        );
                                    }
                                } else {
                                    let sum = (+val).toFixed(2);
                                    if (sum > 0) {
                                        result.push(
                                            `${usrs.get(key).name} gets back ${getCurrencySymbol(usrs.get(key).crr)} ${sum}`
                                        );
                                    }
                                    if (sum < 0) {
                                        result.push(
                                            `${usrs.get(key).name} pays ${getCurrencySymbol(usrs.get(key).crr)} ${Math.abs(
                                                sum
                                            )}`
                                        );
                                    }
                                }
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                    const h = await histories.find({ groupId: args.gid, amount: { $gt: 0 } });
                    return {
                        trans: g,
                        history: h.reverse(),
                        result,
                        groupBalances,
                        msg: 'TransactionByGId returned successfully',
                        success: true
                    };
                } catch (error) {
                    return {
                        errors: [error.message],
                        msg: error.message,
                        success: false
                    };
                }
            }
        }
    }
});


const schema = new GraphQLSchema({
    query: RootType,
    mutation: Mutation
})
module.exports = schema;