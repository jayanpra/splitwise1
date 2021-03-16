import {useEffect, useState} from 'react';
import {Container, Col, Row} from 'react-bootstrap';
import Navigator from '../landing/Navigator'; 
import GroupSide from '../common/GroupSide'
import { MDBContainer } from 'mdbreact';
import GroupBody from './GroupBody';
import axios from 'axios';

import { Redirect } from 'react-router-dom';

const GroupPage = () => {
    const [data, setData] = useState({
        name: null,
        groups: [],
        group_name:[],
        selected_group: [],
        currency: null,
      });

    const [expTog, setToggle] = useState(false)

    useEffect(() => {
        if (data.name === null) {
          const token = localStorage.getItem('token');
          if (token) {
            const serverData = { 'token': token };
            axios.defaults.withCredentials = true;
            axios.post('http://localhost:3001/groupFill', serverData)
              .then((response) => {
                if (response.status === 200) {
                    setData(
                    {
                      name: "random",
                      groups: response.data.group,
                      selected_group: response.data.expense
                    },
                  );
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
    });

    return (
        <div>
            <Navigator loggedin={true}/>
            <Container fluid style={{ backgroundColor: 'lightblue', position: "fixed", top: 0, left:0, height: "1000px" }}>
            <Row><MDBContainer>
                <p>.</p>
                <p className="ml-5 ml-lg-0">.</p>
            </MDBContainer></Row>
            <Row>
                <Col sm={2}>
                    <GroupSide />
                </Col>
                <Col sm={7}>
                    <GroupBody/>
                </Col>
                <Col sm={3}>
                </Col>
            </Row>
            </Container>
        </div>
    )
}

export default GroupPage
