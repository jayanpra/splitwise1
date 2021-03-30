import { createSlice } from '@reduxjs/toolkit';

export const ProfileReducer = createSlice({
    name: "profile",
    initialState:{
        pname: "",
        email: "",
        phone: "",
        pic_loc: "",
        currecncy: "",
        timezone: "", 
        language: "",
    },
    reducers: {
        setRData(state,action) {
            state.pname = action.payload.pname
            state.email = action.payload.email
            state.phone = action.payload.phone
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
                  state.email = value
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
    },
});

export const {setRData, setSingleData} = ProfileReducer.actions;
export default ProfileReducer.reducer