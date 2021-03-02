import {Route, Router} from 'react-router-dom';
import Landing from './landing/Landing';
import Register from './register/Register';
import Login from './login/Login'
import Dashboard from './dashboard/Dashboard'

const Main = () => {
    return (
        <div>
            <Route path="/register" component={Register}/>
        </div>
    )
}

export default Main
