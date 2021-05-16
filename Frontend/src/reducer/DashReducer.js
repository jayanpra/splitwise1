import { createSlice } from '@reduxjs/toolkit';
import {get_dash, clearError} from '../actions/dashAction'

export const DashReducer = createSlice({
    name: "dash",
    initialState:{
        borrow_list: [],
        lend_list: [],
        amt_plus: 0.0,
        amt_minus: 0.0,
        friends: {},
        error_message: '',

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
            if (!action.payload.auth){
                state.error_message = action.payload.message
                return 
            }
            state.borrow_list = []
            state.lend_list = []
            state.amt_plus= 0.0
            state.amt_minus= 0.0
            state.friends= {}
            if (typeof action.payload.data === 'object'){
                let keys = Object.keys(action.payload.data.accounts)
                for (let i in keys){
                    const list = action.payload.data.accounts[keys[i]]
                    for (let i in list) {
                        if (list[i].color === "green"){
                            state.lend_list.push({color:"green", expense:list[i].expense, borrower: list[i].person, exp_name: list[i].ename})
                        }
                        else{
                            state.borrow_list.push({color:"red", expense:list[i].expense, lender: list[i].person, exp_name: list[i].ename})
                        }
                    }
                }
                state.friends = {settle: action.payload.data.balance}
                let keys2 = Object.keys(action.payload.data.balance)
                for (let j in keys2) {
                    if (action.payload.data.balance[keys2[j]] > 0){
                        state.amt_plus += action.payload.data.balance[keys2[j]]
                                }
                    else {
                        state.amt_minus += action.payload.data.balance[keys2[j]] * -1
                    }
                }
            }
        },
        [clearError.fulfilled]: (state,action) => {
            state.error_message = ""
        },
    }
});

export default DashReducer.reducer