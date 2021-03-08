import React from 'react'
import FormGroup from '../common/FormGroup'
import {Container, Row, Button, Form} from "react-bootstrap"

const LoginForm = ({onClick}) => {
    let email = null
    let password = null
    const onChangeEmail = (e) => {
        email = e.target.value
    }
    const onChangePassword = (e) => {
        password = e.target.value
    }
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <FormGroup type="email" OnFocusChanged={onChangeEmail} placeholder="Enter email address" label="Email Address"/>
                </Row>
                <Row>
                    <FormGroup type="password" OnFocusChanged={onChangePassword} placeholder="Enter password" label="Password"/>
                </Row>
                <Button className="btn btn-success" onClick={() => onClick(email,password)} type="submit">Sign In
                </Button>
            </Form>
            </Container>
        </div>
    )
}

export default LoginForm
