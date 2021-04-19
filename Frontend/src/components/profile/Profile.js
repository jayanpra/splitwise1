import { useState, useEffect } from 'react';
import { Col, Row, Container } from 'react-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navigator from '../landing/Navigator';
import ProfileView from './ProfileView';
import ProfileMetric from './profileMetric';
import GroupSide from '../common/GroupSide';
import AddExpense from '../common/AddExpense';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import { setSingleData, removeError } from '../../reducer/ProfileReducer'
import {get_data, send_update} from '../../actions/profileActions'

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
  const dispatch = useDispatch();
  const redux_data = useSelector(state => state.profile);
  const [expTog, setToggle] = useState(false)
  const [delayed, noSession] = useState(false)
  const notify = (message) => toast(`${message} changed sucessfully!`);
  
  const LogOut = () => {
    noSession(true)
  }

  useEffect(() => {
    dispatch(get_data(localStorage.getItem('token')))
  },[]);

  // useEffect(() => {
  //   if (data.name === null) {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       const serverData = { 'token': token };
  //       axios.defaults.withCredentials = true;
  //       axios.post('http://localhost:3001/profile/initialPull', serverData)
  //         .then((response) => {
  //           if (response.status === 200) {
  //             localStorage.setItem("currency", response.data.currency)
  //             localStorage.setItem("fname", response.data.name.split( )[0])
  //             console.log(response.data)
  //             dispatch( setRData({pname: response.data.name, 
  //                               email: response.data.email, 
  //                               phone: response.data.phone,
  //                               pic_loc: "http://localhost:3001/"+response.data.pic,
  //                               currency: response.data.currency,
  //                               timezone: response.data.timezone,
  //                               language: response.data.language}))
  //           }
  //         })
  //         .then((response) => {
  //           return <Redirect to='/landing'/>
  //         }); 
  //     }
  //     else {
  //       noSession(true)
  //     }
  //   }
  // },[data]);

  
  const onImageChange = (event) => {
    const formData = new FormData();
    console.log(event.target.files[0]);
    formData.append('profileImage',event.target.files[0],event.target.files[0].name + ',' + localStorage.getItem('token'));
    const config = {
      headers: { 
        'content-type': 'multipart/form-data'
      }
    }
    for (var value of formData.values()) {
        console.log(value);
    }
    axios.post('http://localhost:3001/imageupdate',formData,config )
      .then((response) => {
        if (response.status === 200) {
          console.log("Records Saved")
          const regex = /\/[\w]+\.\w+/
          const new_path = redux_data.pic_loc.replace(regex, event.target.files[0].name)
          dispatch(setSingleData({key:"image", value: new_path}))
          window.location.reload(false)
        }
      })
      .then((response) => {
          console.log("DataBase Issue")
      }); 
  }
  const onProfileChange = async (value) => {
    if (value.type === 'email') {
      const email_val = /\S+@\S+\.\S+/
        if (!email_val.test(value.value)){
          notify("Invalid Email Not")
          return
        }
    }
    if (value.type === 'phone') {
      const phone_val = /\d+/
        if (!(phone_val.test(value.value) && value.value.length === 10)){
          notify("Invalid Phone Not")
          return
        }
    }
    const pckg = {token:localStorage.getItem('token'), data: value}
    await dispatch(send_update(pckg));
    console.log(redux_data.error)
    if (redux_data.error) {
      notify(redux_data.feed)
      removeError()
    }
    else {
      notify(value.type)
    }
    // axios.defaults.withCredentials = true;
    // axios.post('http://localhost:3001/profile/update', pckg)
    //   .then((response) => {
    //     if (response.status === 200) {
    //       console.log("Records Saved")
    //       dispatch(setSingleData({key:value.type, value: value.value}))
    //       notify(value.type)
    //     }
    //   })
    //   .then((response) => {
    //       console.log("DataBase Issue")
    //   }); 
  }
  const showAddExpense = () => {
    setToggle(!expTog)
  } 
  return (
    <div>
        {delayed ? <Redirect to='/landing'/>: null}
        <ToastContainer />
        <AddExpense open={expTog} onToggle={showAddExpense}/>
        <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}> 
                <Col sm={2}>
                <GroupSide LogOut={LogOut} launchExpense={showAddExpense}/>
                </Col>
                <Col sm={6}>
                    <ProfileView onImageChange={onImageChange} para={redux_data} onChange={onProfileChange}/>
                </Col>
                <Col sm={3}>
                    <Row>
                    <Container style={{height:"100px", marginTop:"50px"}}>
                        <h5 style={{textAlign: "left"}}>Your Currency:</h5>
                        <ProfileMetric head={"Currency"} options={currency} para={redux_data.currency} onChange={onProfileChange}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Timezone:</h5>
                        <ProfileMetric head={"Timezone"} options={timezone} para={redux_data.timezone} onChange={onProfileChange}/>
                    </Container>
                    </Row>
                    <Row>
                    <Container style={{height:"100px"}}>
                        <h5 style={{textAlign: "left"}}>Your Language:</h5>
                        <ProfileMetric head={"Language"} options={language} para={redux_data.language} onChange={onProfileChange}/>
                    </Container>
                    </Row>
                </Col>
                <Col sm={1}></Col>
            </Row>
        </div>
  );
};

export default Profile;