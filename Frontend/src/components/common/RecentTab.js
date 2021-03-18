import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBContainer } from "mdbreact";
const RecentTab = ({body}) => {
    const get_date = (e) => {
        const months= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const temp = e.substring(0,10).split('-')
        return `${months[parseInt(temp[1])-1]} ${temp[2]}, ${temp[0]}`
    }
    return (
        <MDBContainer style={{width:"1000px", height:"80px"}}>
            <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle style={{textalign:"left"}}>{body.uname} Added "{body.ename}" in "{body.gname}" for {body.share} persons</MDBCardTitle>
                        <MDBCardText>
                            <MDBRow className="mb-4">
                                <MDBCol sm="4">
                                    <h6>{get_date(body.date)}</h6>
                                </MDBCol>
                                <MDBCol sm="6">
                                    {body.color==='green' ? <h6 style={{color:body.color}}>You get back {localStorage.getItem("currency")} {body.amount - (body.amount/body.share)}</h6> :
                                    <h6 style={{color:body.color}}>You owe {localStorage.getItem("currency")} {(body.amount/body.share)}</h6>}
                                </MDBCol>
                            </MDBRow>
                        </MDBCardText>
                        </MDBCardBody>
                    </MDBCard>
        </MDBContainer>

    )
}

export default RecentTab;