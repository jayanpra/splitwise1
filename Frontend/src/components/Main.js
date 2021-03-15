import {Route} from 'react-router-dom';
import Landing from './landing/Landing';
import Register from './register/Register';
import Login from './login/Login'
import GroupPage from './group/groupPage'
import GroupCreate from './group/groupCreate'
//import Dashboard from './dashboard/Dashboard'
import Profile from './profile/Profile'
// <Route path="/login" component={Login}/>

const Main = () => {
    return (
        <div>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/landing" component={Landing}/>
            <Route path="/group" component={GroupPage}/>
            <Route path="/creategroup" component={GroupCreate}/>
        </div>
    )
}

export default Main
