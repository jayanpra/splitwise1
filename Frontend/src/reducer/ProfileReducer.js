import { createSlice} from '@reduxjs/toolkit';
import {get_data, send_update} from '../actions/profileActions'



export const ProfileReducer = createSlice({
    name: "profile",
    initialState:{
        loading: 'idle',
        pname: "",
        email: "",
        phone: "",
        pic_loc: "",
        currecncy: "",
        timezone: "", 
        language: "",
        error: false,
        feed: '',
    },
    reducers: {
      setRData(state,action) {
        state.pname = action.payload.pname
        state.email = action.payload.email
        if (action.payload.phone !== null) {
          state.phone = `(${action.payload.phone.substring(0,3)}) ${action.payload.phone.substring(3,6)} ${action.payload.phone.substring(6,10)}`
        }
        else {
          state.phone = action.payload.phone
        }
        state.pic_loc = action.payload.pic_loc
        state.currency =  action.payload.currency
        state.timezone = action.payload.timezone 
        state.language = action.payload.language
    },
        setSingleData(state,action){
            let key = action.payload.key
            let value = action.payload.value
            switch (key) {
                case 'name':{
                  state.pname = value
                  break;
                }
                case 'email':{
                  state.email = value
                  break;
                }
                case 'phone':{
                  state.phone = `(${value.substring(0,3)}) ${value.substring(3,6)} ${value.substring(6,10)}`
                  break;
                }
                case 'currency':{
                  localStorage.setItem("currency", value)
                  state.currency = value
                  break;
                }
                case 'timezone':{
                  state.timezone = value
                  break;
                }
                case 'language':{
                  state.language = value
                  break;
                }
                case 'image':{
                  state.pic_info = value
                  break;
                }
                default:
                  break;
              }
        },
        removeError(state) {
          state.error = false
        }
    },
    extraReducers: {
      [get_data.fulfilled] : (state,action) => {
        
        if (action.payload === null){
          return
        }
        const response_data = action.payload
        state.pname = response_data.name
          state.email = response_data.email
          if (typeof response_data.phone === 'string') {
            state.phone = `(${response_data.phone.substring(0,3)}) ${response_data.phone.substring(3,6)} ${response_data.phone.substring(6,10)}`
          }
          else {
            state.phone = response_data.phone
          }
          state.pic_loc = response_data.pic_loc
          state.currency =  response_data.currency
          state.timezone = response_data.timezone 
          state.language = response_data.language
      },
      [send_update.fulfilled] : (state, action) => {
        console.log(action.payload)
        if (action.payload.status) {
              let key = action.payload.key
              let value = action.payload.value
              switch (key) {
                  case 'name':{
                    state.pname = value
                    break;
                  }
                  case 'email':{
                    state.email = value
                    break;
                  }
                  case 'phone':{
                    state.phone = `(${value.substring(0,3)}) ${value.substring(3,6)} ${value.substring(6,10)}`
                    break;
                  }
                  case 'currency':{
                    localStorage.setItem("currency", value)
                    state.currency = value
                    break;
                  }
                  case 'timezone':{
                    state.timezone = value
                    break;
                  }
                  case 'language':{
                    state.language = value
                    break;
                  }
                  case 'image':{
                    state.pic_info = value
                    break;
                  }
                  default:
                    break;
                }
        }
        else {
          state.error = true
          state.feed = action.payload.message
        }
      },
      [send_update.rejected] : (state, action) => {
        state.error = true
        state.feed = "Operation Unsuccessful"
    },
    },
    
});


export const {setRData, setSingleData, removeError} = ProfileReducer.actions;
export default ProfileReducer.reducer