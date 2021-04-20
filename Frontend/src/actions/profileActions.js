import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_data = createAsyncThunk(
    'users/fetchProfile',
    async (token) => {
      const response = await axios.post('http://localhost:3001/profile/initialPull', {'token': token})
      console.log(response.data)
      if (response.status === 200){
        return response.data
      }
      return null
    }
)

export const send_update = createAsyncThunk(
  'users/sendupdate',
  async (pckg) => {
    console.log("---LET ME CHECK---", pckg);
    const response = await axios.post('http://localhost:3001/profile/update', pckg)
    console.log(response.status)
    if (response.status === 200){
        return {status: true, key: pckg.data.type, value: pckg.data.value}
    }
    else {
      console.log("Something here")
      return {status: false, message: `${pckg.data.type} cannot be changed to ${pckg.data.value}`}
    }
    
  }
)