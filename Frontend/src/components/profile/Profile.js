import React from 'react'
import Navigator from '../landing/Navigator'
import {Col,Row, Container} from 'react-bootstrap'
import ProfileView from './ProfileView'
import ProfileMetric from './profileMetric'

const Profile = () => {
    const currency = [ "USD", "KWD", "BHD", "GBP", "EUR", "CAD"]
    const timezone = ["abc", "def"]
    const language = ["English", "French", "German"]
    return (
        <div>
            <Navigator/>
            <Row style={{marginTop:"100px"}}>
                <Col sm={7}>
                    <ProfileView/>
                </Col>
                <Col sm={4}>
                    <Row>
                    <Container>
                        <ProfileMetric options={currency}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container>
                        <ProfileMetric options={timezone}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container>
                        <ProfileMetric options={language}/>
                    </Container>
                    </Row>
                </Col>
                <Col sm={1}></Col>
            </Row>
        </div>
    )
}

export default Profile
