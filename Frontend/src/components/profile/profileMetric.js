import React from 'react'
import {Form} from 'react-bootstrap'

const ProfileMetric = ({options}) => {
    return (
        <div>
             <Form.Control as="select">
                {options.map((option) => (
                    <option>{option}</option>
                ))}
            </Form.Control>
        </div>
    )
}

export default ProfileMetric
