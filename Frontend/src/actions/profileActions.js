import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_data = createAsyncThunk(
    'users/fetchProfile',
    async (token) => {
      const response = await axios.post('http://localhost:3001/profile/initialPull', {'token': token},{ headers: {Authorization: "Bearer "+token}})
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

export const clearError = createAsyncThunk(
  'users/profileClearError',
  async () => {
    return {arg: true}
  }
)

export const sendProfileImage = createAsyncThunk(
  'users/profileImage',
  async (formData) => {
    const config = {
      headers: { 
        'content-type': 'multipart/form-data'
      }
    }
    const response = await axios.post('http://localhost:3001/imageupdate',formData,config )
     if (response.status === 200) {
          return {status: true, message: "Image has been Updated"}
    }
    else {
      return {status: false, message: "Server is Down"}
    }
  }
)