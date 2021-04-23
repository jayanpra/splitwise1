import { createSlice } from '@reduxjs/toolkit';
import {get_data, clearError} from '../actions/recentAction'

export const RecentReducer = createSlice({
    name: "recent",
    initialState:{
        user_list: '',
        error: false,
        feed: ''
    },
    reducers: {
        addRecent(state,action) {
            state.user_list = action.payload
        },
    },
    extraReducers:{
        [get_data.fulfilled] : (state, action) => {
            if (!action.payload.error){
                state.user_list = action.payload.data.expense
            }
            else{
                state.error = true
                state.feed = action.payload.message
            }
        },
        [clearError.fulfilled] : (state, action) => {
            
            state.error = false
            state.feed = ''
        },
    },
});

export const {addRecent} = RecentReducer.actions;
export default RecentReducer.reducer