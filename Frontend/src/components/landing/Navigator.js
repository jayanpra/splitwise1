import React from 'react'
import {Navbar,Container,Col, Button,NavbarBrand,} from 'react-bootstrap'
import logo from './splitwise_logo.png'

const Navigator = () => {
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
                        <Button type="button" class="btn btn-light">Login</Button>
                        </Col><Col sm={1}>
                        <Button style={{background:"green"}} type="button" class="btn btn-success">Register</Button>
                        </Col>
                    </Navbar>
            </Container>
        </div>
    )
}

export default Navigator
