import { createSlice } from '@reduxjs/toolkit';

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
                if (action.payload.groups[i].active == 'passive') {
                    state.group_req.push(action.payload.groups[i].name)
                }
            }
            
        },
        setSelectedGroup(state,action){
            state.name = action.payload.name
            state.selected_group = action.payload.selected_group
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
});

export const {setGroup, setSelectedGroup, setImage, removeGroup, approveGroup} = GroupReducer.actions;
export default GroupReducer.reducer