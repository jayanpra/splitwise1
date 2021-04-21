import { createSlice } from '@reduxjs/toolkit';
import {get_group}  from '../actions/groupAction'

export const GroupReducer = createSlice({
    name: "group",
    initialState:{
        name: null,
        groups: [],
        group_name: [],
        selected_group: [],
        currency: null,
        pic: null,
        group_req: [],
        exit_flag: false,
    },
    reducers: {
        setGroup(state,action) {
            state.name = action.payload.name
            state.groups = action.payload.groups
            state.group_name = action.payload.group_name
            state.selected_group = action.payload.selected_group
            state.currency = action.payload.currency
            state.pic = action.payload.pic
            for (let i in action.payload.groups){
                if (action.payload.groups[i].active === 'passive') {
                    state.group_req.push(action.payload.groups[i].name)
                }
            }
            
        },
        setSelectedGroup(state,action){
            state.name = action.payload.name
        },
        setImage(state,action){
            state.pic = action.payload.pic
        },
        removeGroup(state,action){
            state.groups.splice(state.groups.indexOf(action.payload),1)
        },
        approveGroup(state,action){
            state.groups[action.payload].active = "active"
        },
    },
    extraReducers: {
        [get_group.fullfilled]: (state, action) => {
            state.name=''
            state.groups = []
            state.group_name = []
            state.selected_group = []
            state.currency = null
            state.pic = null
            state.exit_flag = false
            if (typeof action.payload !== 'undefined')
            {
                let group_data = []
                for (let i in action.payload.group){
                    group_data.push(action.payload.group[i].name)
                    if (action.payload.groups[i].active === 'passive') {
                        state.group_req.push(action.payload.groups[i].name)
                    }
                }
                state.name = group_data[0]
                state.groups = action.payload.group
                state.group_name = group_data
                state.selected_group = action.payload.expense
                state.currency = null
                state.pic =  "http://localhost:3001/" + action.payload.pics
            }
            else {
                state.exit_flag = true
            }
        },
        [get_group.fullfilled]: (state, action) => {
            if (typeof action.payload !== 'undefined')
            {
                state.selected_group = action.payload.expense
            }
            else {
                state.exit_flag = true
            }
        }
    }
});

export const {setGroup, setSelectedGroup, setImage, removeGroup, approveGroup} = GroupReducer.actions;
export default GroupReducer.reducer