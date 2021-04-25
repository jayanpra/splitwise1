import React from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddExpense = ({open, onToggle}) => {
    const onSubmit = () => {
        const exp = parseFloat(document.getElementById("exp").value)
        const data = {
            token: localStorage.getItem("token"),
            group_name: document.getElementById('group_name').value,
            expense_name: document.getElementById('exp_name').value,
            expense: exp,
        }
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/expenseAdd', data)
            .then((response) => {
                if (response.status === 200) {
                  onToggle()
                }
                else {

                }
              })
            .then((response) => {
            }); 
    }
    return (
        <MDBModal isOpen={open} toggle={onToggle}>
            <MDBModalHeader toggle={onToggle}>Add an Expense</MDBModalHeader>
            <MDBModalBody>
                <h4>With You and Group:</h4><MDBInput id="group_name" label="Group Name"/>
                <br/><br/>
                <MDBInput id="exp_name" label="Expense Name"/>
                <h4>{localStorage.getItem('currency')}</h4><MDBInput id="exp" label="You Paid"/>
            </MDBModalBody>
            <MDBModalFooter>
          <MDBBtn color="secondary" onClick={onToggle}>Cancel</MDBBtn>
          <MDBBtn color="primary" onClick={onSubmit}>Add</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    )
}

export default AddExpense
