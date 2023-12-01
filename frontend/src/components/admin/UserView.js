import { Fragment, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector} from 'react-redux';
import { useParams } from "react-router-dom";
import { getUser } from "../../actions/userActions";
import { clearError} from "../../slices/userSlice";
import { toast } from "react-toastify";
import MetaData from "../layouts/MetaData";
import {useReactToPrint} from "react-to-print"

export default function UserView () {

    const componentPDF=useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [phoneNumber, setPhoneNumber] = useState(""); // New field
    const [dateOfBirth, setDateOfBirth] = useState(""); // New field
    const [address, setAddress] = useState(""); // New field

    const { id:userId } = useParams();
    
    const {  error, user } = useSelector(state => state.userState);
 

    const dispatch = useDispatch();

    useEffect(() => {
       
     if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }

        dispatch(getUser(userId))
    }, [error, dispatch])

    useEffect(() => {
        if(user._id) {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
            setPhoneNumber(user.phoneNumber);
            setDateOfBirth(user.dateOfBirth); 
            setAddress(user.address); 
        }
    }, [user])


    const generatePDF= useReactToPrint({
        content: ()=> componentPDF.current,
        documentTitle: "Userdata",
    });

    return (
  
        <Fragment>
            <MetaData title={"User Detail"}/>
         
  <div className="user-box" ref={componentPDF} style={{width:'100%'}}>
    
    <div className="user-info">
    <h1 className="mb-4">User Detail</h1>
    <figure className='avatar avatar-view'>
    <img
        className="rounded-circle" 
        src={user.avatar ?? './images/default_avatar.png'} 
        alt='not provide'
        style={{ width: '100px', height: '100px' }}
    />
    </figure>
    <br></br>
    <br></br>
    <br></br>

      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
      <p><strong>Date of Birth:</strong> {user.dateOfBirth}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Role:</strong> {user.role}</p>
    </div>
    
  </div>
  
  <div class="download-button-container">
  <button onClick={generatePDF} class="download-button">Download</button>
</div>
        
</Fragment>

    )
}
