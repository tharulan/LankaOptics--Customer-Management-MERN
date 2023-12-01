import {useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile () {
    const { user }  = useSelector(state => state.authState);

    return (
        <div className="row justify-content-around mt-5 user-info">
            <div className="col-12 col-md-3">
                <figure className='avatar avatar-profile'>
                    <img className="rounded-circle img-fluid" src={user.avatar??'./images/default_avatar.png'} alt='' />
                </figure>
                <Link to="/myprofile/update" id="edit_profile" className="btn btn-primary btn-block my-5">
                    Edit Profile
                </Link>
            </div>
    
            <div className="col-12 col-md-5">
                <h4>Full Name</h4>
                <p>{user.name}</p>
    
                <h4>Email Address</h4>
                <p>{user.email}</p>

                <h4>Phone Number</h4>
                <p>{user.phoneNumber || "Not provided"}</p> {/* Display "Not provided" if phone number is not available */}

                <h4>Date of Birth</h4>
                <p>{user.dateOfBirth || "Not provided"}</p> {/* Display "Not provided" if date of birth is not available */}

                 <h4>Address</h4>
                <p>{user.address || "Not provided"}</p> {/* Display "Not provided" if address is not available */}

                <h4>Joined</h4>
                <p>{String(user.createdAt).substring(0, 10)}</p>



                <Link to="/myprofile/update/password" className="btn btn-primary btn-block mt-3">
                    Change Password
                </Link>
            </div>
        </div>
    )
}

