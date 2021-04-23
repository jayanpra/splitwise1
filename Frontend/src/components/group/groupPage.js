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
import { setGroup, setSelectedGroup, setImage, removeGroup,approveGroup } from '../../reducer/GroupReducer';


const GroupPage = () => {
    const dispatch = useDispatch()
    const redux_data = useSelector(state => state.group)
    const [data, setData] = useState({
        name: null,
        groups: [],
        group_name:[],
        selected_group: [],
        currency: null,
        pic: null,
      });

    const [expTog, setToggle] = useState(false)
    const [group_req, getReq] = useState([])
    const [show_req, toggleShow] = useState(false)
    const [delayed, noSession] = useState(false)
    const notify = (message) => toast(message);

    const LogOut = () => {
        noSession(true)
    }

    useEffect(() => {
        if (redux_data.name === null) {
          const token = localStorage.getItem('token');
          if (token) {
            const serverData = { 'token': token };
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/groupFill', serverData)
              .then((response) => {
                if (response.status === 200) {
                    console.log(response.data)
                    let group_data = []
                    for (let i in response.data.group){
                        group_data.push(response.data.group[i].name)
                    }
                    dispatch(setGroup({name:group_data[0], groups:response.data.group, selected_group: response.data.expense, group_name:group_data, pic: "http://localhost:3001/" + response.data.pics}))
                    setData({
                      name: group_data[0],
                      groups: [...response.data.group],
                      selected_group: [...response.data.expense],
                      group_name: [...group_data],
                      pic: "http://localhost:3001/" + response.data.pics
                    });
                }
                else {
                    console.log(response)
                }
              })
              .then((response) => {
                console.log(response)
              }); 
          }
          else {
            noSession(true)
          }
        }
    },[redux_data]);

    const showAddExpense = () => {
        setToggle(!expTog)
    }

    const showRequest = () => {
        // for(let i in redux_data.groups){
        //     if (redux_data.groups[i].active === 'passive'){
        //         getReq([...group_req, redux_data.groups[i].name])
        //     }
        // }
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
        const serverData = { token: localStorage.getItem('token'), group_id: gid };
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/altergroup', serverData)
            .then((response) => {
                if (response.status === 200) {
                    dispatch(approveGroup(id))
                }
                toggleShow(false)
              })
            .then((response) => {
                
            }); 
    }

    const changeGroup = (gname) => {
        let gid;
        for(let i in redux_data.groups){
            if (redux_data.groups[i].name === gname){
                gid = redux_data.groups[i].id
            }
        }
        console.log("gname ", gname, gid)
        const serverData = { token: localStorage.getItem('token'), group_id: gid };
        axios.post('http://localhost:3001/groupChange', serverData)
            .then((response) => {
                if (response.status === 200) {
                    dispatch(setSelectedGroup({name: gname, selected_group: response.data.expense}))
                    setData({
                        ...data,
                        name: gname,
                        selected_group: [...response.data.expense]
                    })
                }
              })
            .then((response) => {
            }); 
    }

    const exitGroup = (gname) => {
        let gid;
        for(let i in redux_data.groups){
            if (redux_data.groups[i].name === gname){
                gid = redux_data.groups[i].id
            }
        }
        const serverData = { token: localStorage.getItem('token'), group_id: gid };
        axios.post('http://localhost:3001/groupExit', serverData)
            .then((response) => {
                if (response.status === 200) {
                    if (response.data.message === "Group Not Settled"){
                        notify("In a hurry to leave this group settle up first")
                    }
                    else if (response.data.message === "Group Settled"){
                        dispatch(removeGroup(gname))
                        changeGroup(redux_data.group_names[0])
                        setData({...data, name:null})
                    }
                }
              })
            .then((response) => {
            }); 
    }


    const onImageChange = (event) => {
        if (redux_data.name === null){
            notify("no group selected")
            return
        }
        let gid, id;
        for(let i in redux_data.groups){
            if (redux_data.groups[i].name === redux_data.name){
                gid = redux_data.groups[i].id
                id=i
            }
        }
        const formData = new FormData();
        console.log(event.target.files[0]);
        formData.append('profileImage',event.target.files[0],event.target.files[0].name + ',' + gid);
        const config = {
          headers: { 
            'content-type': 'multipart/form-data'
          }
        }
        for (var value of formData.values()) {
            console.log(value);
        }
        axios.post('http://localhost:3001/imagegroupupdate',formData,config )
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
                    <ProfileImage pic ={redux_data.pic} onImageChange={onImageChange} />
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default GroupPage
