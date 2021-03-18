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

const GroupCreate = () => {
    const [groupMem, changeMember] = useState({members: [], group_member_no: [1], refresh: false})
    const [suggestion, suggest] = useState([])
    const [init, over] = useState(true)
    const [textState, setTextState] = useState('')
    const [delayed, noSession] = useState(false)

    let [completions] = useAutocomplete(textState, suggestion);
    const addField = (e) => {
        groupMem.group_member_no.push(groupMem.group_member_no.length + 1)
        changeMember({
            ...groupMem,
            refresh: !groupMem.refresh
        })
    }

    useEffect (() => {
        if (init) {
            const token = {token: localStorage.getItem('token')}
            if (!token){
                noSession(true)
            }
            axios.get('http://localhost:3001/groupSuggest', { headers: {"token": `${token}`} } )
            .then((response) => {
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
                return <Redirect to='/landing'/>
            }); 
        }
    })

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

              return <Redirect to='/group'/>
            }
            else {
                console.log(response)
            }
          })
          .then((response) => {
            return <Redirect to='/landing'/>
          }); 
    }

    return (
        <div>
            {delayed ? <Redirect to='/landing'/>: null}
            <Navigator loggedin={true}/>
            <Row style={{marginTop:"100px"}}> 
                <Col sm={2}>
                <GroupSide/>
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
                            <Row><MDBInput label="Name/Email" size="sm" icon="user" id={option} onChange={(e) => setTextState(e.target.value)}/>
                            <div>
                                {completions.map((val, index) => (
                                <p key={index}>{val}</p>
                                            ))}
                            </div>  
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
