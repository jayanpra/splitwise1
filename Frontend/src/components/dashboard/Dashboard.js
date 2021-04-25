import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import DashEntry from '../common/DashEntry'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBBtn, MDBCardText, MDBCol, MDBRow, MDBContainer } from 'mdbreact';
//import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {get_dash, settle_up} from '../../actions/dashAction';

const Dashboard = () => {
    const dispatch = useDispatch();
    const redux_data = useSelector(state => state.dash);
    const [delayed, noSession] = useState(false)

    const LogOut = () => {
        noSession(true)
    }

    const settleUp = () => {
        const token = localStorage.getItem('token');
        dispatch(settle_up())
        if (token) {
            const serverData = { 'token': token, settle: redux_data.friends.settle };
            dispatch(settle_up(serverData))
            // axios.defaults.withCredentials = true;
            // axios.post('http://54.190.4.247:3001/settleUp', serverData)
            // .then((response) => {
            //     if (response.status === 200) {
            //         window.location.reload(false)
            //     }
            // })
            // .then((response) => {
                
            // }); 
        }
        else {
            noSession(true)
        }
    }

    useEffect(() => {
        dispatch(get_dash({token: localStorage.getItem('token')}))
    },[])

    return (
        <div>
            {delayed ? <Redirect to='/landing'/>: null}
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: 0, left:0, height: "1000px" }}>
            <Row><MDBContainer>
                <p>.</p>
                <p className="ml-5 ml-lg-0">.</p>
            </MDBContainer></Row>
            <Row>
                <Col sm={3}>
                    <GroupSide LogOut={LogOut} />
                </Col>
                <Col sm={6}>
                <MDBRow>
                <MDBContainer style={{width:"100%", height:"10%"}}>
                    <MDBCard style={{backgroundColor:"seagreen"}}>
                        <MDBCardBody>
                            <MDBCardTitle style={{textalign:"left"}}>DashBoard</MDBCardTitle>
                            <MDBBtn onClick={settleUp} style={{backgroundColor:"slateblue", top:0, right:0}}>SettleUp</MDBBtn>
                            <MDBCardText>
                                <MDBRow>
                                    <MDBCol>
                                        <p>Total Balance</p>
                                        {(redux_data.amt_plus - redux_data.amt_minus) >= 0 ? <p style={{color:"white", backgroundColor:"Limegreen" }}>
                                            {localStorage.getItem("currency")} {(redux_data.amt_plus - redux_data.amt_minus).toFixed(2)}
                                        </p>:
                                        <p style={{color:"white", backgroundColor:"firebrick"}}>
                                            {localStorage.getItem("currency")} {(redux_data.amt_plus - redux_data.amt_minus).toFixed(2)}
                                        </p>
                                        }   
                                    </MDBCol>
                                    <MDBCol>
                                        <p>You Owe</p>
                                        <p style={{color:"white", backgroundColor:"firebrick" }}>
                                            {localStorage.getItem("currency")} {redux_data.amt_minus.toFixed(2)}
                                        </p>
                                    </MDBCol>
                                    <MDBCol>
                                        <p>You Are Owed</p>
                                        <p style={{color:"white", backgroundColor:"Limegreen" }}>
                                            {localStorage.getItem("currency")} {redux_data.amt_plus.toFixed(2)}
                                        </p>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        <MDBRow>
                        <MDBContainer style={{width:"100%", height:"2%", marginTop: "2%", overflow: "auto"}}>
                            <MDBCard style={{backgroundColor:"LimeGreen"}}>
                            <MDBCardBody>
                                <MDBCardTitle style={{textalign:"left"}}>Your Asset List</MDBCardTitle>
                                </MDBCardBody>
                                </MDBCard>
                        </MDBContainer>
                        </MDBRow>
                        <div style={{overflow: 'auto', maxHeight:"600px"}}>
                        {redux_data.lend_list.map((lend)=> 
                            <MDBRow><DashEntry body= {lend}/></MDBRow>
                        )}</div>
                    </MDBCol>
                    <MDBCol>
                        <MDBRow>
                        <MDBContainer style={{width:"100%",height:"2%", marginTop: "2%"}}>
                            <MDBCard style={{backgroundColor:"FireBrick"}}>
                            <MDBCardBody>
                                <MDBCardTitle style={{textalign:"left"}}>Your Liablity List</MDBCardTitle>
                                </MDBCardBody>
                                </MDBCard>
                        </MDBContainer>
                        </MDBRow>
                        <div style={{overflow: 'auto', maxHeight:"600px"}}>
                        {redux_data.borrow_list.map((borrow)=> 
                            <MDBRow><DashEntry body= {borrow}/></MDBRow>
                        )}</div>
                    </MDBCol>
                </MDBRow>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Dashboard

