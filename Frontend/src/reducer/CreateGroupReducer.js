import { createSlice } from '@reduxjs/toolkit';
import {createGroup, clearError, groupSuggest}  from '../actions/createGroupAction'

export const CreateGroupReducer = createSlice({
    name: "createGroup",
    initialState:{
        groupSuggest: [],
        error: null,
        success: null,

    },
    extraReducers: {
        [createGroup.fulfilled] : (state,action) => {
            if (action.payload.auth){
                state.success = true
                }
            else {
                state.error = action.payload.message
            }
        },
        [clearError.fulfilled] : (state, action) => {
            state.error = null
            state.success = null
        },
        [groupSuggest.fulfilled] : (state, action) => {
            if (action.payload.auth){
                state.groupSuggest = action.payload.response.list
                console.log(action.payload)
                }
            else {
                state.error = action.payload.message
            }
        },
      },
  });
  

  export default CreateGroupReducer.reducer