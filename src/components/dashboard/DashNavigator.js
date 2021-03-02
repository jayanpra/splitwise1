import React from 'react'
import {ListGroup, Container} from 'react-bootstrap'
import DashItems from '../common/DashItems'

const DashNavigator = () => {
    return (
        <div>
            <Container fluid style={{height: '1000px' }}>
            <ListGroup style={{marginTop: "20px"}} variant="flush">
                <ListGroup.Item><DashItems body="Splitwise"/></ListGroup.Item>
                <ListGroup.Item></ListGroup.Item>
                <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
            </ListGroup>
            </Container>
        </div>
    )
}

export default DashNavigator
