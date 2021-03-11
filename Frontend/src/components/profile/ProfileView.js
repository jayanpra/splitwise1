import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import ProfileImage from './profileImage'
import ToggleBox from '../common/ToggleBox'

const ProfileView = (para, onChange) => {
    //console.log(para.para.name," is Para")
    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <ProfileImage/>
                    </Col>
                    <Col>

                        <Container style={{'height':'80px'}}>
                        <ToggleBox heading="Name" value={para.para.name} onChange={onChange}/>
                        </Container>
                        <Container style={{'height':'80px'}}>
                        <ToggleBox heading="Email" value={para.para.email} onChange={onChange}/>
                        </Container>
                        <Container style={{'height':'80px'}}>
                        <ToggleBox heading="Phone" value={para.para.phone} onChange={onChange}/>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProfileView
