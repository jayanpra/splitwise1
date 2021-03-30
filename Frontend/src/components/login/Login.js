import {useState} from 'react'
import Navigator from "../landing/Navigator"
import LoginForm from "./LoginForm"
import axios from 'axios'
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    let [clickstate, setClick] = useState(null);
    const notify = (message) => toast(message);

    const onClickRegister = () => {
        setClick(clickstate = "register")
    }

    if (clickstate === "profile"){
        return <Redirect to='/profile'/>
    }
    if (clickstate === "register") {
        return <Redirect to='/register'/>
    }
    const on_Click_login = (email, password) => {
        const email_val = /\S+@\S+\.\S+/
        if (!email_val.test(email)){
            notify(`Invalid Email`)
            return
        }
        let data = {
            email: email,
            password: password
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/login',data)
        .then(response => {
            console.log("Status Code :",response.status);
            if(response.status === 200){
                localStorage.setItem("token", response.data.token)
                setClick(clickstate = "profile")
            }
        })
        .then(response => {
            console.log("Status Code : ",response)
        });
    }

    return (
        <div>
            <ToastContainer />
            <Navigator onClickRegister={onClickRegister}/>
            <LoginForm onClick={on_Click_login}/>
        </div>
    )
}

export default Login
