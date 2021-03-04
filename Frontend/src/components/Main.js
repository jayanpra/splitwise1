import {Route, Router} from 'react-router-dom';
import Landing from './landing/Landing';
import Register from './register/Register';
import Login from './login/Login'
import Dashboard from './dashboard/Dashboard'
import Profile from './profile/Profile'
// <Route path="/login" component={Login}/>

const Main = () => {
    return (
        <div>
            <Route path="/profile" component={Profile}/>
        </div>
    )
}

export default Main
