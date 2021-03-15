import React from 'react'
import {Card,Button} from 'react-bootstrap'
import logo from '../landing/splitwise_logo.png'

const ProfileImage = () => {
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={logo} />
                <Card.Body>
                    <Card.Title>Hi </Card.Title>
                    <Card.Text>Create your own avatar</Card.Text>
                    <Button variant="primary">add your Image</Button>
                </Card.Body>
            </Card>
            
        </div>
    )
}

export default ProfileImage
