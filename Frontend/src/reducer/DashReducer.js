import { createSlice } from '@reduxjs/toolkit';
import {get_dash} from '../actions/dashAction'

export const DashReducer = createSlice({
    name: "dash",
    initialState:{
        borrow_list: [],
        lend_list: [],
        amt_plus: 0.0,
        amt_minus: 0.0,
        friends: {},

    },
    reducers: {
        addLend(state,action) {
            state.lend_list.push(action.payload)
        },
        addBorrow(state,action){
            state.borrow_list.push(action.payload)
        },
        addDebts(state,action) {
            state.amt_minus += action.payload
        },
        addCredits(state,action) {
            state.amt_plus += action.payload
        },
        addFriend(state, action) {
            state.friends = action.payload
        },
    },
    extraReducers:{
        [get_dash.fulfilled]: (state,action) => {
            state.borrow_list = []
            state.lend_list = []
            state.amt_plus= 0.0
            state.amt_minus= 0.0
            state.friends= {}
            if (typeof action.payload === 'object'){
                let keys = Object.keys(action.payload.accounts)
                for (let i in keys){
                    const list = action.payload.accounts[keys[i]]
                    for (let i in list) {
                        if (list[i].color === "green"){
                            //getMoney((state) => [...state, {color:"green", expense:list[i].expense, borrower: list[i].person, exp_name: list[i].ename}])
                            state.lend_list.push({color:"green", expense:list[i].expense, borrower: list[i].person, exp_name: list[i].ename})
                        }
                        else{
                            //sendMoney((state) => [...state, {color:"red", expense:list[i].expense, lender: list[i].person, exp_name: list[i].ename}])
                            state.borrow_list.push({color:"red", expense:list[i].expense, lender: list[i].person, exp_name: list[i].ename})
                        }
                    }
                }
                //indSettle({...friends, settle:response.data.balance})
                state.friends = {settle: action.payload.balance}
                let keys2 = Object.keys(action.payload.balance)
                for (let j in keys2) {
                    if (action.payload.balance[keys2[j]] > 0){
                        state.amt_plus += action.payload.balance[keys2[j]]
                                }
                    else {
                        state.amt_minus += action.payload.balance[keys2[j]] * -1
                    }
                }
            }
        },
    }
});

export const {addBorrow, addLend, addDebts, addCredits, addFriend} = DashReducer.actions;
export default DashReducer.reducer