import {useState, useEffect} from 'react'
import Navigator from "../landing/Navigator"
import LoginForm from "./LoginForm"
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {login,clear} from "../../actions/logisterActions"
import { useSelector, useDispatch } from "react-redux";

const Login = () => {
    let [clickstate, setClick] = useState(null);
    const history = useHistory();
    const notify = (message) => toast(message);
    const dispatch = useDispatch();
    const redux_data = useSelector(state => state.logister)
    const onClickRegister = () => {
        setClick(clickstate = "register")
    }
    const isPassed = redux_data.pass;
    const isError = redux_data.error
    useEffect(() => {
        setClick(isPassed ? "dash" : null);
        if (isError){
            notify(isError)
            dispatch(clear());

        }
    }, [isPassed, isError, dispatch])

    useEffect(() => {
        if (clickstate === "dash"){
            dispatch(clear());
            history.push("/dash");
        }
        if (clickstate === "register") {
            history.push("/register");
        }
    }, [clickstate, dispatch, history])

    const on_Click_login = async (email, password) => {
        dispatch(clear())
        const email_val = /^\S+@\S+\.\S+$/
        if (!email_val.test(email)){
            notify(`Invalid Email`)
            return
        }
        if (password.length === 0){
            notify(`Empty Password`)
            return
        }
        let data = {
            email: email,
            password: password
        }
        await dispatch(login(data))
        axios.defaults.withCredentials = true;
        // axios.post('http://54.190.4.247:3001/login',data)
        // .then(response => {
        //     console.log("Status Code :",response.status);
        //     if(response.status === 200){
        //         console.log(data)
        //         localStorage.setItem('token', response.data.token)
        //         localStorage.setItem('currency', response.data.currency)
        //         localStorage.setItem('fname', response.data.name)
        //         setClick(clickstate = "dash")
        //     }
        //     else {
        //         notify("Incorrect Credentials")
        //     }
        // });
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
