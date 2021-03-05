import {useState} from 'react'
import {Form,Container, Row, Col, Button} from 'react-bootstrap'
import FormGroup from "../common/FormGroup"
import {useDispatch} from 'react-redux'


const SignupForms = ({onSubmit}) => {
    let [profile, setProfile] =useState({
        fname: null,
        lname: null,
        email: null, 
        password: null
    });
    const dispatch = useDispatch()
    const onFnameChange = (e) => {
        setProfile({
            ...profile,
            fname: e.target.value
        });
    }
    const onLnameChange = (e) => {
        setProfile({
            ...profile,
            lname: e.target.value
        });
    }
    const onEmailChange = (e) => {
        setProfile({
            ...profile,
            email: e.target.value
        });
    }
    const onPasswordChange = (e) => {
        setProfile({
            ...profile,
            password: e.target.value
        });
    }
    const onSave = (e) => {
        dispatch({type:"Register", payload:{email:profile.email, password:profile.password, fname:profile.fname, lname:profile.lname}})
        onSubmit()
    }
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <Col>
                    <FormGroup onChange={onFnameChange} placeholder="Enter First Name" label="First Name"/>
                    </Col>
                    <Col>
                    <FormGroup onChange={onLnameChange} placeholder="Enter Last Name" label="Last Name"/>
                    </Col>
                </Row>
                <Row>
                    <FormGroup onChange={onEmailChange} type="email" placeholder="Enter email address" label="Email Address"/>
                </Row>
                <Row>
                    <FormGroup onChange={onPasswordChange} type="password" placeholder="Enter password" label="Password"/>
                </Row>
                <Row>
                    <Col  md={{ span: 6, offset:3 }}>
                <Button variant="primary" onClick={onSave} type="button">Submit
                </Button>
                </Col>
                </Row>
            </Form>
            </Container>
        </div>
    )
}

export default SignupForms
