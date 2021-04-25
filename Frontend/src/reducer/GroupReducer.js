import { createSlice } from '@reduxjs/toolkit';
import {get_group, change_group, approve_group, exit_group, clearError}  from '../actions/groupAction'

export const GroupReducer = createSlice({
    name: "group",
    initialState:{
        name: null,
        group_id: '',
        groups: [],
        group_name: [],
        selected_group: [],
        currency: null,
        pic: null,
        group_req: [],
        error: false,
        sucess: false,
        feed: ''
    },
    reducers: {
        removeGroup(state,action){
            
        },
        approveGroup(state,action){
            state.groups[action.payload].active = "active"
        },
    },
    extraReducers: {
        [get_group.fulfilled]: (state, action) => {
            if (action.payload.auth){
                state.name=''
                state.groups = []
                state.group_name = []
                state.selected_group = []
                state.group_req = []
                state.currency = null
                state.pic = null
                state.exit_flag = false
                console.log(action.payload.data)
                let group_data = []
                for (let i in action.payload.data.group){
                        group_data.push(action.payload.data.group[i].name)
                        if (action.payload.data.group[i].active === 'passive') {
                            state.group_req.push(action.payload.data.group[i].name)
                        }
                    }
                state.name = group_data[0]
                if ( action.payload.data.group.length > 0){
                    state.group_id = action.payload.data.group[0].id
                }
                state.groups = action.payload.data.group
                state.group_name = group_data
                state.selected_group = action.payload.data.expense
                state.currency = null
                state.pic =  `${process.env.REACT_APP_GROUP}/${action.payload.data.pics}`
                }
            else {
                state.error = true
                state.feed = action.payload.message
            }
            
        },
        [change_group.fulfilled]: (state, action) => {
            console.log(action.payload)
            if (action.payload.auth){
                state.sucess = true
                state.selected_group = action.payload.data.expense
                state.name = action.payload.name
                state.group_id = action.payload.id
            }
            else {
                state.error = true
                state.feed = action.payload.message
            }
        },
        [approve_group.fulfilled]: (state, action) => {
            if (action.payload.auth){
                state.sucess = true
                state.feed = "Successfully Aprroved"
                state.groups[action.payload.id].active = "active"
            }
            else {
                state.error = true
                state.feed = action.payload.message
            }
        },
        [exit_group.fulfilled]: (state, action) => {
            if (action.payload.auth){
                state.sucess = true
                state.feed = "Successfully Exited"
                state.groups.splice(state.groups.indexOf(action.payload.name),1)
            }
            else {
                state.error = true
                state.feed = action.payload.message
            } 
        },
        [clearError.fulfilled] : (state, action) => {
            state.error = false
            state.feed = ""
            state.success = false
        },
    }   
});

export default GroupReducer.reducer