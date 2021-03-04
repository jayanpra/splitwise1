import "bootstrap/dist/css/bootstrap.min.css"
import Navigator from './Navigator'
import LandingBody from './LandingBody'
import { Redirect } from "react-router-dom";
import {useState} from 'react'

const Landing = () => {
    let [clickstate,setClick] = useState(null)
    const onClickLogin = () => {
        setClick(clickstate = "login")
    }
    const onClickRegister = () => {
        setClick(clickstate = "register")
    }
    if (clickstate === "login") {
        return <Redirect to='/login'/>
    }
    if (clickstate === "register") {
        return <Redirect to='/register'/>
    }
    return (
        <div>
                <Navigator onClickLogin={onClickLogin} onClickRegister={onClickRegister}/>
                <LandingBody/>
        </div>
    )
}

export default Landing
