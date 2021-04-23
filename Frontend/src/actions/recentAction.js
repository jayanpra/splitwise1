import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_data = createAsyncThunk(
    'users/fetchRecent',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/pullRecent', pckg)
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