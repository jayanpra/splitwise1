import { createSlice } from '@reduxjs/toolkit';

export const RecentReducer = createSlice({
    name: "recent",
    initialState:{
        user_list: '',
    },
    reducers: {
        addRecent(state,action) {
            state.user_list = action.payload
        },
    },
});

export const {addRecent} = RecentReducer.actions;
export default RecentReducer.reducer