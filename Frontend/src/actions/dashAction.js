import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_dash = createAsyncThunk(
    'users/fetchDash',
    async (pckg) => {
      const response = await axios.post('http://54.190.4.247:3001/getDash', pckg)
      console.log(response.data)
      if (response.status === 200){
        return response.data
      }
    }
)

export const settle_up = createAsyncThunk(
  'users/settleup',
  async (pckg) => {
    const response = await axios.post('http://54.190.4.247:3001/settleUp', pckg)
    console.log(response.data)
    if (response.status === 200){
      return response.data
    }
  }
)
