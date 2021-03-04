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
            <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}>
                <Col sm={7}>
                    <ProfileView/>
                </Col>
                <Col sm={4}>
                    <Row>
                    <Container style={{height:"100px", marginTop:"50px"}}>
                        <h5 style={{textAlign: "left"}}>Your Currency:</h5>
                        <ProfileMetric options={currency}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Timezone:</h5>
                        <ProfileMetric options={timezone}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Language:</h5>
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
