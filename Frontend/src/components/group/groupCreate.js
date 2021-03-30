import {useState,useEffect} from 'react'
import useAutocomplete from 'use-autocomplete' 
import ProfileImage from "../profile/profileImage"
import {Row,Col, Button}  from 'react-bootstrap'
import Navigator from '../landing/Navigator'
import GroupSide from '../common/GroupSide'
import { MDBInput,MDBTypography } from "mdbreact";
import { BsFillPersonPlusFill } from "react-icons/bs";
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import {Hint}  from 'react-autocomplete-hint'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupCreate = () => {
    const [groupMem, changeMember] = useState({members: [], group_member_no: [1], refresh: false})
    const [suggestion, suggest] = useState([])
    const [init, over] = useState(true)
    const [textState, setTextState] = useState({})
    const [delayed, noSession] = useState(false)
    const [group,gReturn] = useState(false)
    const notify = (message) => toast(message);


    const addField = (e) => {
        console.log("Collections :", suggestion)
        groupMem.group_member_no.push(groupMem.group_member_no.length + 1)
        changeMember({
            ...groupMem,
            refresh: !groupMem.refresh
        })
    }
    const LogOut = () => {
        noSession(true)
    }

    useEffect (() => {
        if (init) {
            const token = {token: localStorage.getItem('token')}
            if (!token){
                noSession(true)
            }
            axios.post('http://localhost:3001/groupSuggest', { headers: {"token": `${token}`} } )
            .then((response) => {
                console.log(response.data)
                console.log("Sucessful")
                if (response.status === 200) {
                    suggest([...response.data.list])
                    over(false)
                }
                else {
                    console.log(response)
                    over(false)
                }
            })
            .then((response) => {
            }); 
        }
    }, [init])

    const onSubmit = () => {
        let data = {
            token: localStorage.getItem('token'),
            group_name: document.getElementById('gpname').value,
            group_members: []
        }
        for (let i in groupMem.group_member_no) {
            data.group_members.push(document.getElementById(groupMem.group_member_no[i]).value)
        }
        axios.post('http://localhost:3001/groupCreate', data)
          .then((response) => {
            console.log("Sucessful")
            if (response.status === 200) {
                gReturn(true)
            }
            else if (response.status === 203) {
                notify("The token has expired")
            }
            else {
                console.log(response)
            }
          })
          .then((response) => {
          }); 
    }

    return (
        <div>
            {group ? <Redirect to='/group'/>: null}
            {delayed ? <Redirect to='/landing'/>: null}
            <ToastContainer />
            <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}> 
                <Col sm={2}>
                <GroupSide LogOut={LogOut}/>
                </Col>
                <Col sm={1}></Col>
                <Col sm={4}>
                    <ProfileImage /><br/>
                    <Button onClick={onSubmit}>Create Group</Button>
                </Col>
                <Col sm={4}>
                <div className="form-group">
                    <MDBTypography tag='h5' variant="h5" style={{textAlign:'left'}}>What About Your Group ?</MDBTypography>
                    <MDBInput id="gpname" label="Your Group Name" size="lg"/><br/>
                    <MDBTypography tag='h5' variant="h5" style={{textAlign:'left'}}>Your Group Members ?</MDBTypography>
                    {
                        groupMem.group_member_no.map((option) => (
                            <Row>
                                <Col sm={{ span: 5, offset: 3 }} >
                                <Hint options={suggestion} allowTabFill>
                                <input style={{ width: '300px' }} value={textState[option]} id={option} onChange={e => setTextState({...textState, option : e.target.value})}/>
                                </Hint>
                                </Col>
                            <br/><br/>
                            </Row>
                        ))
                    }
                    <BsFillPersonPlusFill style={{textAlign:'left'}} onClick={addField}/>
                </div>
                </Col>
            </Row>
        </div>
    )
}

export default GroupCreate
