import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import RecentTab from '../common/RecentTab'
import Paginate from './Paginate'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBContainer, MDBBtn } from 'mdbreact';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {get_data} from '../../actions/recentAction';

const Recent = () => {
    const [user_list, changeList] = useState([])
    const [initial_pull, pullExit] = useState(true)
    const [delayed, noSession] = useState(false)
    const [btn, nameChange] = useState("Last Activity First")
    const [post, setPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(2)
    const dispatch = useDispatch()
    const redux_data = useSelector(state => state.recent)
    useEffect(() => {
        if(initial_pull)
        {
            const token = localStorage.getItem('token');
            if (token) {
                const serverData = { 'token': token };
                dispatch(get_data(serverData))
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
    const paginate = (number) => setCurrentPage(number)
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
    let indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage
    if (indexOfLastPost > user_list.length){
        indexOfLastPost = user_list.length
    }
    const currentPosts = user_list.slice(indexOfFirstPost, indexOfLastPost)
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
                <Col sm={9}>
                <Row>
                <MDBContainer style={{width:"100%", height:"100%"}}>
                <MDBCard style={{backgroundColor:"Seagreen"}}>
                <MDBCardBody>
                    <MDBCardTitle style={{textalign:"left"}}>Recent Activity Page</MDBCardTitle>
                    <MDBBtn id="toggler" style={{backgroundColor:"lightgreen"}} onClick={() => changeOrder()}>{btn}</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer><br/><br/>
                </Row>
                <Row>
                <div style={{overflow: 'auto', maxHeight:"600px"}}>
                    {currentPosts.map((user) => 
                       <div><RecentTab body={user}/><br/><br/><br/></div>
                    )}
                    </div>
                    </Row>
                    <Row style={{textalign:"center"}}>
                    <Paginate postPerPage={postPerPage} totalPost={user_list.length} paginate={paginate}/>
                    </Row>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default Recent