import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_data = createAsyncThunk(
    'users/fetchRecent',
    async (pckg) => {
      const response = await axios.post('http://54.190.4.247:3001/pullRecent', pckg)
      if (response.status === 200){
        return {error: false, data: response.data}
      }
      return {error: true, message: "Issue with the Server"}
    }
)

export const clearError = createAsyncThunk(
    'users/recentClearError',
    async () => {
      return {arg: true}
    }
  )

  export const reverseList = createAsyncThunk(
    'users/recentreverse',
    async () => {
      return {arg: true}
    }
  )