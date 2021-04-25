import { createSlice } from '@reduxjs/toolkit';
import {get_data, clearError, reverseList} from '../actions/recentAction'

export const RecentReducer = createSlice({
    name: "recent",
    initialState:{
        user_list: [],
        error: false,
        feed: '',
        sucess: false,
    },
    extraReducers:{
        [get_data.fulfilled] : (state, action) => {
            if (!action.payload.error){
                state.user_list = action.payload.data.expense
                state.sucess = true
            }
            else{
                state.error = true
                state.feed = action.payload.message
            }
        },
        [clearError.fulfilled] : (state, action) => {  
            state.error = false
            state.feed = ''
            state.sucess = true
        },
        [reverseList.fulfilled] : (state, action) => {  
            state.user_list = state.user_list.reverse()
        },
    },
});

export default RecentReducer.reducer