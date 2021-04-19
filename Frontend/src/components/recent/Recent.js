import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import RecentTab from '../common/RecentTab'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBContainer, MDBBtn } from 'mdbreact';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Recent = () => {
    const [user_list, changeList] = useState([])
    const [initial_pull, pullExit] = useState(true)
    const [delayed, noSession] = useState(false)
    const [btn, nameChange] = useState("Last Activity First")
    useEffect(() => {
        if(initial_pull)
        {
            const token = localStorage.getItem('token');
            if (token) {
                const serverData = { 'token': token };
                axios.defaults.withCredentials = true;
                axios.post('http://localhost:3001/pullRecent', serverData)
                .then((response) => {
                    if (response.status === 200) {
                        pullExit(false)
                        changeList([...response.data.expense])
                    }
                })
                .then((response) => {
                    console.log("err: ", response)
                }); 
            }
            else {
                noSession(true)
            }
        }
    },[initial_pull])

    const changeOrder = () => {
        console.log("Change Started")
        changeList(user_list.reverse())
        if (btn === "Last Activity First") {
           nameChange("First Activity First")
        }
        else{
            nameChange("Last Activity First")
        }
    }
    return (
        <div>
            {delayed ? <Redirect to='/landing'/>: <br/>}
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: 0, left:0, height: "1000px" }}>
            <Row><MDBContainer>
                <p>.</p>
                <p className="ml-5 ml-lg-0">.</p>
            </MDBContainer></Row>
            <Row>
                <Col sm={3}>
                    <GroupSide />
                </Col>
                <Col sm={6}>
                <MDBContainer style={{width:"1000px", height:"80px"}}>
                <MDBCard style={{backgroundColor:"DodgerBlue"}}>
                <MDBCardBody>
                    <MDBCardTitle style={{textalign:"left"}}>Recent Activity Page</MDBCardTitle>
                    <MDBBtn id="toggler" style={{backgroundColor:"lightgreen"}} onClick={() => changeOrder()}>{btn}</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer><br/><br/>
                    {user_list.map((user) => 
                       <div><RecentTab body={user}/><br/><br/><br/></div>
                    )}
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Recent