import {useState} from "react";
import { } from "mdbreact";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
const GroupSide = ({groupname, launchExpense, changeGroup}) => {

    return (
        <ProSidebar>
        <Menu iconShape="square">
        <MenuItem>Create Group<Link to="/creategroup" /></MenuItem>
        <MenuItem>Dashboard</MenuItem>
        <MenuItem>Profile<Link to="/profile" /></MenuItem>
        <MenuItem onClick={launchExpense}>Add An Expense</MenuItem>
        {groupname ? null : <MenuItem>Group<Link to="/group" /></MenuItem> }
        <SubMenu title="Your Group">
        {groupname ? groupname.map((group)=> <MenuItem onClick={() => changeGroup(group)}>{group}</MenuItem>):  <MenuItem>No Groups Available</MenuItem>}
                </SubMenu>
        <MenuItem>Logout</MenuItem>
        </Menu>
        
        </ProSidebar>
    );
  }

export default GroupSide;