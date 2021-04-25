import Navigator from '../landing/Navigator'
import SignupForms from "./SignupForms"
import axios from 'axios'
import { Redirect } from "react-router-dom";
import {useState, useEffect} from 'react'
import 'react-toastify/dist/ReactToastify.css';
import {register,clear} from "../../actions/logisterActions"
import { useSelector, useDispatch } from "react-redux";


const Register = () => {
    let [clickstate,setClick] = useState(null)
    const dispatch = useDispatch()
    const redux_data = useSelector(state => state.logister)
    
    // const notify = (message) => toast(message);
    const isPassed = redux_data.pass;
    const isError = redux_data.error
    const onClickLogin = () => {
        setClick(clickstate = "dash")
        dispatch(clear());
    }
    useEffect(() => {
        setClick(isPassed ? "dash" : null);
        if (isError){
            alert(isError)
            dispatch(clear());

        }
    }, [isPassed, isError, dispatch])

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
        dispatch(register(data))
        // axios.defaults.withCredentials = true;
        // axios.post('http://54.190.4.247:3001/register',data)
        // .then(response => {
        //     console.log("Status Code : ",response.status);
        //     if(response.status === 200){
        //         setClick(clickstate = "dash")
        //     }
        //     else {
        //         alert("Email Already Exist")
        //     }
        // })
        // .then(response => {
        //     //console.log("Status Code : ",response)
        // });

    }
    
    return (
        <div>
            {clickstate === "dash" ? <Redirect to='/dash'/> : null }
            <Navigator onClickLogin={onClickLogin}/>
            <SignupForms onClick={on_submit_form}/>
        </div>
    )
}

export default Register
