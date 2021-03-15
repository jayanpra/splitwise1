import React from 'react'
import {Container, Col, Row} from 'react-bootstrap'
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import { MDBContainer } from 'mdbreact';

const GroupPage = () => {
    return (
        <div>
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: 0, left:0, height: "1000px" }}>
            <Row><MDBContainer>
      <p>.</p>
      <p className="ml-5 ml-lg-0">.</p>
    </MDBContainer></Row>
            <Col sm={2}>
                <GroupSide/>
            </Col>
            <Col sm={7}>
            </Col>
            <Col sm={3}>
            </Col>
            </Container>
        </div>
    )
}

export default GroupPage
