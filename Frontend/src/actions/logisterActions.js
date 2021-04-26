import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const login = createAsyncThunk(
    'users/login',
    async (pckg) => {
      const response = await axios.post('http://18.237.56.160:3001/login',pckg )
      console.log(response.data)
      if (response.status === 200){
        localStorage.setItem('token', response.data.token)
        if (response.data.currency === 'USD'){
          localStorage.setItem('currency', '$')
        }
        else{
          localStorage.setItem('currency', response.data.currency)
        }
        localStorage.setItem('fname', response.data.name)
        return response.data
      }
      else{
          return {auth: false, message: response.data, status: response.status}
      }
    }
)

export const register = createAsyncThunk(
  'users/register',
  async (pckg) => {
    const response = await axios.post('http://18.237.56.160:3001/register', pckg)
    console.log(response.status)
    if (response.status === 200){
        localStorage.setItem('token', response.data.token)
        if (response.data.currency === 'USD'){
          localStorage.setItem('currency', '$')
        }
        else{
          localStorage.setItem('currency', response.data.currency)
        }
        localStorage.setItem('fname', response.data.name)
        return {auth: true, message: "Succesfully Registered"}
    }
    else {
        return {auth: false, message: response.data, status: response.status}
    }
  }
)

export const clear = createAsyncThunk(
    'users/clear',
    async () => {
      return {arg: true}
    }
  )
  export const addDetails = createAsyncThunk(
    'user/addDetails',
    async (data) => {
      return data
    }
  )