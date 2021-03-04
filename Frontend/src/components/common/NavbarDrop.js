import {NavDropdown} from 'react-bootstrap'

const NavbarDrop = (onClick, onLogout) => {
    return (
        <div>
        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item onClick={onClick}>Dashboard</NavDropdown.Item>
            <NavDropdown.Item onClick={onClick}>Profile</NavDropdown.Item>
            <NavDropdown.Item onClick={onClick}>Group</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={onLogout}>Logout</NavDropdown.Item>
      </NavDropdown>
        </div>
    )
}

export default NavbarDrop
