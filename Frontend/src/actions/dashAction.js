import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_dash = createAsyncThunk(
    'users/fetchDash',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/getDash', pckg)
      console.log(response.data)
      if (response.status === 200){
        return {auth: true, data: response.data}
      }
      else {
        return {auth: false, message: "No Valid Token"}
      }
    }
)

export const settle_up = createAsyncThunk(
  'users/settleup',
  async (pckg) => {
    const response = await axios.post('http://localhost:3001/settleUp', pckg)
    console.log(response.data)
    if (response.status === 200){
      return response.data
    }
  }
)

export const clearError = createAsyncThunk(
  'dash/clearError',
  async () => {
    return {auth: true}
  }
)
