import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import DashEntry from '../common/DashEntry'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBBtn, MDBCardText, MDBCol, MDBRow, MDBContainer } from 'mdbreact';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const Dashboard = () => {
    const [borrow_list, sendMoney] = useState([])
    const [lend_list, getMoney] = useState([])
    const [initial_pull, pullExit] = useState(true)
    const [amt_plus, addMoney] = useState(0.0)
    const [amt_minus, subMoney] = useState(0.0)
    const [friends, indSettle] = useState({})
    const [fin_balance, finAcc] = useState(0.0)
    const [delayed, noSession] = useState(false)

    const assess_record = (ele, list) => {
        console.log("In Here")
        for (let i in list) {
            if (list[i].color === "green"){
                getMoney((state) => [...state, {color:"green", expense:list[i].expense, borrower: list[i].person, exp_name: list[i].ename}])

            }
            else{
                sendMoney((state) => [...state, {color:"red", expense:list[i].expense, lender: list[i].person, exp_name: list[i].ename}])
            }
        }
    }

    const settleUp = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const serverData = { 'token': token, settle: friends.settle };
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/profile/initialPull', serverData)
            .then((response) => {
                if (response.status === 200) {
                    pullExit(true)
                }
            })
            .then((response) => {
                noSession(true)
            }); 
        }
        else {
            noSession(true)
        }
    }

    useEffect(() => {
        if(initial_pull)
        {
            const token = localStorage.getItem('token');
            if (token) {
                const serverData = { 'token': token };
                axios.defaults.withCredentials = true;
                axios.post('http://localhost:3001/getDash', serverData)
                .then((response) => {
                    if (response.status === 200) {
                        pullExit(false)
                        let keys = Object.keys(response.data.accounts)
                        for (let i in keys){
                            assess_record(keys[i], response.data.accounts[keys[i]])
                        }
                        console.log(response.data.balance)
                        indSettle({...friends, settle:response.data.balance})
                        let keys2 = Object.keys(response.data.balance)
                        for (let j in keys2) {
                            if (response.data.balance[keys2[j]] > 0){
                                addMoney((balance) => balance + response.data.balance[keys2[j]])
                            }
                            else {
                                subMoney((balance) => balance + (response.data.balance[keys2[j]] * -1))
                            }
                            finAcc((balance) => balance + response.data.balance[keys2[j]])
                        }
                    }
                })
                .then((response) => {
                    console.log("err", response)
                }); 
            }
            else {
                noSession(true)
            }
        }
    })
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
                    <GroupSide />
                </Col>
                <Col sm={6}>
                <MDBRow>
                <MDBContainer style={{width:"1000px", height:"80px"}}>
                    <MDBCard style={{backgroundColor:"DodgerBlue"}}>
                        <MDBCardBody>
                            <MDBCardTitle style={{textalign:"left"}}>DashBoard</MDBCardTitle>
                            <MDBBtn onClick={settleUp} style={{backgroundColor:"lightgreen", top:0, right:0}}>SettleUp</MDBBtn>
                            <MDBCardText>
                                <MDBRow>
                                    <MDBCol>
                                        <p>Total Balance</p>
                                        {fin_balance >= 0 ? <p style={{color:"green"}}>
                                            {localStorage.getItem("currency")} {fin_balance}
                                        </p>:
                                        <p style={{color:"red"}}>
                                            {localStorage.getItem("currency")} {fin_balance.toFixed(2)}
                                        </p>
                                        }   
                                    </MDBCol>
                                    <MDBCol>
                                        <p>You Owe</p>
                                        <p style={{color:"red"}}>
                                            {localStorage.getItem("currency")} {amt_minus.toFixed(2)}
                                        </p>
                                    </MDBCol>
                                    <MDBCol>
                                        <p>You Are Owed</p>
                                        <p style={{color:"green"}}>
                                            {localStorage.getItem("currency")} {amt_plus.toFixed(2)}
                                        </p>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer><br/><br/>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        <MDBContainer style={{width:"450px", height:"60px", marginTop: "80px"}}>
                            <MDBCard style={{backgroundColor:"MediumSeaGreen"}}>
                            <MDBCardBody>
                                <MDBCardTitle style={{textalign:"left"}}>Your Asset List</MDBCardTitle>
                                </MDBCardBody>
                                </MDBCard>
                        </MDBContainer><br/>
                        {lend_list.map((lend)=> 
                            <div><DashEntry body= {lend}/><br/><br/></div>
                        )}
                    </MDBCol>
                    <MDBCol>
                        <MDBContainer style={{width:"450px",height:"60px", marginTop: "80px"}}>
                            <MDBCard style={{backgroundColor:"Tomato"}}>
                            <MDBCardBody>
                                <MDBCardTitle style={{textalign:"left"}}>Your Liablity List</MDBCardTitle>
                                </MDBCardBody>
                                </MDBCard>
                        </MDBContainer><br/>
                        {borrow_list.map((borrow)=> 
                            <div><DashEntry body= {borrow}/><br/><br/></div>
                        )}
                    </MDBCol>
                </MDBRow>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Dashboard

