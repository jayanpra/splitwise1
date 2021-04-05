import { createSlice } from '@reduxjs/toolkit';

export const GroupReducer = createSlice({
    name: "group",
    initialState:{
        name: null,
        groups: [],
        group_names: [],
        selected_group: [],
        currency: null,
        pic: null,
    },
    reducers: {
        setGroup(state,action) {
            state.name = action.payload.name
            state.groups = action.payload.groups
            state.group_names = action.payload.group_names
            state.selected_group = action.payload.selected_group
            state.currency = action.payload.currency
            state.pic = action.payload.pic
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
        }
    },
});

export const {setGroup, setSelectedGroup, setImage, removeGroup} = GroupReducer.actions;
export default GroupReducer.reducer