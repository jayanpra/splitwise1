import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle,  MDBContainer, MDBBtn} from 'mdbreact';
import DashItems from '../common/DashItems';
import ToggleBox from '../common/ToggleBox'

const GroupBody = ({name, expense_list,onChange, exitGroup}) => {
    console.log(expense_list)
    return (
        <div>
            <MDBContainer style={{width:"800px", height:"100px"}}>
                <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle><ToggleBox heading="Your Group" value={name} onChange={onChange}/></MDBCardTitle>
                    <MDBBtn onClick={() => exitGroup(name)}> Exit group</MDBBtn>
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
