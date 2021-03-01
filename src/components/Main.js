import {Route, Router} from 'react-router-dom';
import Landing from './landing/Landing';
import Register from './register/Register';
import Login from './login/Login'

const Main = () => {
    return (
        <div>
            <Route path="/login" component={Login}/>
        </div>
    )
}

export default Main
