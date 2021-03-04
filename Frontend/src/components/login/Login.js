import {useState} from 'react'
import Navigator from "../landing/Navigator"
import LoginForm from "./LoginForm"
import axios from 'axios'
import { Redirect } from "react-router-dom";

const Login = () => {
    let [clickstate,setClick] = useState(null)

    const onClickRegister = () => {
        setClick(clickstate = "register")
    }

    if (clickstate === "register") {
        return <Redirect to='/register'/>
    }
    const on_Click_login = (email, password) => {
        let data = {
            email: email,
            password: password
        }
        console.log("Waiting to send Signal")
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/login',data)
        .then(response => {
            console.log("Status Code :",response.status);
            if(response.status === 200){
                this.setState({
                    process_complete: true,
                    error : false
                })
            }
        })
        .then(response => {
            console.log("Status Code : ",response)
            this.setState({
                    error : true
                })
        });
    }

    return (
        <div>
            <Navigator onClickRegister={onClickRegister}/>
            <LoginForm onClick={on_Click_login}/>
        </div>
    )
}

export default Login
