import Navigator from '../landing/Navigator'
import SignupForms from "./SignupForms"
import axios from 'axios'
import { Redirect } from "react-router-dom";
import {useState} from 'react'

const Register = () => {
    let [clickstate,setClick] = useState(null)
    const onClickLogin = () => {
        setClick(clickstate = "login")
    }
    if (clickstate === "login") {
        return <Redirect to='/login'/>
    }
    const on_submit_form = (email, fname, lname, password) => {
        let data = {
            email: email,
            fname: fname,
            lname: lname,
            password: password
        }
        console.log("Waiting to send Signal")
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/register',data)
        .then(response => {
            console.log("Status Code : ",response.status);
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
            <Navigator onClickLogin={onClickLogin}/>
            <SignupForms onSubmit={on_submit_form}/>
        </div>
    )
}

export default Register
