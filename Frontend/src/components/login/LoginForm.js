import {useState} from 'react'
import FormGroup from '../common/FormGroup'
import {Container, Row, Button, Form} from "react-bootstrap"

const LoginForm = ({onClick}) => {
    let [login_info,setLogin] = useState({email:null, password:null})
    const onChangeEmail = (e) => {
       setLogin( {...login_info, email: e.target.value})
       console.log("E changes")
    }
    const onChangePassword = (e) => {
        setLogin( {...login_info, password: e.target.value})
        console.log("P changes")
    }
    return (
        <div>
            <Container fluid style={{ backgroundColor: 'lightblue', height: '1000px'}}>
            <h6>P</h6>
            <Form>
                <Row style={{marginTop: "60px"}}>
                    <FormGroup type="email" onChange={onChangeEmail} placeholder="Enter email address" label="Email Address"/>
                </Row>
                <Row>
                    <FormGroup type="password" onChange={onChangePassword} placeholder="Enter password" label="Password"/>
                </Row>
                <Button className="btn btn-success" onClick={() => onClick(login_info.email,login_info.password)} type="button">Sign In
                </Button>
            </Form>
            </Container>
        </div>
    )
}

export default LoginForm
