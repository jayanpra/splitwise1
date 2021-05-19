const {buildSchema} = require('graphql')

module.exports = buildSchema(`
type RootQuery {
    getProfile(token: String): getPro
    getDash(token: String): dash
}
type loginResponse{
    token: String 
    currency: String 
    name: String
}

type returnLogin {
    status: Int
    data: loginResponse
    message: String
}
type account {
    color: String!
    expense: Float!
    person: String!
    ename: String!
}
type singleAccount {
  key: String
  data: [account]
}
type balance {
  key: String!
  value: Float!
}
type dashData {
    accounts: [singleAccount]
    balances: [balance]
}
type dash{
    status: Int
    data: dashData
    message: String
}
type Profile{
    name: String
    email: String
    phone: String
    pic : String
    currency: String
    timezone: String
    language: String
}
type getPro{
    status: Int
    response: Profile
    message: String
}
type savePro{
    status: Int
    message: String
}
type objForm {
    type: String
    value: String
}
input profileForm {
    status: Int
    data: objForm
}
type RootMutation {
    checkLogin(email: String, password: String) : returnLogin
    registerUser(email: String, password: String, fname: String, lname: String): returnLogin
    saveProfile(input: profileForm): savePro
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`)