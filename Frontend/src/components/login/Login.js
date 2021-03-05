import {useState, useEffect} from 'react'
import Navigator from "../landing/Navigator"
import LoginForm from "./LoginForm"
import axios from 'axios'
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux"

const Login = () => {
    let [clickstate, setClick] = useState(null);
    const email = useSelector(state => state.email);
    const password = useSelector(state => state["password"]);

    const onClickRegister = () => {
        setClick(clickstate = "register")
    }

    useEffect(() => {
        if (email || password) {
            console.log("Useeffect",email,password)
            let data = {
                email: email,
                password: password
            }
            console.log("Sending to server", email, password)
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/login',data)
            .then(response => {
                console.log("Status Code :",response.status);
            if(response.status === 200){
                setClick(clickstate = "profile")
            }
            else {
                console.log("Status Code : ",response)
            }
            });
        }
    }, [email, password]);

    if (clickstate === "profile"){
        return <Redirect to='/profile'/>
    }
    if (clickstate === "register") {
        return <Redirect to='/register'/>
    }
    const on_Click_login = (email, password) => {
        let data = {
            email: email,
            password: password
        }
        /*
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/login',data)
        .then(response => {
            console.log("Status Code :",response.status);
            if(response.status === 200){
                setClick(clickstate = "profile")
            }
        })
        .then(response => {
            console.log("Status Code : ",response)
            this.setState({
                    error : true
                })
        });
        */
    }

    // console.log("Waiting to send Signal",email,password);

    return (
        <div>
            <Navigator onClickRegister={onClickRegister}/>
            <LoginForm onClick={on_Click_login}/>
        </div>
    )
}

export default Login
