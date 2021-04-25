import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import RecentTab from '../common/RecentTab'
import Paginate from './Paginate'
import {Form} from 'react-bootstrap'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBContainer, MDBBtn } from 'mdbreact';
//import axios from 'axios';
import { Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import {clearError, get_data, reverseList} from '../../actions/recentAction';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Recent = () => {
    const [initial_pull, pullExit] = useState(true)
    const [delayed, noSession] = useState(false)
    const [btn, nameChange] = useState("Last Activity First")
    const [post, setPosts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [postPerPage, setPostPerPage] = useState(2)
    const [group, setGroup] = useState([])
    const dispatch = useDispatch()
    const notify = (message) => toast(message);
    const redux_data = useSelector(state => state.recent)
    const success = redux_data.success
    const error = redux_data.error
    const user_list = redux_data.user_list
    const feed = redux_data.feed

    useEffect(() => {
        if (success){
            console.log(user_list)
            setPosts(user_list)
            dispatch(clearError())
        }
        else if(error){
            notify(feed)
            dispatch(clearError())
        }
    }, [success, error, dispatch, feed, user_list, group])
    useEffect(() => {
        if(initial_pull)
        {
            const token = localStorage.getItem('token');
            if (token) {
                const serverData = { 'token': token };
                dispatch(get_data(serverData))
                pullExit(false)
            }
            else {
                noSession(true)
            }
        }
    },[initial_pull, dispatch])

    const changeSize = (e) => {
        setCurrentPage(1)
        setPostPerPage(parseInt(e.target.value))

    }

    const paginate = (number) => setCurrentPage(number)
    const changeOrder = () => {
        console.log("Change Started")
        dispatch(reverseList())
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

    for (let i in user_list){
        if (!group.includes(user_list[i].gname)) setGroup([...group, user_list[i].gname])
    }
    return (
        <div>
            {delayed ? <Redirect to='/landing'/>: <br/>}
            <ToastContainer />
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
                    <Row>
                    <MDBCardTitle style={{textalign:"left"}}>Recent Activity Page</MDBCardTitle>
                    </Row>
                    <Row>
                    <Col sm={{ span: 2, offset: 1 }}>
                    <Row>
                    <p style={{color: "white"}}>Sort As Per</p>
                    <MDBBtn id="toggler" style={{backgroundColor:"lightgreen"}} onClick={() => changeOrder()}>{btn}</MDBBtn>
                    </Row>
                    </Col>
                    <Col  sm={{ span: 2, offset: 2 }}>
                    <Row>
                    <p style={{color: "white"}}>Posts per Page</p>
                    <Form.Control  class="form-select" onChange={changeSize} as="select">
                        <option selected>{postPerPage}</option>
                            {[2,5,10].map((option) => (
                            <option>{option}</option>
                            ))
                        }
                    </Form.Control>
                    </Row>
                    
                    </Col>
                    <Col  sm={{ span: 2, offset: 2 }}>
                    <Row>
                    <p style={{color: "white"}}>Group filter</p>
                    <Form.Control class="form-select" as="select">
                        <option selected>{'all'}</option>
                            {group.map((option) => (
                            <option>{option}</option>
                            ))
                        }
                    </Form.Control>
                    </Row>
                    </Col>
                    </Row>
                    
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