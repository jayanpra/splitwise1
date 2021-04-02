import { createSlice } from '@reduxjs/toolkit';

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
});

export const {addBorrow, addLend, addDebts, addCredits, addFriend} = DashReducer.actions;
export default DashReducer.reducer