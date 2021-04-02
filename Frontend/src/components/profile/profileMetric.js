import {useState, useEffect} from 'react'
import {Form} from 'react-bootstrap'
import {FaCheck} from "react-icons/fa";

const ProfileMetric = ({head, options, para, onChange}) => {
    const [diff,onDiff] = useState(null)
    const changeElement = (e) => {
        onDiff(e.target.value)
    }
    const commit = () => {
        onChange({value:diff, type:head.toLowerCase()})
        onDiff(null);
    };
    useEffect(() => {
        
        options.splice(options.indexOf(para),1)
    },[options, para])

    return (
        <div>
             <Form.Control onChange={changeElement} as="select">
                <option selected>{para}</option>
                {options.map((option) => (
                    <option>{option}</option>
                    ))
                }
            </Form.Control>
            {diff ? <FaCheck onClick={commit} style={{color: 'green', cursor: 'pointer'}}/> : null}
        </div>
    )
}

export default ProfileMetric
