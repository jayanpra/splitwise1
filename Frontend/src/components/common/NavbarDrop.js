import {NavDropdown} from 'react-bootstrap'
import { Link } from 'react-router-dom';
const NavbarDrop = (onLogout) => {
    return (
        <div>
        <NavDropdown title={localStorage.getItem("fname")} id="basic-nav-dropdown">
            <NavDropdown.Item>Dashboard<Link to="/group"/></NavDropdown.Item>
            <NavDropdown.Item>Profile<Link to="/profile"/></NavDropdown.Item>
            <NavDropdown.Item>Group<Link to="/group"/></NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
      </NavDropdown>
        </div>
    )
}

export default NavbarDrop
