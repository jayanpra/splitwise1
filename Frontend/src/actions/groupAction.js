import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const get_group = createAsyncThunk(
    'users/fetchGroup',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/groupFill', pckg)
      console.log(response.data)
      if (response.status === 200){
        return {auth: true, data:response.data}
      }
      else {
          return {auth: false, message: "Server Issue"}
      }
    }
)

export const change_group = createAsyncThunk(
    'users/changeGroup',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/groupChange', pckg)
      console.log(pckg.group_name)
      if (response.status === 200){
        return {auth: true, data:response.data, name: pckg.group_name, id: pckg.group_id}
      }
      else {
        return {auth: false, message: "Server Issue"}
      }
    }
)

export const approve_group = createAsyncThunk(
  'users/approveGroup',
  async (pckg) => {
    const response = await axios.post('http://localhost:3001/altergroup', pckg)
    console.log(response.data)
    if (response.status === 200){
      return {auth: true, id: pckg.seq }
    }
    else {
      return {auth: false, message: "Server Issue"}
    }
  }
)

export const exit_group = createAsyncThunk(
  'users/exitGroup',
  async (pckg, group_name) => {
    const response = await axios.post('http://localhost:3001/groupExit', pckg)
    console.log(response.data)
    if (response.status === 200){
      return {auth: true, name: group_name}
    }
    else {
      return {auth: false, message: "Server Issue"}
    }
  }
)

export const clearError = createAsyncThunk(
  'users/profileClearError',
  async () => {
    return {arg: true}
  }
)
