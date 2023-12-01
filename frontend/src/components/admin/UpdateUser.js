import { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getUser, updateUser } from "../../actions/userActions";
import { clearError, clearUserUpdated } from "../../slices/userSlice";
import { toast } from "react-toastify";

export default function UpdateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // New field
  const [dateOfBirth, setDateOfBirth] = useState(""); // New field
  const [address, setAddress] = useState(""); // New field

  const { id: userId } = useParams();

  const { loading, isUserUpdated, error, user } = useSelector(state => state.userState);
  const { user: authUser } = useSelector(state => state.authState);

  const dispatch = useDispatch();
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [dobError, setDobError] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    formData.append('phoneNumber', phoneNumber);
    formData.append('dateOfBirth', dateOfBirth);
    formData.append('address', address);
    dispatch(updateUser(userId, formData));
  }

  useEffect(() => {
    if (isUserUpdated) {
      toast('User Updated Successfully!', {
        type: 'success',
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearUserUpdated())
      });
      return;
    }

    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      });
      return;
    }

    dispatch(getUser(userId))
  }, [isUserUpdated, error, dispatch]);

  useEffect(() => {
    if (user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPhoneNumber(user.phoneNumber || "");
      setDateOfBirth(user.dateOfBirth || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!email) {
      setEmailError('Email is required');
    } else if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      setPhoneNumberError('Phone number must be 10 digits');
    } else {
      setPhoneNumberError('');
    }
  };

  const validateDateOfBirth = (dateOfBirth) => {
    if (!dateOfBirth) {
      setDobError('Date of Birth is required');
    } else {
      const dob = new Date(dateOfBirth);
      const eighteenYearsAgo = new Date();
      eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
      if (dob > eighteenYearsAgo) {
        setDobError('Age must be over 18');
      } else {
        setDobError('');
      }
    }
  };

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <Fragment>
          <div className="wrapper my-5">
            <form onSubmit={submitHandler} className="shadow-lg" encType='multipart/form-data'>
              <h1 className="mb-4">Update User</h1>

              <div className="form-group">
                <label htmlFor="name_field">Name</label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  onChange={e => setName(e.target.value)}
                  value={name}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price_field">Email</label>
                <input
                  type="text"
                  id="price_field"
                  className={`form-control ${emailError ? 'is-invalid' : ''}`}
                  onChange={e => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  value={email}
                />
                {emailError && <div className="invalid-feedback">{emailError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="category_field">Role</label>
                <select
                  disabled={user._id === authUser._id}
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="form-control"
                  id="category_field"
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone_number_field">Phone Number</label>
                <input
                  type="text"
                  id="phone_number_field"
                  className={`form-control ${phoneNumberError ? 'is-invalid' : ''}`}
                  onChange={e => {
                    setPhoneNumber(e.target.value);
                    validatePhoneNumber(e.target.value);
                  }}
                  value={phoneNumber}
                />
                {phoneNumberError && <div className="invalid-feedback">{phoneNumberError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="date_of_birth_field">Date of Birth</label>
                <input
                  type="date"
                  id="date_of_birth_field"
                  className={`form-control ${dobError ? 'is-invalid' : ''}`}
                  onChange={e => {
                    setDateOfBirth(e.target.value);
                    validateDateOfBirth(e.target.value);
                  }}
                  value={dateOfBirth}
                />
                {dobError && <div className="invalid-feedback">{dobError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="address_field">Address</label>
                <input
                  type="text"
                  id="address_field"
                  className="form-control"
                  onChange={e => setAddress(e.target.value)}
                  value={address}
                />
              </div>

              <button
                id="login_button"
                type="submit"
                disabled={loading}
                className="btn btn-block py-3"
              >
                UPDATE
              </button>

            </form>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
