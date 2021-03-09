import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import ProfileImage from './profileImage'

const ProfileView = (para) => {
    console.log(para)
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <ProfileImage/>
                    </Col>
                    <Col>
                        <Row>
                            <h5>{para.name}</h5>
                            
                        </Row>
                        <Row>
                            <h5>{para.email}</h5>
                            
                        </Row>
                        <Row>
                            <h5>{para.phone}</h5>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProfileView
