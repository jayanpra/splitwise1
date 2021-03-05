import Navigator from '../landing/Navigator'
import SignupForms from "./SignupForms"
import axios from 'axios'
import { Redirect } from "react-router-dom";
import {useState, useEffect} from 'react'
import {useSelector,useDispatch} from 'react-redux'

const Register = () => {
    let [error,setError] = useState(false)
    let [clickstate,setClick] = useState(null)
    const email = useSelector(state => state.email);
    const password = useSelector(state => state.password);
    const fname = useSelector(state => state.fname);
    const lname = useSelector(state => state.lname)
    const dispatch = useDispatch()
    useEffect(() => {
        if (email && password && lname && fname) {
            console.log("Useeffect",email,password)
            let data = {
                email: email,
                fname: fname,
                lname: lname,
                password: password
                }
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/register',data)
            .then(response => {
            console.log("Status Code :",response.status);
            if(response.status === 200){
                dispatch({type:"Register", payload:{email:email, password:null, fname:fname, lname:lname}})
                setClick(clickstate = "login")
            }
            else {
                console.log("Status Code : ",response)
            }
            });
        }
    }, [email, password,lname,fname]);

    const onClickLogin = () => {
        setClick(clickstate = "login")
    }
    if (clickstate === "login") {
        return <Redirect to='/login'/>
    }
    const on_submit_form = () => {
        /*let data = {
            email: email,
            fname: fname,
            lname: lname,
            password: password
        }*/
        console.log("Waiting to send Signal")
       
        console.log("REDUX added")
        /*axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/register',data)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                setClick()
            }
        })
        .then(response => {
            console.log("Status Code : ",response)
            this.setError({
                    error : true
                })
        });*/

    }
    
    return (
        <div>
            <Navigator onClickLogin={onClickLogin}/>
            <SignupForms onSubmit={on_submit_form}/>
        </div>
    )
}

export default Register
