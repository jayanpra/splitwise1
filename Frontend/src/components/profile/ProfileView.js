import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import ProfileImage from './profileImage'

const ProfileView = () => {
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <ProfileImage/>
                    </Col>
                    <Col>
                        <Row>
                            <h5>Name</h5>
                            
                        </Row>
                        <Row>
                            <h5>email</h5>
                            
                        </Row>
                        <Row>
                            <h5>phone</h5>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProfileView
