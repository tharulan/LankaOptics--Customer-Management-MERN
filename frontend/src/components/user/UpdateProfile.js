import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify";
import { updateProfile, clearAuthError } from "../../actions/userActions";
import { clearUpdateProfile } from "../../slices/authSlice";

export default function UpdateProfile() {
    const { error, user, isUpdated } = useSelector((state) => state.authState);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [address, setAddress] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.png");
    const dispatch = useDispatch();
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');

    const onChangeAvatar = (e) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    };

    const validateEmail = (email) => {
      // Regular expression to check for a valid email address format
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

    const submitHandler = (e) => {
      e.preventDefault();

      // Validate email and phone number before submitting
      validateEmail(email);
      validatePhoneNumber(phoneNumber);

      if (!emailError && !phoneNumberError) {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phoneNumber", phoneNumber);
        formData.append("dateOfBirth", dateOfBirth);
        formData.append("address", address);
        formData.append("avatar", avatar);
        dispatch(updateProfile(formData));
      }
    };

    useEffect(() => {
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber || "");
        setDateOfBirth(user.dateOfBirth || "");
        setAddress(user.address || "");
        if (user.avatar) {
          setAvatarPreview(user.avatar);
        }
      }

      if (isUpdated) {
        toast("Profile updated successfully", {
          type: "success",
          position: toast.POSITION.BOTTOM_CENTER,
          onOpen: () => dispatch(clearUpdateProfile()),
        });
        return;
      }

      if (error) {
        toast(error, {
          position: toast.POSITION.BOTTOM_CENTER,
          type: "error",
          onOpen: () => {
            dispatch(clearAuthError);
          },
        });
        return;
      }
    }, [user, isUpdated, error, dispatch]);

    return (
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
            <h1 className="mt-2 mb-5">Update Profile</h1>

            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className={`form-control ${emailError ? 'is-invalid' : ''}`}
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
              />
              {emailError && <div className="invalid-feedback">{emailError}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="phone_number_field">Phone Number</label>
              <input
                type="text"
                id="phone_number_field"
                className={`form-control ${phoneNumberError ? 'is-invalid' : ''}`}
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validatePhoneNumber(e.target.value);
                }}
              />
              {phoneNumberError && <div className="invalid-feedback">{phoneNumberError}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="date_of_birth_field">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth_field"
                className="form-control"
                name="dateOfBirth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img src={avatarPreview} className="rounded-circle" alt="Avatar Preview" />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    onChange={onChangeAvatar}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
              Update
            </button>
          </form>
        </div>
      </div>
    );
  }
