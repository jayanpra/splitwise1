import {useState} from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle,  MDBContainer, MDBBtn} from 'mdbreact';
import DashItems from '../common/DashItems';
import ToggleBox from '../common/ToggleBox';

const GroupBody = ({name, expense_list,onChange, exitGroup}) => {
    return (
        <div>
            <MDBContainer style={{width:"80%", height:"100%"}}>
                <MDBCard style={{backgroundColor: 'MediumSeaGreen'}}>
                <MDBCardBody style={{color:"white"}}>
                    <MDBCardTitle><ToggleBox heading="Your Group" value={name} onChange={onChange} color='white' edit_color='white' cross_color='white' tick_color='white'/></MDBCardTitle>
                    <MDBBtn style={{ backgroundColor: 'red'}} onClick={() => exitGroup(name)}> Exit group</MDBBtn>
                    </MDBCardBody>
                    </MDBCard>
            </MDBContainer>
            <div style={{overflow: 'auto', maxHeight:"780px"}}>
            {expense_list.map((expense)=> (
                <div ><DashItems group={name} body={expense}/></div>
            ))
            }
            </div>
        </div>
    )
}

export default GroupBody
