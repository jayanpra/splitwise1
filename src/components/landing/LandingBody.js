import React from 'react'
import {Container, Jumbotron, Col} from 'react-bootstrap'
import logo from './splitwise_logo.png'
import bg from './bg_landing.jpg'

const LandingBody = () => {
    return (
        <div>
                <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px' }}>
                    <Col sm={7}>
                    <Jumbotron style={{ height: '1000px' }}>
                        <h1 style={{marginTop: '60px', textAlign: 'left'}}> Hi there, Still Using Old Tricks ? </h1>
                        <h3 style={{marginTop: '10px', textAlign: 'left'}}>Jump to Splitwise <img src={logo} width="30" height="30" alt=""/></h3>
                    </Jumbotron>
                    </Col>
                </Container>
        </div>
    )
}

export default LandingBody
