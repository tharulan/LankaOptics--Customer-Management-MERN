import {useEffect, useState} from 'react';
import {useDispatch, useSelector } from 'react-redux'
import { register, clearAuthError } from '../../actions/userActions'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",     // Add phone number field
        dateOfBirth: "",     // Add date of birth field
        address: "",         // Add address field
      });

    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.authState)

    const onChange = (e) => {
        if(e.target.name === 'avatar') {
           const reader = new FileReader();
           reader.onload = () => {
                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0])
                }
           }


           reader.readAsDataURL(e.target.files[0])
        }else{
            setUserData({...userData, [e.target.name]:e.target.value })
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('avatar', avatar);
        formData.append('phoneNumber', userData.phoneNumber);  // Add phone number field
        formData.append('dateOfBirth', userData.dateOfBirth);  // Add date of birth field
        formData.append('address', userData.address); 
        dispatch(register(formData))
    }

    useEffect(()=>{
        if(isAuthenticated) {
            navigate('/');
            return
        }
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearAuthError) }
            })
            return
        }
    },[error, isAuthenticated, dispatch, navigate])

    return (
        <div className="row wrapper">
          <div className="col-10 col-lg-5">
            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
              <h1 className="mb-3">Register</h1>
      
              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input name='name' onChange={onChange} type="text" id="name_field" className="form-control" />
              </div>
      
              <div className="form-group">
                <label htmlFor="email_field">Email</label>
                <input
                  type="email"
                  id="email_field"
                  name='email' 
                  onChange={onChange}
                  className="form-control"
                />
              </div>
      
              <div className="form-group">
                <label htmlFor="password_field">Password</label>
                <input
                  name='password' 
                  onChange={onChange}
                  type="password"
                  id="password_field"
                  className="form-control"
                />
              </div>
      
              <div className="form-group">
                <label htmlFor="phone_number_field">Phone Number</label>
                <input
                  name='phoneNumber' 
                  onChange={onChange}
                  type="text"
                  id="phone_number_field"
                  className="form-control"
                />
              </div>
              
      
              <div className="form-group">
                <label htmlFor="date_of_birth_field">Date of Birth</label>
                <input
                  name='dateOfBirth' 
                  onChange={onChange}
                  type="date"
                  id="date_of_birth_field"
                  className="form-control"
                />
              </div>
      
              <div className="form-group">
                <label htmlFor="address_field">Address</label>
                <input
                  name='address' 
                  onChange={onChange}
                  type="text"
                  id="address_field"
                  className="form-control"
                />
              </div>
      
              <div className='form-group'>
                <label htmlFor='avatar_upload'>Avatar</label>
                <div className='d-flex align-items-center'>
                  <div>
                    <figure className='avatar mr-3 item-rtl'>
                      <img
                        src={avatarPreview}
                        className='rounded-circle'
                        alt='Avatar'
                      />
                    </figure>
                  </div>
                  <div className='custom-file'>
                    <input
                      type='file'
                      name='avatar'
                      onChange={onChange}
                      className='custom-file-input'
                      id='customFile'
                    />
                    <label className='custom-file-label' htmlFor='customFile'>
                      Choose Avatar
                    </label>
                  </div>
                </div>
              </div>
      
              <button
                id="register_button"
                type="submit"
                className="btn btn-block py-3"
                disabled={loading}
              >
                REGISTER
              </button>
            </form>
          </div>
        </div>
      );      
}