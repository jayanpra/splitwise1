
import { } from "mdbreact";
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { clear} from '../../actions/logisterActions';
const GroupSide = ({groupname, LogOut, launchExpense, changeGroup}) => {
    const dispatch = useDispatch()
    const Logout = () => {
      dispatch(clear())
      localStorage.removeItem("token")
      localStorage.removeItem("currency")
      localStorage.removeItem("fname")
      LogOut()
    }
    return (
        <ProSidebar>
        <Menu iconShape="square">
        <MenuItem>Recent Activity<Link to="/recent" /></MenuItem>
        <MenuItem>Create Group<Link to="/creategroup" /></MenuItem>
        <MenuItem>Dashboard<Link to="/dash" /></MenuItem>
        <MenuItem>Profile<Link to="/profile" /></MenuItem>
        <MenuItem onClick={launchExpense}>Add An Expense</MenuItem>
        {groupname ? <SubMenu title="Your Group">
        {groupname.map((group)=> <MenuItem onClick={() => changeGroup(group)}>{group}</MenuItem>)}
                </SubMenu> : <MenuItem>Group<Link to="/group" /></MenuItem> }
        
        <MenuItem onClick={Logout}>Logout</MenuItem>
        </Menu>
        
        </ProSidebar>
    );
  }

export default GroupSide;