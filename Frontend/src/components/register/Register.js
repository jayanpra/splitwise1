import Navigator from '../landing/Navigator'
import SignupForms from "./SignupForms"
import axios from 'axios'
import { Redirect } from "react-router-dom";
import {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    let [clickstate,setClick] = useState(null)
    // const notify = (message) => toast(message);

    const onClickLogin = () => {
        setClick(clickstate = "dash")
    }
    if (clickstate === "dash") {
        return <Redirect to='/dash'/>
    }
    const on_submit_form = (email,fname,lname,password) => {
        console.log(password, " ", email)
        let data = {
            email: email,
            fname: fname,
            lname: lname,
            password: password
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/register',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                localStorage.setItem("token", response.data.token)
                setClick(clickstate = "dash")
            }
            else {
                alert("Email Already Exist")
            }
        })
        .then(response => {
            //console.log("Status Code : ",response)
        });

    }
    
    return (
        <div>
            {clickstate === "dash" ? <Redirect to='/dash'/> : null }
            <ToastContainer />
            <Navigator onClickLogin={onClickLogin}/>
            <SignupForms onClick={on_submit_form}/>
        </div>
    )
}

export default Register
