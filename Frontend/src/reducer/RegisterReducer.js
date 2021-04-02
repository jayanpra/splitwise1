import { createSlice } from '@reduxjs/toolkit';

export const RegisterReducer = createSlice({
    name: "register",
    initialState:{
        email: '',
        fname: '',
        lname: '',
        password: '',
        error: [],
    },
    reducers: {
        addDetails(state,action) {
            state.email = action.payload.email
            state.fname = action.payload.fname
            state.lname = action.payload.lname
            state.password = action.payload.password
        },
    },
});

export const {addDetails} = RegisterReducer.actions;
export default RegisterReducer.reducer