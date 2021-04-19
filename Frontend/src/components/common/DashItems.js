import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow,MDBCol, MDBContainer } from "mdbreact";
import {FaComment} from "react-icons/fa";
const DashItems = ({body, group}) => {
    const get_date = (e) => {
        const months= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const temp = e.substring(0,10).split('-')
        return `${months[parseInt(temp[1])-1]} ${temp[2]}, ${temp[0]}`
    }
    return (
        <MDBContainer style={{width:"80%", height:"100%"}}>
            <MDBCard style={{ background:'lightgrey'}}>
                <MDBCardBody>
                    <MDBCardTitle style={{textalign:"left"}}>{body.expense_name} ({group})</MDBCardTitle>
                        <MDBCardText>
                            <MDBRow className="mb-4">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h6>{get_date(body.date)}</h6>
                                            </td>
                                            <td>
                                                <h6>{body.payee} paid for {body.shares} person(s)</h6>
                                            </td>
                                            <td>
                                                <h6 style={{color:body.color}}>{localStorage.getItem("currency")} {body.amount}</h6>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol sm={{span: 5, offset: 4}}>
                                    <FaComment/>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardText>
                </MDBCardBody>
            </MDBCard>
        </MDBContainer>
    )
}

export default DashItems
