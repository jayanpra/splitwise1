import "bootstrap/dist/css/bootstrap.min.css"
import {Col, Row} from "react-bootstrap"
import Navigator from './Navigator'
import LandingBody from './LandingBody'

const Landing = () => {
    return (
        <div>
                <Navigator/>
                
                <LandingBody/>

                
        </div>
    )
}

export default Landing
