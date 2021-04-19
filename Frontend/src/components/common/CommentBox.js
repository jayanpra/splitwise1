import React from 'react'
import { MDBCard, MDBCardBody, MDBCardText, MDBContainer, MDBRow } from "mdbreact";
import {ScrollArea} from 'react-scrollbar';

const CommentBox = ({comments, addComments}) => {
    return (
        <MDBContainer>
            {comments.map((comment) =>
            <MDBRow></MDBRow>}
        </MDBContainer>
    )
}

export default CommentBox
