import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBContainer } from "mdbreact";
const DashItems = ({body, group}) => {
    const get_date = (e) => {
        const months= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const temp = e.substring(0,10).split('-')
        return `${months[parseInt(temp[1])-1]} ${temp[2]}, ${temp[0]}`
    }
    return (
        <MDBContainer style={{width:"800px", height:"100px"}}>
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle style={{textalign:"left"}}>{body.expense_name} ({group})</MDBCardTitle>
                        <MDBCardText>
                            <MDBRow className="mb-4">
                                <MDBCol sm="4">
                                    <h6>{get_date(body.date)}</h6>
                                </MDBCol>
                                <MDBCol sm="6">
                                    <h6>{body.payee} paid for {body.shares} person</h6>
                                </MDBCol>
                                <MDBCol sm="2">
                                    <h6 style={{color:body.color}}>{localStorage.getItem("currency")} {body.amount}</h6>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
                
        </MDBContainer>

    )
}

export default DashItems
