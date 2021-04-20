import { createSlice } from '@reduxjs/toolkit';
import {get_comment, save_comment}  from '../actions/commentAction'

export const CommentReducer = createSlice({
    name: "comment",
    initialState:{
        comment_list: {},
        add_comment: false

    },
    reducer:{
        clear_reducer(state, action) {
            console.log("here")
            state.comment_list = []
            state.add_comment = false
        }
    },
    extraReducers: {
        [get_comment.fulfilled] : (state,action) => {
            state.comment_list[action.payload.id] = []
            for (let i  in action.payload.response.comment_list){
                state.comment_list[action.payload.id].push(action.payload.response.comment_list[i])
            }
        },
        [save_comment.fulfilled] : (state, action) => {
            if (action.payload.status === 200) {
                state.add_comment = true
            }
        },
      },
  });
  
  
  export const {clear_reducer} = CommentReducer.actions;
  export default CommentReducer.reducer