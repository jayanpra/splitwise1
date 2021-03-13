import { useState, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navigator from '../landing/Navigator';
import ProfileView from './ProfileView';
import ProfileMetric from './profileMetric';

const Profile = () => {
  const currency = ['USD', 'KWD', 'BHD', 'GBP', 'EUR', 'CAD'];
  const timezone = ['abc', 'def'];
  const language = ['English', 'French', 'German'];
  const [data, setData] = useState({
    name: null,
    email: null,
    phone: null,
    currency: null,
    timezone: null,
    language: null,
    image: null,
  });

  useEffect(() => {
    if (data.name === null) {
      const token = localStorage.getItem('token');
      if (token) {
        const serverData = { 'token': token };
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/profile/initialPull', serverData)
          .then((response) => {
            if (response.status === 200) {
              setData(
                {
                  name: response.data.name,
                  email: response.data.email,
                  phone: response.data.phone,
                  currency: response.data.currency,
                  timezone: response.data.timezone,
                  language: response.data.language,
                  image: response.data.image,
                },
              );
            }
          })
          .then((response) => {
            return <Redirect to='/landing'/>
          }); 
      }
      else {
        return <Redirect to='/landing'/>
      }
    }
  });

  const update_local_info = (value, key) => {
    switch (key) {
      case 'name':{
        setData({...data, name: value,})
        break;
      }
      case 'email':{
        setData({...data, email: value,})
        break;
      }
      case 'phone':{
        setData({...data, phone: value,})
        break;
      }
      case 'currency':{
        setData({...data, currency: value,})
        break;
      }
      case 'timezone':{
        setData({...data, timezone: value,})
        break;
      }
      case 'language':{
        setData({...data, language: value,})
        break;
      }
      case 'image':{
        setData({...data, image: value,})
        break;
      }
      default:
        break;
    }
  }
  const onProfileChange = (value) => {
    const pckg = {token:localStorage.getItem('token'), data: value}
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/profile/update', pckg)
      .then((response) => {
        if (response.status === 200) {
          console.log("Records Saved")
          update_local_info(value.value, value.type)
        }
      })
      .then((response) => {
          console.log("DataBase Issue")
      }); 
  }
  return (
    <div>
            <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}> 
                <Col sm={7}>
                    <ProfileView para={data} onChange={onProfileChange}/>
                </Col>
                <Col sm={4}>
                    <Row>
                    <Container style={{height:"100px", marginTop:"50px"}}>
                        <h5 style={{textAlign: "left"}}>Your Currency:</h5>
                        <ProfileMetric head={"Currency"} options={currency} para={data["currency"]} onChange={onProfileChange}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Timezone:</h5>
                        <ProfileMetric head={"Timezone"} options={timezone} para={data["timezone"]} onChange={onProfileChange}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Language:</h5>
                        <ProfileMetric head={"Language"} options={language} para={data["language"]} onChange={onProfileChange}/>
                    </Container>
                    </Row>
                </Col>
                <Col sm={1}></Col>
            </Row>
        </div>
  );
};

export default Profile;
