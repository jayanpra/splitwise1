import { createSlice } from '@reduxjs/toolkit';
import {login, register, clear}  from '../actions/logisterActions'

export const LogisterReducer = createSlice({
    name: "logister",
    initialState:{
        email: '',
        fname: '',
        lname: '',
        password: '',
        error: '',
        pass: '',

    },
    extraReducers: {
        [login.fulfilled] : (state,action) => {
            console.log(action.payload)
            if (action.payload.auth){
                state.error = null
                state.pass = true
            }
            else {
                console.log("here")
                state.error = "Invalid Credentials"
            }

        },
        [register.fulfilled] : (state, action) => {
            if (action.payload.auth){
                state.error = null
                state.pass = true
            }
            else {
                state.error = action.payload.message
            }
        },
        [clear.fulfilled] : (state, action) => {
            if (action.payload.arg){
                state.error = ''
                state.pass = false
            }
        },
      },
  });
  
  
  export const {addDetails, clearError} = LogisterReducer.actions;
  export default LogisterReducer.reducer