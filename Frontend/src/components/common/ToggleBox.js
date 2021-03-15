import {useState} from 'react'
import {InputGroup, FormControl} from 'react-bootstrap'
import { FaEdit, FaCheck} from "react-icons/fa";

const ToggleBox = ({heading, value, onChange}) => {
    const [editmode, changeEdit] = useState(false)
    const [changeValue, onChangeValue] = useState('')
    const onEdit = () => {
        changeEdit(true)
    }
    const inputChange = (e) => {
        onChangeValue(e.target.value)
    }
    const onChangeX = () => {
        onChange({value:changeValue, type:heading.toLowerCase()})
        changeEdit(false)
    }
    return (
        <div>
            <h5 style={{ textAlign:"left"}}>{heading}</h5>
            {editmode ? <div>
                <InputGroup className="mb-3" >
                    <FormControl
                    placeholder={heading.toLowerCase()}
                    onChange={inputChange} />
                    <FaCheck style={{color: 'green', cursor: 'pointer'}} onClick={() => onChangeX()}/>
                </InputGroup>
                </div>:
                <div> 
                <h4 style={{color:"maroon", textAlign:"left"}}>{value ? value : "N/A"}
                <FaEdit style={{color: 'blue', cursor: 'pointer'}} onClick={() => onEdit()}/>
                </h4>
                
                </div>
            }
            
        </div>
    )
}

export default ToggleBox
