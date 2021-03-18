import React from 'react'
import {Card, Form} from 'react-bootstrap'
import logo from '../landing/splitwise_logo.png'

const ProfileImage = ({onChange}) => {
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={logo} />
                <Card.Body>
                    <Card.Title>Hi </Card.Title>
                    <Card.Text>Create your own avatar</Card.Text>
                    <Form>
                        <Form.File 
                            id="custom-file"
                            label="Add"
                            custom
                            onChange={(event) => onChange(event.target.files[0] || null)}/>
                        </Form>
                </Card.Body>
            </Card>
            
        </div>
    )
}

export default ProfileImage
