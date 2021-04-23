import {useState} from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow,MDBCol, MDBContainer } from "mdbreact";
import {FaComment} from "react-icons/fa";
import CommentBox from './CommentBox';
import { useSelector, useDispatch } from "react-redux";
import { clear_reducer} from '../../reducer/CommentReducer'
import {get_comment, save_comment} from '../../actions/commentAction'

const DashItems = ({body, group}) => {
    const dispatch = useDispatch();
    const comment_data = useSelector(state => state.comment)
    const get_date = (e) => {
        const months= ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
        const temp = e.substring(0,10).split('-')
        return `${months[parseInt(temp[1])-1]} ${temp[2]}, ${temp[0]}`
    }
    const [comment_list, setComment] = useState([])
    const [expTog, setToggle] = useState(false)
    const toggle = async () => {
        console.log(expTog)
        if (expTog === false){
            //dispatch(clear_reducer())
            await dispatch(get_comment({token:localStorage.getItem('token'),expense_id: body.expense_id}))
            console.log(comment_data)
            setComment(comment_data.comment_list)
            //dispatch(clear_reducer())
        }
        
        setToggle(!expTog)
    }
    const add_comment = async (comment) => {
        //dispatch(clear_reducer())
        await dispatch(save_comment({token: localStorage.getItem('token'), expense_id: body.expense_id, text:comment }))
        if (comment_data.addComments){
            setComment([...comment_list, {text: comment, author: "you wrote"}])
        }
    }
    return (
        <MDBContainer style={{width:"80%"}}>
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
                            <MDBRow style={{textalign:'right'}}>
                                    <FaComment onClick={toggle} style={{color: 'darkgrey', cursor: 'pointer'}}/>
                            </MDBRow>
                        </MDBCardText>
                </MDBCardBody>
            </MDBCard>
            {expTog ? <CommentBox comments = {comment_data.comment_list[body.expense_id]} addComments={add_comment}/> : null}
        </MDBContainer>
    )
}

export default DashItems
