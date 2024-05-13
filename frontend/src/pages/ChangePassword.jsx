import React, { useState } from 'react';
import { Container, Form as BootstrapForm, Row, Col , Button, Modal, FormGroup, FormCheck  } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import InputGroup from "react-bootstrap/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useUpdatePasswordMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
//import axios from 'axios';

const ChangePassword = ({ match }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //const [passwordType, setPasswordType] = useState("password");
  const [isBlurPassword, setIsBlurPassword] = useState(false);
  const [isBlurConfirmPassword, setIsBlurConfirmPassword] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isEnabledSubmit, setIsEnabledSubmit] = useState(false);

  const email = useSelector((state) => state.userInfo.email);
  const _id = useSelector((state) => state.userInfo.userid);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();
  //const token = match.params.token;

  const handlePasswordChange = (e) => {
    let newPassword = e.target.value;
    setPassword(newPassword);


    // Check if password meets the criteria
    const isLengthValid = newPassword.length >= 8;
    const hasDigit = /\d/.test(newPassword);
    const hasNonDigit = /\D/.test(newPassword);

    // Update isValid state based on criteria
    setIsValidPassword(isLengthValid && hasDigit && hasNonDigit);

    if (isBlurConfirmPassword) {
      let cp = confirmPassword;
      if (newPassword !== cp) {
        setIsValidConfirmPassword(false);
      }
      else if (newPassword === cp) {
        setIsValidConfirmPassword(true);
      }
    } 

    if (isValidPassword && isValidConfirmPassword){
      setIsEnabledSubmit(true);
    } else {
      setIsEnabledSubmit(false);
    }

  };

  const handlePasswordBlur = () => {
    setIsBlurPassword(true);
  };

  const handleConfirmPasswordChange = (e) => {
    let newCofirmPassword = e.target.value;
    setConfirmPassword(newCofirmPassword);
    //let equal = false;

    // Check if password meets the criteria
    const isLengthValid = newCofirmPassword.length >= 8;
    const hasDigit = /\d/.test(newCofirmPassword);
    const hasNonDigit = /\D/.test(newCofirmPassword);
    // if (password === confirmPassword){
    //   equal = true;
    // }

    const equal = newCofirmPassword === password;

    // Update isValid state based on criteria
    setIsValidConfirmPassword(
      isLengthValid && hasDigit && hasNonDigit && equal
    );
    
    if (isValidPassword && isValidConfirmPassword){
      setIsEnabledSubmit(true);
    } else {
      setIsEnabledSubmit  (false);
    }

  };

  const handleConfirmPasswordBlur = () => {
    setIsBlurConfirmPassword(true);
  };


  const handleSubmit = async (e) => {
    if (isValidPassword && isValidConfirmPassword){
      e.preventDefault();
      // console.log(_id);
      // console.log(email);
      // console.log(password);
      try {
        const res = await updatePassword({ _id, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        console.log('Error')
        //toast.error(err?.data?.message || err.error);
      }
    } else {
      if (!isValidPassword) {
        setIsBlurPassword(true);
      }
      if (!isValidConfirmPassword) {
        setIsBlurConfirmPassword(true);
      }
    }


  };

  return (
<div>
<FormContainer>
<h1>Forgot Password</h1>


      <BootstrapForm onSubmit={handleSubmit}>

<p class="password-policy" aria-live="polite">
<span className="strong">Password requirements:</span>
<ul>
<li>At least 8 characters long</li>
<li>At least one number</li>
<li>At least one non-numeric character (e.g., letter, symbol)</li>
</ul>
</p>


          <BootstrapForm.Label className='mt-2'>
            Password&nbsp;
            {isValidPassword && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidPassword && isBlurPassword && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <InputGroup>
          <BootstrapForm.Control
            type={passwordVisible ? 'text' : 'password'}
            name="passwordForm"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={handlePasswordBlur}
            required
            style={{
              border: isValidPassword
                ? "1px solid #198754"
                : !isValidPassword && isBlurPassword
                ? "1px solid #ea868f"
                : "",
            }}
          />
              <Button variant="outline-secondary" id="button-addon2" onClick={() => setPasswordVisible(!passwordVisible)}>
                <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`} />
            </Button>
            </InputGroup>
        {!isValidPassword && isBlurPassword ? (
          <div className="error-message">Please enter a valid Password</div>
        ) : null}

<BootstrapForm.Label className='mt-2'>
            Confirm Password&nbsp;
            {isValidConfirmPassword && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidConfirmPassword && isBlurConfirmPassword && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <InputGroup >
          <BootstrapForm.Control
            type={confirmPasswordVisible ? 'text' : 'password'}
            name="confirmPasswordForm"
            className="form-control"
            placeholder="Enter Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            onBlur={handleConfirmPasswordBlur}
            required
            style={{
              border: isValidConfirmPassword
                ? "1px solid #198754"
                : !isValidConfirmPassword && isBlurConfirmPassword
                ? "1px solid #ea868f"
                : "",
            }}
          />
              <Button variant="outline-secondary" id="button-addon3" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <i className={`bi bi-eye${confirmPasswordVisible ? '-slash' : ''}`} />
            </Button>
            </InputGroup>
        {!isValidConfirmPassword && isBlurConfirmPassword ? (
          <div className="error-message">Please enter a valid Confirm Password</div>
        ) : null}


<div>{isEnabledSubmit ? (
  <div>True</div>
): (<div>False</div>)}</div>
<div className={"d-flex justify-content-end mt-3" } >

<Button class variant="primary" type="submit" >
      Submit
    </Button>
    </div>

    </BootstrapForm>

</FormContainer>

</div>
  );
};

export default ChangePassword;
