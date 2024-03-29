import React from 'react'
import {Form} from "react-bootstrap"

const FormGroup = ({label, placeholder, type, controlId, onChange}) => {
    return (
        <div>
            <Form.Group controlId={controlId}>
                    <Form.Label style={{textAlign: "left"}}>{label}</Form.Label>
                    <Form.Control onChange={onChange} type={type} placeholder={placeholder} />
            </Form.Group>
        </div>
    )
}

FormGroup.defaultProps = {
    type: "text"
}

export default FormGroup
