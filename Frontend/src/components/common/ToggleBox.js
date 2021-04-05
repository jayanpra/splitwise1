import {useState} from 'react'
import {InputGroup, FormControl} from 'react-bootstrap'
import { FaEdit, FaCheck, FaTimes} from "react-icons/fa";

const ToggleBox = ({heading, value,color,tick_color,cross_color, edit_color, onChange}) => {
    const [editmode, changeEdit] = useState(false)
    const [changeValue, onChangeValue] = useState('')
    const onEdit = () => {
        changeEdit(!editmode)
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
                <InputGroup className="mb-3" style={{width:"50%"}}>
                    <FormControl
                    placeholder={heading.toLowerCase()}
                    onChange={inputChange} />
                    <FaCheck style={{color: tick_color, cursor: 'pointer'}} onClick={() => onChangeX()}/>
                    <FaTimes style={{color: cross_color, cursor: 'pointer'}} onClick={() => onEdit()}/>
                </InputGroup>
                </div>:
                <div> 
                <h4 style={{color: color, textAlign:"left"}}>{value ? value : "N/A"}
                <FaEdit style={{color: edit_color, cursor: 'pointer'}} onClick={() => onEdit()}/>
                </h4>
                
                </div>
            }
            
        </div>
    )
}
ToggleBox.defaultProps = {
    color: "maroon",
    tick_color: "green",
    cross_color: "red",
    edit_color: "blue"

}
export default ToggleBox
