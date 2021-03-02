import React from 'react'
import Navigator from "../landing/Navigator"
import DashNavigator from './DashNavigator'
import {Row, Col, Container} from "react-bootstrap"
const Dashboard = () => {
    return (
        <div>
            <Navigator/>
            <Row style={{marginTop: "70px"}}>
            <Col sm={3}>
            <Container style={{ height: '1000px' }}>
                <DashNavigator/>
            </Container >
            </Col>
            <Col sm={9}>
            <Container  style={{ height: '1000px' }}>
                <DashNavigator/>
            </Container>
            </Col>
            </Row>
        </div>
    )
}

export default Dashboard
