import React from 'react'
import {Card, Form} from 'react-bootstrap'
import logo from '../landing/splitwise_logo.png'

const ProfileImage = ({pic, onImageChange}) => {
    import 
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                {pic ? <Card.Img variant="top" src={pic} /> : <Card.Img variant="top" src={logo}/>}
                
                <Card.Body>
                    <Card.Title>Hi </Card.Title>
                    <Card.Text>Create your own avatar</Card.Text>
                    <Form>
                        <Form.File 
                            id="custom-file"
                            label="Add"
                            custom
                            onChange={onImageChange}/>
                        </Form>
                </Card.Body>
            </Card>
            
        </div>
    )
}

export default ProfileImage
