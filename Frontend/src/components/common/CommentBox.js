
import {MDBContainer, MDBRow } from "mdbreact";
import {InputGroup, FormControl} from 'react-bootstrap'
import { FaCheck} from "react-icons/fa";
import ScrollArea from 'react-scrollbar';

const CommentBox = ({comments, addComments}) => {
    const color = ['Gainsboro','aliceblue']
    const get_color = (number) => {
        if (number%2 === 0){
            return color[0]
        }
        else{
            return color[1]
        }
    }
    const prepare = () => {

        const comment = document.getElementById('input').value
        console.log(comment)
        addComments(comment)
    }
    return (
        <MDBContainer style={{ background:'FloralWhite', marginTop:"0.25%"}}>
            <br/>
            <ScrollArea
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            ><div>
            {comments.map((comment) =>
            <MDBRow style={{ background: get_color(comments.indexOf(comment)), textAlign: "left", }}><p style={{marginLeft: "3%", width: "95%"}}><b>{comment.author}: </b>{comment.text}</p><br/>
            </MDBRow>
            )}
            </div>
            </ScrollArea>
            <MDBRow style={{marginTop: '0.15%'}}>
            <InputGroup style={{width:"100%"}}>
                <FormControl
                    placeholder= "add your comment here"
                    id='input' />
                    <FaCheck style={{color: 'green', cursor: 'pointer'}} onClick={prepare}/>
            </InputGroup>
            </MDBRow>
            <br/>
        </MDBContainer>
    )
}

export default CommentBox
