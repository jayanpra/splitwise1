import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createGroup = createAsyncThunk(
    'createGroup/create',
    async (pckg) => {
      const response = await axios.post('http://localhost:3001/groupCreate', pckg, { headers: {Authorization: "Bearer "+pckg.token}})
      console.log(response.data)
      if (response.status === 200){
        return { auth: true, response: response.data}
      }
      else if (response.status === 204) {
          return { auth: false, message: "Group Name mismatch"}
      }
      else
      {
        return { auth: false, message: "Server issue"}
      }
    }
)

export const clearError = createAsyncThunk(
  'createGroup/ClearError',
  async () => {
    return {arg: true}
  }
)

export const groupSuggest = createAsyncThunk(
  'createGroup/suggest',
  async (pckg) => {
    const response = await axios.post('http://localhost:3001/groupSuggest', pckg, { headers: {Authorization: "Bearer "+pckg.token}})
    console.log(response.data)
    if (response.status === 200){
      return { auth: true, response: response.data}
    }
    else
    {
      return { auth: false, message: "Server issue"}
    }
  }
)