import React from 'react'
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

const ExpenseBar = ({date, name, payee, amount}) => {
    return (
        <MDBContainer>
          <MDBRow>
            <MDBCol>{date}</MDBCol>
            <MDBCol>{name}</MDBCol>
            <MDBCol>
                <MDBRow>
                    {payee}
                </MDBRow>
                <MDBRow>
                    {amount}
                </MDBRow>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
    )
}

export default ExpenseBar
