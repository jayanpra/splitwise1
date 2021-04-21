import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_group = createAsyncThunk(
    'users/fetchGroup',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/groupFill', pckg)
      console.log(response.data)
      if (response.status === 200){
        return response.data
      }
      else {
          return null
      }
    }
)

export const change_group = createAsyncThunk(
    'users/changeGroup',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/groupChange', pckg)
      console.log(response.data)
      if (response.status === 200){
        return response.data
      }
      else {
          return null
      }
    }
)