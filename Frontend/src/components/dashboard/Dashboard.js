import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
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
    const [fin_color, finColor] = useState('green')
    const assess_record = (ele, list) => {
        indSettle({...friends, ele: 0.0})
        for (let i in list) {
            if (list[i].color === "green"){
                addMoney(amt_plus + list[i].expense)
                indSettle({...friends, ele: (friends[ele] + list[i].expense)})
                getMoney([...lend_list, {color:"green", expense:list[i].expense, borrower: list[i].person, exp_name: list[i].ename}])
                finAcc(fin_balance + list[i].expense)
            }
            else{
                subMoney(amt_minus + list[i].expense)
                indSettle({...friends, ele: (friends[ele] - list[i].expense)})
                sendMoney([...borrow_list, {color:"red", expense:list[i].expense, lender: list[i].person, exp_name: list[i].ename}])
                finAcc(fin_balance - list[i].expense)
            }
            if (fin_balance > 0){
                finColor("green")
            }
            else{
                finColor("red")
            }
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
                        console.log(response.data.accounts)
                        let keys = Object.keys(response.data.accounts)
                        for (let i in keys){
                            console.log(keys[i], response.data.accounts[keys[i]])
                            assess_record(keys[i], response.data.accounts[keys[i]])
                        }
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
    })
    return (
        <div>
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
                            <MDBBtn style={{backgroundColor:"lightgreen", top:0, right:0}}>SettleUp</MDBBtn>
                            <MDBCardText>
                                <MDBRow>
                                    <MDBCol>
                                        <p>Total Balance</p>
                                        <p style={{color:fin_color}}>
                                            {localStorage.getItem("currency")} {fin_balance}
                                        </p>
                                    </MDBCol>
                                    <MDBCol>
                                        <p>You Owe</p>
                                        <p style={{color:"red"}}>
                                            {localStorage.getItem("currency")} {amt_minus}
                                        </p>
                                    </MDBCol>
                                    <MDBCol>
                                        <p>You Are Owed</p>
                                        <p style={{color:"green"}}>
                                            {localStorage.getItem("currency")} {amt_plus}
                                        </p>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer><br/>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        <MDBContainer style={{width:"450px", height:"80px", marginTop: "70px"}}>
                            <MDBCard style={{backgroundColor:"MediumSeaGreen"}}>
                            <MDBCardBody>
                                <MDBCardTitle style={{textalign:"left"}}>Your Asset List</MDBCardTitle>
                                </MDBCardBody>
                                </MDBCard>
                        </MDBContainer>
                    </MDBCol>
                    <MDBCol>
                        <MDBContainer style={{width:"450px", height:"80px", marginTop: "70px"}}>
                            <MDBCard style={{backgroundColor:"Tomato"}}>
                            <MDBCardBody>
                                <MDBCardTitle style={{textalign:"left"}}>Your Liablity List</MDBCardTitle>
                                </MDBCardBody>
                                </MDBCard>
                        </MDBContainer>
                    </MDBCol>
                </MDBRow>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Dashboard

