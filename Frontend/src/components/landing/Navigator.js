import React from 'react'
import {Navbar,Container,Col, Button, NavbarBrand,} from 'react-bootstrap'
import logo from './splitwise_logo.png'
import NavbarDrop from '../common/NavbarDrop'

const Navigator = ({loggedin, onClickRegister, onClickLogin}) => {

    return (
        <div class="fixed-top">
            <Container fluid>
            <Navbar bg="dark" variant="dark">
                        <Col sm={1}>
                        <NavbarBrand>
                        <img src={logo} width="30" height="30" alt=""/>
                            Splitwise
                        </NavbarBrand>
                        </Col>
                        <Col sm={9}>
                        </Col>
                        <Col sm={1}>
                        {loggedin ? (<NavbarDrop/>) : (
                        <Button type="button" onClick={onClickLogin} className="btn btn-light">Login</Button>
                        )}
                        </Col>
                        <Col sm={1}>
                        {loggedin ? <br/> : (
                        <Button style={{background:"green"}} onClick={onClickRegister} type="button" className="btn btn-success">Register</Button>
                        )}
                        </Col>
                    </Navbar>
            </Container>
        </div>
    )
}
Navigator.defaultProps = {
    loggedin: false,
    onClickRegister: null,
    onClickLogin: null

}
export default Navigator
