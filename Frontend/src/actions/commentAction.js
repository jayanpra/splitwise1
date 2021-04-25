import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_comment = createAsyncThunk(
    'users/fetchComment',
    async (pckg) => {
      const response = await axios.post('http://54.190.4.247:3001/getcomment', pckg)
      console.log(response.data)
      if (response.status === 200){
        return { auth: true, id: pckg.expense_id, response: response.data}
      }
      else
      {
        return { auth: false, message: "Server issue"}
      }
    }
)

export const save_comment = createAsyncThunk(
    'users/saveComment',
    async (pckg) => {
      const response = await axios.post('http://54.190.4.247:3001/addcomment', pckg)
      if (response.status === 200){
        return { auth: true, comment: {author: localStorage.getItem('fname'), text: pckg.text}, post_id: pckg.expense_id}
      }
      else
      {
        return { auth: false, message: "Server issue"}
      }
    }
)

export const clearError = createAsyncThunk(
  'users/clearComment',
  async (pckg) => {
     return { auth: true}
  }
)