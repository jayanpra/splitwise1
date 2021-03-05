import React from 'react'
import FormGroup from '../common/FormGroup'
import {Container, Row, Button, Form} from "react-bootstrap"
import {useDispatch} from "react-redux"

const LoginForm = ({onClick}) => {
    let email = null
    let password = null
    const dispatch = useDispatch()
    const onChangeEmail = (e) => {
        email = e.target.value
    }
    const onChangePassword = (e) => {
        password = e.target.value
    }
    const on_submit_form = () => {
        dispatch({type:"Login", payload:{email:email, password:password}})
        console.log("All Okay here")
        onClick()
    }
    
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <FormGroup type="email" onChange={onChangeEmail} placeholder="Enter email address" label="Email Address"/>
                </Row>
                <Row>
                    <FormGroup type="password" onChange={onChangePassword} placeholder="Enter password" label="Password"/>
                </Row>
                <Button variant="primary" onClick={on_submit_form} type="button">Sign In
                </Button>
            </Form>
            </Container>
        </div>
    )
}

export default LoginForm
