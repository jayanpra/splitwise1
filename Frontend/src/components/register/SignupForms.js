import {Form,Container, Row, Col, Button} from 'react-bootstrap'
import { MDBInput,MDBTypography } from "mdbreact";


const SignupForms = ({onClick}) => {
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "4%"}}>
                <Col sm={{ span: 4, offset: 4 }}>
                <Container fluid style={{ backgroundColor: 'blue', height: '110%'}}>
                <MDBTypography tag='h3' variant="h3" style={{textAlign:'center', color: "white"}}>Gear Up</MDBTypography>
                </Container>
                </Col>
                </Row>
                <Row style={{marginTop: "1%"}}>
                    <Col sm={{ span: 2, offset: 4 }}>
                    <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>First Name</MDBTypography>
                    <MDBInput id="fname" size="lg"/>
                    </Col>
                    <Col sm={{ span: 2, offset: 0 }}>
                    <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>Last Name</MDBTypography>
                    <MDBInput id="lname" size="lg"/>
                    </Col>
                </Row>
                <Row>
                <Col sm={{ span: 4, offset: 4 }}>
                <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>Email</MDBTypography>
                <MDBInput id="email" type="email" size="lg"/>
                </Col>
                </Row>
                <Row>
                <Col sm={{ span: 4, offset: 4 }}>
                <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>Password</MDBTypography>
                <MDBInput id="pass" type="password" size="lg"/>
                </Col>
                </Row>
                <Row>
                <Col sm={{ span: 4, offset: 4 }}>
                <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>Confirm Password</MDBTypography>
                <MDBInput id="cpass" type="password" size="lg"/>
                </Col>
                </Row>
                <Row>
                    <Col  md={{ span: 6, offset:3 }}>
                <Button variant="primary" onClick={() => onClick(document.getElementById("fname").value,
                                                                document.getElementById("lname").value,
                                                                document.getElementById("email").value,
                                                                document.getElementById("pass").value,
                                                                document.getElementById("cpass").value)} type="submit">Submit
                </Button>
                </Col>
                </Row>
            </Form>
            </Container>
        </div>
    )
}

export default SignupForms
