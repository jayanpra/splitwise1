import React from 'react'
import FormGroup from '../common/FormGroup'
import {Container, Row, Button, Form} from "react-bootstrap"

const LoginForm = () => {
    
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <FormGroup type="email" placeholder="Enter email address" label="Email Address"/>
                </Row>
                <Row>
                    <FormGroup type="password" placeholder="Enter password" label="Password"/>
                </Row>
                <Button variant="primary" type="submit">Sign In
                </Button>
            </Form>
            </Container>
        </div>
    )
}

export default LoginForm
