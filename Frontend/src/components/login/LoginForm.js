
import {Container, Row, Col, Button, Form} from "react-bootstrap"
import { MDBInput,MDBTypography } from "mdbreact";

const LoginForm = ({onClick}) => {
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
            <Row style={{marginTop: "4%"}}>
                <Col sm={{ span: 4, offset: 4 }}>
                <Container fluid style={{ backgroundColor: 'blue', height: '110%'}}>
                <MDBTypography tag='h3' variant="h3" style={{textAlign:'center', color: "white"}}>Log In</MDBTypography>
                </Container>
                </Col>
                </Row>
                <Row style={{marginTop: "1%"}}>
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
                <Button className="btn btn-success" onClick={() => onClick(document.getElementById("email").value,
                                                                            document.getElementById("pass").value)} type="button">Sign In
                </Button>
            </Form>
            </Container>
        </div>
    )
}

export default LoginForm
