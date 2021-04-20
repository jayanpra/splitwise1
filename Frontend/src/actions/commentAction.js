import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_comment = createAsyncThunk(
    'users/fetchComment',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/getcomment', pckg)
      console.log(response.data)
      if (response.status === 200){
        return {id: pckg.expense_id, response: response.data}
      }
    }
)

export const save_comment = createAsyncThunk(
    'users/saveComment',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/addcomment', pckg)
      return {status: response.status}
    }
)