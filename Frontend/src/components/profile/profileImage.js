import {Card, Form, Button} from 'react-bootstrap'
import logo from '../landing/splitwise_logo.png'
import { useState} from 'react';

const ProfileImage = ({pic, onImageChange, group_id}) => {
    const [image,changeImage] = useState(null)
    const [commitFlag, changeCommit] = useState(false)
    const [newImage, changeNew] = useState(false)
    const ImageTake = (event) => {
        const formData = new FormData();
        console.log(event.target.files[0]);
        let iden = null
        if (group_id){
             iden = group_id
        }
        else {
            iden = localStorage.getItem('token')
        }
        formData.append('profileImage',event.target.files[0],event.target.files[0].name + ',' + iden);
        changeImage({obj: formData, image: URL.createObjectURL(event.target.files[0])})
        console.log(formData)
        changeNew(true)
        changeCommit(true)
    }

    const ImageSave = () => {
        console.log(image)
        changeCommit(false)
        onImageChange(image.obj)
    }
    return (
        <div>
            <Card style={{ width: '18rem' }}>
                {newImage ? <Card.Img variant="top" src={image.image} style={{borderRadius: "50%"}}/> : 
                <div>{pic ? <Card.Img variant="top" src={pic} style={{borderRadius: "50%"}}/> : <Card.Img variant="top" style={{borderRadius: "50%"}} src={logo}/>}</div>}
                
                <Card.Body>
                    <Card.Title>Hi </Card.Title>
                    <Card.Text>Create your own avatar</Card.Text>
                    <Form>
                        <Form.File 
                            id="custom-file"
                            label="Add"
                            custom
                            onChange={ImageTake}/>
                        </Form>
                        {commitFlag ? <Button className="btn btn-success" onClick={() =>ImageSave()} type="button">Save Image
                        </Button> : null}
                        
                </Card.Body>
            </Card>
            
        </div>
    )
}

ProfileImage.defaultProps = {
    group_id: null,
}

export default ProfileImage
