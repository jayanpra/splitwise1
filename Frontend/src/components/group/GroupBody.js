import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle,  MDBBtn,  MDBContainer } from 'mdbreact';
import DashItems from '../common/DashItems';

const GroupBody = ({name, expense_list}) => {
    console.log(expense_list)
    return (
        <div>
            <MDBContainer style={{width:"800px", height:"100px"}}>
                <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle style={{textalign:"left"}}> {name}</MDBCardTitle>
                        
                    </MDBCardBody>
                    </MDBCard>
            </MDBContainer>
            {expense_list.map((expense)=> (
                <DashItems group={name} body={expense}/>
            ))
            }
        </div>
    )
}

export default GroupBody
