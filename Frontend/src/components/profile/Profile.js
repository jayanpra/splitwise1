import { useState, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navigator from '../landing/Navigator';
import ProfileView from './ProfileView';
import ProfileMetric from './profileMetric';
import GroupSide from '../common/GroupSide';
import AddExpense from '../common/AddExpense';

const Profile = () => {
  const currency = ['USD', 'KWD', 'BHD', 'GBP', 'EUR', 'CAD'];
  const timezone = ['UTC - 12:00',
    'UTC - 11:00',
    'UTC - 10:00',
    'UTC - 09:00',
    'UTC - 08:00',
    'UTC - 07:00',
    'UTC - 06:00',
    'UTC - 05:00',
    'UTC - 04:00',
    'UTC - 03:00',
    'UTC - 02:00',
    'UTC - 01:00',
    'UTC',
    'UTC + 01:00',
    'UTC + 02:00',
    'UTC + 03:00',
    'UTC + 04:00',
    'UTC + 05:00',
    'UTC + 06:00',
    'UTC + 07:00',
    'UTC + 08:00',
    'UTC + 09:00',
    'UTC + 10:00',
    'UTC + 11:00',
    'UTC + 12:00'];
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

  const [expTog, setToggle] = useState(false)
  const [delayed, noSession] = useState(false)

  useEffect(() => {
    if (data.name === null) {
      const token = localStorage.getItem('token');
      if (token) {
        const serverData = { 'token': token };
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/profile/initialPull', serverData)
          .then((response) => {
            if (response.status === 200) {
              localStorage.setItem("currency", response.data.currency)
              localStorage.setItem("fname", response.data.name.split( )[0])
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
        noSession(true)
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
        localStorage.setItem("currency", value)
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
  const showAddExpense = () => {
    setToggle(!expTog)
  } 
  return (
    <div>
        {delayed ? <Redirect to='/landing'/>: null}
        <AddExpense open={expTog} onToggle={showAddExpense}/>
        <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}> 
                <Col sm={2}>
                <GroupSide launchExpense={showAddExpense}/>
                </Col>
                <Col sm={6}>
                    <ProfileView para={data} onChange={onProfileChange}/>
                </Col>
                <Col sm={3}>
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
