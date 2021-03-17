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

const GroupPage = () => {
    const [data, setData] = useState({
        name: null,
        groups: [],
        group_name:[],
        selected_group: [],
        currency: null,
      });

    const [expTog, setToggle] = useState(false)
    const [group_req, getReq] = useState([])
    const [show_req, toggleShow] = useState(false)

    useEffect(() => {
        if (data.name === null) {
          const token = localStorage.getItem('token');
          if (token) {
            const serverData = { 'token': token };
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/groupFill', serverData)
              .then((response) => {
                if (response.status === 200) {
                    let group_data = []
                    for (let i in response.data.group){
                        group_data.push(response.data.group[i].name)
                    }
                    setData({
                      name: group_data[0],
                      groups: [...response.data.group],
                      selected_group: [...response.data.expense],
                      group_name: [...group_data],
                    });
                }
                console.log(data);
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

    const showAddExpense = () => {
        setToggle(!expTog)
    }

    const showRequest = () => {
        for(let i in data.groups){
            if (data.groups[i].active === 'inactive'){
                getReq([...group_req, data.groups[i].name])
            }
        }
        toggleShow(!show_req)
    }

    const groupApprove = (name) => {
        let gid, id;
        for(let i in data.groups){
            if (data.groups[i].name === name){
                gid = data.groups[i].id
                id=i
            }
        }
        console.log(data.groups)
        console.log("name is ", name)
        const serverData = { token: localStorage.getItem('token'), group_id: gid };
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/altergroup', serverData)
            .then((response) => {
                if (response.status === 200) {
                    data.groups[id].active = "active"
                }
                toggleShow(false)
              })
            .then((response) => {
            }); 
    }

    const changeGroup = (gname) => {
        let gid;
        for(let i in data.groups){
            if (data.groups[i].name === gname){
                gid = data.groups[i].id
            }
        }
        console.log("gname ", gname, gid)
        const serverData = { token: localStorage.getItem('token'), group_id: gid };
        axios.post('http://localhost:3001/groupChange', serverData)
            .then((response) => {
                if (response.status === 200) {
                    setData({
                        ...data,
                        name: gname,
                        selected_group: [...response.data.expense]
                    })
                }
              })
            .then((response) => {
            }
        ); 
    }

    return (
        <div>
            <AddExpense open={expTog} onToggle={showAddExpense}/>
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: 0, left:0, height: "1000px" }}>
            <Row><MDBContainer>
                <p>.</p>
                <p className="ml-5 ml-lg-0">.</p>
            </MDBContainer></Row>
            <Row>
                <Col sm={2}>
                    <GroupSide groupname={data.group_name} launchExpense={showAddExpense} changeGroup={changeGroup}/>
                </Col>
                <Col sm={7}>
                    <GroupBody name={data.name} expense_list={data.selected_group}/>
                </Col>
                <Col sm={3}>
                    <Row>
                        {show_req ? group_req.map((req) => <MDBContainer>
                            <MDBCard><MDBCardBody>{req}
                                    <FaCheck onClick={() => groupApprove(req)} style={{color: 'green', cursor: 'pointer'}}/>
                                </MDBCardBody></MDBCard>
                            </MDBContainer>)
                        : null}
                        {show_req ? <MDBBtn onClick={showRequest} color="warning">Collapse</MDBBtn> :
                        <MDBBtn onClick={showRequest} color="warning">Show Group Request</MDBBtn>}
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default GroupPage
