import { createSlice } from '@reduxjs/toolkit';
import {get_comment, save_comment, clearError}  from '../actions/commentAction'

export const CommentReducer = createSlice({
    name: "comment",
    initialState:{
        comment_list: {},
        add_comment: false,
        error: null

    },
    extraReducers: {
        [get_comment.fulfilled] : (state,action) => {
            if (action.payload.auth){
                state.comment_list[action.payload.id] = []
                for (let i  in action.payload.response.comment_list){
                    state.comment_list[action.payload.id].push(action.payload.response.comment_list[i])
                }
            }
            else {
                state.error = action.payload.message
            }
        },
        [save_comment.fulfilled] : (state, action) => {
            if (action.payload.auth) {
                state.add_comment = true
                //state.comment_list[action.payload.post_id].push(action.payload.comment)
            }
            else{
                state.error = action.payload.message
            }
        },
        [clearError.fulfilled] : (state, action) => {
            state.error = null
            state.add_comment = false
        },
      },
  });
  

  export default CommentReducer.reducer