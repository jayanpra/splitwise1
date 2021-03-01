import React from 'react'
import {Form,Container, Row, Col, Button} from 'react-bootstrap'
import FormGroup from "../comman/FormGroup"

const SignupForms = () => {
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <Col>
                    <FormGroup placeholder="Enter First Name" label="First Name"/>
                    </Col>
                    <Col>
                    <FormGroup placeholder="Enter Last Name" label="Last Name"/>
                    </Col>
                </Row>
                <Row>
                    <FormGroup type="email" placeholder="Enter email address" label="Email Address"/>
                </Row>
                <Row>
                    <FormGroup type="password" placeholder="Enter password" label="Password"/>
                </Row>
                <Row>
                    <Col  md={{ span: 6, offset:3 }}>
                <Button variant="primary" type="submit">Submit
                </Button>
                </Col>
                </Row>
            </Form>
            </Container>
        </div>
    )
}

export default SignupForms
