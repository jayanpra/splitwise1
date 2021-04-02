import React from 'react'
import { MDBCard, MDBCardBody, MDBCardText, MDBContainer } from "mdbreact";
const DashEntry = ({body}) => {
    return (
        <MDBContainer style={{width:"98%"}}>
            <MDBCard>
                <MDBCardBody>
                    {body.color === "red" ? <MDBCardText style={{color:body.color}}>You Pay {localStorage.getItem("currency")}{body.expense} to {body.lender} for {body.exp_name}</MDBCardText> : 
                    <MDBCardText style={{color:body.color}}>You get {localStorage.getItem("currency")}{body.expense} from {body.borrower} for {body.exp_name}</MDBCardText>}
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}

export default DashEntry
