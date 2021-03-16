import React from 'react'
import {Container, Row, Col} from 'react-bootstrap'
import ExpenseBar from '../common/ExpenseBar'

const GroupBody = ({group_name, expenses}) => {
    return (
        <div>
            <Container style={{ backgroundColor: 'lightgreen', position: "fixed"}}>
                <ExpenseBar date='March 12' name='grocery' payee='Jayant' amount="USD 50"/>
            </Container>
        </div>
    )
}

export default GroupBody
