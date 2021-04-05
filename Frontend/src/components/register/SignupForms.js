import {Form,Container, Row, Col, Button} from 'react-bootstrap'
import { MDBInput,MDBTypography } from "mdbreact";
import {useState} from 'react'
import { useSelector, useDispatch } from "react-redux";
import {addDetails} from '../../reducer/RegisterReducer'


const SignupForms = ({onClick}) => {
    let [invalid_name,setClickname] = useState(false)
    let [invalid_email,setClickemail] = useState(false)
    let [invalid_pass,setClickpassword] = useState(false)
    let [invalid_cpass,setClickcpassword] = useState(false)
    const dispatch = useDispatch();
    const redux_data = useSelector(state => state.register);
    const validate = (fname, lname, email, password, confirm_pass) => {
        backtrack()
        dispatch(addDetails({fname: fname, lname: lname, email: email, password: password}))
        let flag = false
        const name_val = /^([a-z]|[A-Z]| )+$/

        if (!(name_val.test(fname) && name_val.test(lname))){
            setClickname(true)
            flag = true
        }
        const email_val = /\S+@\S+\.\S+/
        if (!email_val.test(email)){
            setClickemail(true)
            flag = true
        }
        if (password.length < 4){
            setClickpassword(true)
            flag = true
        }
        if (password !== confirm_pass){
            setClickcpassword(true)
            flag = true
        }
        if (!flag){
            onClick(email, fname, lname, password)
        }
        
    }
    const backtrack = () => {
        setClickcpassword(false)
        setClickpassword(false)
        setClickemail(false)
        setClickname(false)
    }
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '100%'}}>
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
                    <MDBTypography tag='h5' variant="h5" value={redux_data.fname} style={{textAlign:'center'}}>First Name</MDBTypography>
                    <MDBInput id="fname" size="lg"/>
                    </Col>
                    <Col sm={{ span: 2, offset: 0 }}>
                    <MDBTypography tag='h5' variant="h5" value={redux_data.lname} style={{textAlign:'center'}}>Last Name</MDBTypography>
                    <MDBInput id="lname" size="lg" />
                    </Col>
                    {invalid_name ? <Col sm={{ span: 2, offset: 0 }}><MDBTypography tag='h6' variant="h6" style={{textAlign:'center', color: "red"}}>Empty or Invalid Field</MDBTypography></Col> : null}
                </Row>
                <Row>
                <Col sm={{ span: 4, offset: 4 }}>
                <MDBTypography tag='h5' variant="h5" value={redux_data.email} style={{textAlign:'center'}}>Email</MDBTypography>
                <MDBInput id="email" type="email" size="lg" />
                </Col>
                {invalid_email ? <Col sm={{ span: 2, offset: 0 }}><MDBTypography tag='h6' variant="h6" style={{textAlign:'center', color: "red"}}>Empty or Invalid Email</MDBTypography></Col> : null}
                </Row>
                <Row>
                <Col sm={{ span: 4, offset: 4 }}>
                <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>Password</MDBTypography>
                <MDBInput id="pass" type="password" size="lg" />
                </Col>
                {invalid_pass ? <Col sm={{ span: 2, offset: 0 }}><MDBTypography tag='h6' variant="h6" style={{textAlign:'center', color: "red"}}>Empty or Invalid Password</MDBTypography></Col> : null}
                </Row>
                <Row>
                <Col sm={{ span: 4, offset: 4 }}>
                <MDBTypography tag='h5' variant="h5" style={{textAlign:'center'}}>Confirm Password</MDBTypography>
                <MDBInput id="cpass" type="password" size="lg"/>
                </Col>
                {invalid_cpass ? <Col sm={{ span: 2, offset: 0 }}><MDBTypography tag='h6' variant="h6" style={{textAlign:'center', color: "red"}}>Password Doesn't Match</MDBTypography></Col> : null}
                </Row>
                <Row>
                    <Col  md={{ span: 6, offset:3 }}>
                <Button variant="primary" onClick={() => validate(document.getElementById("fname").value,
                                                                document.getElementById("lname").value,
                                                                document.getElementById("email").value,
                                                                document.getElementById("pass").value,
                                                                document.getElementById("cpass").value)} type="button">Submit
                </Button>
                </Col>
                </Row>
            </Form>
            </Container>
        </div>
    )
}

export default SignupForms
