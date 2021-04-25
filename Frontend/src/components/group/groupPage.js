import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import { MDBContainer, MDBBtn, MDBCard, MDBCardBody } from 'mdbreact';
import GroupBody from './GroupBody';
import axios from 'axios';
import AddExpense from '../common/AddExpense'
import { Redirect } from 'react-router-dom';
import {FaCheck} from "react-icons/fa";
import ProfileImage from '../profile/profileImage'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import {get_group, change_group, approve_group, exit_group, clearError} from '../../actions/groupAction'


const GroupPage = () => {
    const dispatch = useDispatch()
    const redux_data = useSelector(state => state.group)
    const [expTog, setToggle] = useState(false)
    const [show_req, toggleShow] = useState(false)
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
          dispatch(clearError())
        }
      }, [dispatch,success, feed])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const serverData = { 'token': token };
            dispatch(get_group(serverData))
        }
        else {
            noSession(true)
        }
    },[dispatch]);

    const showAddExpense = () => {
        setToggle(!expTog)
    }

    const showRequest = () => {
        toggleShow(!show_req)
    }

    const groupApprove = (name) => {
        let gid, id;
        for(let i in redux_data.groups){
            if (redux_data.groups[i].name === name){
                gid = redux_data.groups[i].id
                id=i
            }
        }
        console.log(redux_data.groups)
        console.log("name is ", name)
        const serverData = { token: localStorage.getItem('token'), group_id: gid, seq: id };
        dispatch(approve_group(serverData))
    }

    const changeGroup = (gname) => {
        let gid;
        console.log(gname)
        for(let i in redux_data.groups){
            if (redux_data.groups[i].name === gname){
                gid = redux_data.groups[i].id
            }
        }
        const serverData = { token: localStorage.getItem('token'), group_id: gid, group_name: gname};
        dispatch(change_group(serverData))
    }

    const exitGroup = (gname) => {
        let gid;
        for(let i in redux_data.groups){
            if (redux_data.groups[i].name === gname){
                gid = redux_data.groups[i].id
            }
        }
        const serverData = { token: localStorage.getItem('token'), group_id: gid };
        dispatch(exit_group(serverData, gname))
    }


    const onImageChange = (event) => {
        if (redux_data.name === null){
            notify("no group selected")
            return
        }
        // let gid, id;
        // for(let i in redux_data.groups){
        //     if (redux_data.groups[i].name === redux_data.name){
        //         gid = redux_data.groups[i].id
        //         id=i
        //     }
        // }
        // const formData = new FormData();
        // console.log(event.target.files[0]);
        // formData.append('profileImage',event.target.files[0],event.target.files[0].name + ',' + gid);
        const config = {
          headers: { 
            'content-type': 'multipart/form-data'
          }
        }
        axios.post('http://54.190.4.247:3001/imagegroupupdate',event,config )
          .then((response) => {
            if (response.status === 200) {
              console.log("Records Saved")
            }
          })
          .then((response) => {
              console.log("DataBase Issue")
          }); 
    }

    return (
        <div style={{overflow: 'auto'}}>
            <ToastContainer />
            {delayed ? <div>{notify("Logging out")}<Redirect to='/landing'/></div>: null}
            <AddExpense open={expTog} onToggle={showAddExpense}/>
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: '2%', left:0, height: "100%" }}>
            <Row style={{marginTop: "4%"}}>
                <Col sm={2}>
                    <GroupSide LogOut={LogOut} groupname={redux_data.group_name} launchExpense={showAddExpense} changeGroup={changeGroup}/>
                </Col>
                <Col sm={7}>
                    <GroupBody name={redux_data.name} expense_list={redux_data.selected_group} exitGroup={exitGroup}/>
                </Col>
                <Col sm={{ span: 2, offset:0 }}>
                    <Row>
                        {show_req ? redux_data.group_req.map((req) => <MDBContainer>
                            <MDBCard><MDBCardBody>{req}
                                    <FaCheck onClick={() => groupApprove(req)} style={{color: 'green', cursor: 'pointer'}}/>
                                </MDBCardBody></MDBCard>
                            </MDBContainer>)
                        : null}
                        {show_req ? <MDBBtn onClick={showRequest} color="warning">Collapse</MDBBtn> :
                        <MDBBtn onClick={showRequest} color="warning">Show Group Request</MDBBtn>}
                    </Row>
                    <Row style={{marginTop: "2%"}}>
                    <ProfileImage pic ={redux_data.pic} onImageChange={onImageChange} group_id={redux_data.group_id}/>
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default GroupPage
