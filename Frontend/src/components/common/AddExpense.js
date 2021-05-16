import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import {useEffect} from 'react';
import {Form} from 'react-bootstrap'
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import {get_group, clearError} from '../../actions/groupAction'

const AddExpense = ({open, onToggle, notify}) => {
  const reduxData = useSelector(state => state.group)
  const dispatch = useDispatch()
  useEffect(() => {
    const token = localStorage.getItem('token');
        if (token) {
            const serverData = { 'token': token };
            dispatch(get_group(serverData))
        }
  }, [dispatch])
    const onSubmit = () => {
        const expense = document.getElementById("exp").value;
        const number = /^\d+(\.\d+)$/
        if (!number.test(expense)){
            notify("Expense has to digits/decimal")
            return
        }
        const exp = parseFloat(expense)
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
                <h4>With You and Group:</h4>
                <Form.Control class="form-select" as="select">
                <option id = "group_name" selected>{reduxData.name}</option>
                {reduxData.group_name.map((option) => (
                    <option>{option}</option>
                    ))
                }
            </Form.Control>
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
