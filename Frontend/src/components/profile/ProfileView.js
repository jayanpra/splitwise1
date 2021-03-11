import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import ProfileImage from './profileImage'

const ProfileView = (para) => {
    //console.log(para.para.name," is Para")
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <ProfileImage/>
                    </Col>
                    <Col>
                        <Row>
                            <h5 id="name">{para.para.name}</h5>
                            
                        </Row>
                        <Row>
                            <h5 id="email">{para.para.email}</h5>
                            
                        </Row>
                        <Row>
                            <h5 id="phone">{para.para.phone}</h5>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProfileView
