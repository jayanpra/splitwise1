import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle,  MDBContainer, MDBBtn} from 'mdbreact';
import DashItems from '../common/DashItems';
import ToggleBox from '../common/ToggleBox'

const GroupBody = ({name, expense_list,onChange, exitGroup}) => {
    console.log(expense_list)
    return (
        <div>
            <MDBContainer style={{width:"800px", height:"60px"}}>
                <MDBCard>
                <MDBCardBody>
                    <MDBCardTitle><ToggleBox heading="Your Group" value={name} onChange={onChange}/></MDBCardTitle>
                    <MDBBtn style={{ backgroundColor: 'red'}} onClick={() => exitGroup(name)}> Exit group</MDBBtn>
                    </MDBCardBody>
                    </MDBCard>
            </MDBContainer><br/><br/><br/><br/>
            {expense_list.map((expense)=> (
                <div><DashItems group={name} body={expense}/><br/></div>
            ))
            }
        </div>
    )
}

export default GroupBody
