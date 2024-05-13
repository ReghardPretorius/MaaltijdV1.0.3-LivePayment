import React, { useState } from 'react';
import { Container, Form as BootstrapForm, ProgressBar ,Checkbox, Modal, FormGroup, FormCheck  } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useFindEmailMutation } from "../slices/usersApiSlice";
import { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import {
  updateEmail,
  updateUserid,
} from "../slices/userInfoSlice";
//import axios from 'axios';

const EnterEmail = () => {
  const [email, setEmail] = useState('');
  const [userID, setUserID]  = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailDoesNotExist, setEmailDoesNotExist] = useState(false);
  const [isBlurEmail, setIsBlurEmail] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [findEmail, { isLoading }] = useFindEmailMutation();


  const handleEmailChange = (e) => {
    setEmailDoesNotExist(false);
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(newEmail);

    // Update isValidEmail state based on email format
    setIsValidEmail(isValid);
  };

  const handleEmailBlur = () => {
    setIsBlurEmail(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isValidEmail){
      // try {
      //   await axios.post('http://localhost:5000/forgot-password', { email });
      //   alert('Reset password link sent to your email.');
      // } catch (error) {
      //   console.error(error);
      //   alert('Failed to send reset password link.');
      // }

      // const response = await fetch('http://localhost:5000/email/verifyOTP', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, otp }),
      // });
      try{ 
      const res = await findEmail({ email }).unwrap();
      // console.log(res);
      // console.log('success');
      dispatch(updateUserid(res._id));
      dispatch(updateEmail(res.email));
      navigate("/validatefp");
      //dispatch(setCredentials(res));
      //toast.success('Profile updated successfully');
    }  catch (err) {
      //toast.error(err?.data?.message || err.error);
      // console.log(err);
      // console.log('failed');
      setEmailDoesNotExist(true);
      //setEmail('');
    };
      //dispatch(setCredentials({ ...res }));
    };

  };

  return (
    <FormContainer>
    <h1>Forgot Password</h1>
    <BootstrapForm onSubmit={handleSubmit}>
        <BootstrapForm.Group className="mt-2" controlId="emailForm">
          <BootstrapForm.Label>
          Email Address&nbsp;
            {isValidEmail && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidEmail && isBlurEmail && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="email"
            name="emailForm"
            className="form-control"
            placeholder="Enter Email Address"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            required
            style={{
              border: isValidEmail
                ? "1px solid #198754"
                : !isValidEmail && isBlurEmail
                ? "1px solid #ea868f"
                : "",
            }}
          />
        </BootstrapForm.Group>
        {!isValidEmail && isBlurEmail ? (
          <div className="error-message">Please enter a valid Email</div>
        ) : null}

      {emailDoesNotExist && isBlurEmail ? (
          <div className="error-message">The Email entered does not exist</div>
        ) : null}

<div className={"d-flex justify-content-end mt-3" } >

<Button class variant="primary" type="submit" disabled={!isValidEmail}>
      Submit
    </Button>
    </div>
    </BootstrapForm>


</FormContainer>
  );
};

export default EnterEmail;
