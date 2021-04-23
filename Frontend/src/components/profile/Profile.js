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
import {get_data, send_update, clearError} from '../../actions/profileActions'

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
  const dispatch = useDispatch();
  const redux_data = useSelector(state => state.profile);
  const [expTog, setToggle] = useState(false)
  const [delayed, noSession] = useState(false)
  const notify = (message) => toast(message);
  const error = redux_data.error
  const feed = redux_data.feed
  const success = redux_data.success
  const LogOut = () => {
    noSession(true)
  }

  useEffect(() => {
    if (error){
      notify(feed)
      dispatch(clearError())
    }
  }, [dispatch,error, feed])

  useEffect(() => {
    if (success){
      notify(feed)
      dispatch(clearError())
    }
  }, [dispatch,success, feed])

  useEffect(() => {
    dispatch(get_data(localStorage.getItem('token')))
  },[dispatch]);
  
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