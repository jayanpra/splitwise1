import React from 'react'
import { MDBCard, MDBCardBody, MDBCardText, MDBContainer } from "mdbreact";
const DashEntry = ({body}) => {
    let exp;
    if (body.color === 'red' && body.exp_name === 'Settle Up Amount'){
        exp = `You got ${localStorage.getItem("currency")} ${body.expense} to ${body.lender} for ${body.exp_name}`
    }
    else if (body.color === 'green' && body.exp_name === 'Settle Up Amount'){
        exp = `You have paid ${localStorage.getItem("currency")} ${body.expense} to ${body.borrower} for ${body.exp_name}`
    }
    else if (body.color === 'red' && body.exp_name !== 'Settle Up Amount'){
        exp = `You pay ${localStorage.getItem("currency")} ${body.expense} to ${body.lender} for ${body.exp_name}`
    }
    else{
        exp = `You get ${localStorage.getItem("currency")} ${body.expense} to ${body.borrower} for ${body.exp_name}`
    }
    return (
        <MDBContainer style={{width:"98%"}}>
            <MDBCard>
                <MDBCardBody>
                    {body.color === "red" ? <MDBCardText style={{color:body.color}}>{exp}</MDBCardText> : 
                    <MDBCardText style={{color:body.color}}>{exp}</MDBCardText>}
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}

export default DashEntry
