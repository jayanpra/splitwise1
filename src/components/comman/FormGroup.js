import React from 'react'
import {Form} from "react-bootstrap"

const FormGroup = () => {
    return (
        <div>
            <Form.Group controlId="formBasicEmail">
                    <Form.Label style={{textAlign: "left"}}>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>
        </div>
    )
}

export default FormGroup
