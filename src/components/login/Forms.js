import React from 'react'
import {Form,Container, Row, Col} from 'react-bootstrap'

const Forms = () => {
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{textAlign: "left"}}>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{textAlign: "left"}}>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                </Row>
                <Row>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label style={{textAlign: "left"}}>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                        </Form.Text>
                    </Form.Group>
                </Row>
                
            </Form>
            </Container>
        </div>
    )
}

export default Forms
