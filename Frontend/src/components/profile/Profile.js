import {useState, useEffect} from 'react'
import Navigator from '../landing/Navigator'
import {Col,Row, Container} from 'react-bootstrap'
import ProfileView from './ProfileView'
import ProfileMetric from './profileMetric'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const currency = [ "USD", "KWD", "BHD", "GBP", "EUR", "CAD"]
    const timezone = ["abc", "def"]
    const language = ["English", "French", "German"]
    const [data,setData] = useState({
        name: null,
        email: null,
        phone: null,
        currency: null,
        timezone: null,
        language: null,
        image: null
    })

    useEffect(() => {
        if (data.name === null) {
            const token = localStorage.getItem("token")
            if (token) {
                const data = {"token":token}
                axios.defaults.withCredentials = true;
                axios.post('http://localhost:3001/profile/initialPull',data)
                    .then(response => {
                        console.log("Status Code :",response.status);
                        console.log(response.data)
                        if(response.status === 200){
                            setData({name: response.data.name,
                            email: response.data.email,
                            phone: response.data.phone,
                            currency: response.data.currency,
                            timezone: response.data.timezone,
                            language: response.data.language,
                            image: response.data.image})
                        }
                    })
                    .then(response => {
                        console.log("Status Code : ",response)
                    }
                );
            }
            else {
                return <Redirect to='/landing'/>
            }
        }        
    });

    return (
        <div>
            <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}>
                <Col sm={7}>
                    <ProfileView para={data}/>
                </Col>
                <Col sm={4}>
                    <Row>
                    <Container style={{height:"100px", marginTop:"50px"}}>
                        <h5 style={{textAlign: "left"}}>Your Currency:</h5>
                        <ProfileMetric options={currency} para={data["currency"]}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Timezone:</h5>
                        <ProfileMetric options={timezone} para={data["timezone"]}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Language:</h5>
                        <ProfileMetric options={language} para={data["language"]}/>
                    </Container>
                    </Row>
                </Col>
                <Col sm={1}></Col>
            </Row>
        </div>
    )
}

export default Profile
