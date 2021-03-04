import React from 'react'
import {Card,Button} from 'react-bootstrap'

const ProfileImage = () => {
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="holder.js/100px180" />
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
