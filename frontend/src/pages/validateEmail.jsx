import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useRegisterAddressMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import { setAddress } from "../slices/authSlice";
import {
  updateEmail,
  updateEmailIsVerified,
} from "../slices/userInfoSlice";
import { Container, Form as BootstrapForm, Row, Col , Button, Modal, FormGroup, FormCheck  } from "react-bootstrap";
import "../styles/validateEmail.css";
import OtpInput from '../components/otpInput.jsx';
import FormContainer from "../components/FormContainer";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { updateUserid } from '../slices/autocompleteSlice.js';



function EmailValidationPage() {
  const [newEmail, setNewEmail] = useState('');
  const [email, setEmail] = useState('');
  //const [code, setCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendButtonEnabled, setIsResendButtonEnabled] = useState(false);
  const [isValidOTP, setIsValidOTP] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');
  const [user_ID, setUserID]= useState('');


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const [registerAddress, { isLoadingAddress }] = useRegisterAddressMutation();


  const { userInfo } = useSelector((state) => state.auth);
  const name = useSelector((state) => state.userInfo.name);
  const surname = useSelector((state) => state.userInfo.surname);
  const cellNumber = useSelector((state) => state.userInfo.cellNumber);
  const password = useSelector((state) => state.userInfo.password);
  const emailIsVerified = useSelector((state) => state.userInfo.emailIsVerified);
  const numberIsVerified = useSelector((state) => state.userInfo.numberIsVerified);
  const terms = useSelector((state) => state.userInfo.terms);
  const marketing = useSelector((state) => state.userInfo.marketing);

  const addressName = useSelector((state) => state.userAutocomplete.addressName);
  const lat = useSelector((state) => state.userAutocomplete.lat);
  const long = useSelector((state) => state.userAutocomplete.long);
  const town = useSelector((state) => state.userAutocomplete.town);
  const suburb = useSelector((state) => state.userAutocomplete.suburb);
  const street = useSelector((state) => state.userAutocomplete.street);
  const streetNumber = useSelector((state) => state.userAutocomplete.streetNumber);
  const postalCode = useSelector((state) => state.userAutocomplete.postalCode);
  const unit = useSelector((state) => state.userAutocomplete.unit);
  const building = useSelector((state) => state.userAutocomplete.building);
  const optionalAddressInfo = useSelector((state) => state.userAutocomplete.optionalAddressInfo);
  const formattedAddress = useSelector((state) => state.userAutocomplete.formattedAddress);

  const emailFromRedux = useSelector((state) => state.userInfo.email);
  //setEmail(emailFromRedux);

  useEffect(() => {
    setEmail(emailFromRedux);
    setNewEmail(emailFromRedux);
  }, [emailFromRedux]);

  useEffect(() => {
    if (email) {
      dispatch(updateEmail(email));
      sendOTP(email);
    }
  }, [email]);

  useEffect(() => {
    // console.log(otp); 
    if (otp.replace(/\s/g, '').length === 4) {
      // console.log('run verify');
      handleVerifyOTP(email, otp);
    }
  }, [otp]);

  const onChange = (value) => {
    setOTP(value);
  };




  //const [hasRunFunction, setHasRunFunction] = useState(false);

  //setEmail(useSelector((state) => state.userInfo.email));
  //console.log("from where email comes from redux");
  //console.log(emailFromRedux);
  
 // useEffect(() => {
    //if (!hasRunFunction && emailFromRedux) {
  //  sendOTP(email);
      // Call your function with the email once
      //const myFunction = (emailFromRedux) => {
        // Do something with the email
       // console.log('Email:', emailFromRedux);
      //myFunction(emailFromRedux);
      //setHasRunFunction(true);
    
    // if (userInfo) {
    //   navigate('/');
    // }
    // setEmail(emailFromRedux);
    // console.log("from where useeffect");
    // console.log(emailFromRedux);
    //sendOTP(emailFromRedux);
  //}, [navigate, userInfo, emailFromRedux]);
//}, []);
//}, [email]);

  async function sendOTP(email){
    try {
      const response = await fetch('http://localhost:5000/email/sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      //const data = JSON.parse(data1);
      console.log(data.message);
      setMessage(data.message);
    } catch (error) {
      //console.error('Error:', error);
      setMessage('Error sending OTP');
    }
  };


  const handleVerifyOTP = async (email, otp ) => {
    try {
      const response = await fetch('http://localhost:5000/email/verifyOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      // if(response.status === 200){
      //   updateEmailIsVerified("1");
      //   console.log(emailIsVerified);
      //         try {const res = await register({ name, surname, email, cellNumber, password, emailIsVerified, numberIsVerified, terms }).unwrap();
      //         dispatch(setCredentials({ ...res }));
      //         navigate('/');
      //       } catch (err) {
      //         //toast.error(err?.data?.message || err.error);
      //         setMessage('❌ Wrong OTP Please Check Again');
      //       }

      // }
      
      if (response.status === 200) {
        try {
          await updateEmailIsVerified("1");
          // console.log(emailIsVerified); 
      
          const res = await register({ name, surname, email, cellNumber, password, emailIsVerified, numberIsVerified, terms, addressName, lat, long, town, suburb, street, streetNumber, postalCode, unit, building, optionalAddressInfo, formattedAddress, marketing }).unwrap();
          dispatch(setCredentials({ ...res }));
          // const userI = res._id;
          // setUserID(userI);
          // const resAddress = await registerAddress({ userID, addressName, lat, long, town, suburb, street, streetNumber, postalCode }).unwrap();
          // dispatch(setAddress({ ...resAddress }));

          navigate('/');
        } catch (err) {
          //toast.error(err?.data?.message || err.error);
          setMessage('❌ Wrong OTP Please Check Again');
        }
      }
      
      const data = await response.json();
      console.log(data.message);
      setMessage(data.message);
    } catch (error) {
      //console.error('Error:', error);
      setMessage('❌ Wrong OTP Please Check Again');
    }
  };

  const handleValidation = async () => {
    // Simulate validation logic with a placeholder for your actual implementation
    // const isValidCode = await validateCode(code);

    // if (isValidCode) {
    //   // Navigate to the main page
    //   window.location.href = '/main';
    // } else {
    //   setErrorMessage('Invalid code');
    //   setCode('');
    //   setIsResendButtonEnabled(true);
    // }
  };

  const handleSubmit = () => {

  }

  const handleCloseModal  = () => {
    setShowModal(false);
  };

  const handleChangeEmail = () => {
    setShowModal(true);
  };

  const handleModalSubmit =() => {
    
    if (!isValidEmail) {
      setIsValidEmail(false);
    } else
    if (isValidEmail){
      if (email !== newEmail){
        setEmail(newEmail);
        setShowModal(false);
        setOTP('');
      }
      if (email === newEmail){
        setShowModal(false);
      }
    }
    

  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setNewEmail(newEmail);
    setIsTouchedEmail(true);

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(newEmail);

    // Update isValidEmail state based on email format
    setIsValidEmail(isValid);
  };


  const handleResend = () => {
    if (email) {
      sendOTP(email);
      setOTP('');
    }
    // Your resend logic here
    setErrorMessage('');
    setIsResendButtonEnabled(false);
  };

  return (

        <FormContainer>
      <h1>Register</h1>

      {/* <Row className="py-3">
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row> */}
    <div>
      <h2>Verify your email address</h2>
      <p>We've sent a verification code to {email}</p>

      <div className="container mb-4">
      {/* <h1>React TypeScript OTP Input</h1> */}
      <OtpInput value={otp} valueLength={4} onChange={onChange} />
    </div>
      {/* <input
        type="text"
        maxLength={4}
        value={otp}
        onChange={handleCodeChange}
      /> */}
      
      {errorMessage && <p className="error">{errorMessage}</p>}
      {/* <button onClick={handleVerifyOTP} disabled={otp.length !== 4}>
        Verify
      </button> */}
                  {/* <BootstrapForm.Label className="mr-2">By selecting "I Accept" you agree to the&nbsp;</BootstrapForm.Label> */}
              
              {/* <a href="#" onClick={handleResend} disabled={!isResendButtonEnabled}>
              Resend Code
              </a> */}
              {/* <BootstrapForm.Label className="mr-2">&nbsp;and the&nbsp;</BootstrapForm.Label>
              <a href="#" onClick={handleShowPP}>
                Privacy Policy
              </a> */}
      {/* <button onClick={handleChangeEmail}>Change Email Address</button> */}
      {/* <button onClick={handleResend}>
        Resend Code
      </button> */}
            <Row className="py-3">
        <Col>
        Incorrect email address?&nbsp; <Link onClick={handleChangeEmail}>Change Email Address</Link>
        </Col>
      </Row>
      <Row className="py-3">
        <Col>
        Did not receive any code?&nbsp; <Link onClick={handleResend}>Resend Code</Link>
        </Col>
      </Row>
                        {/* <BootstrapForm.Label className="mr-2 mb-4">Incorrect email address?&nbsp;</BootstrapForm.Label>
              <a href="#" onClick={handleChangeEmail}>
                Change Email Address
              </a> */}
{/* 
                  <BootstrapForm.Label className="mr-2">Did not receive any code?&nbsp;</BootstrapForm.Label>
              <a href="#" onClick={handleResend}>
                Resend Code
              </a> */}

      {message && <p className="error">{message}</p>}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Email Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="privacy-policy">
        <h3>Change Email Address</h3>

  {/* <input
            type="email"
            value={email}
            onChange={(e) => setNewEmail(e.target.value)}
          /> */}

<BootstrapForm.Group className="mt-2" controlId="emailForm">
          <BootstrapForm.Label>
            {isValidEmail && isTouchedEmail && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidEmail && isTouchedEmail && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="email"
            name="emailForm"
            className="form-control"
            placeholder="Enter Email Address"
            value={newEmail}
            onChange={handleEmailChange}
           // onBlur={handleEmailBlur}
            required
            style={{
              border: isValidEmail && isTouchedEmail
                ? "1px solid #198754"
                : !isValidEmail && isTouchedEmail
                ? "1px solid #ea868f"
                : "",
            }}
          />
        </BootstrapForm.Group>
        {!isValidEmail  && isTouchedEmail ? (
          <div className="error-message">Please enter a valid Email</div>
        ) : null}

{/* <button onClick={() => handleModalSubmit(email)}>Save</button> */}
          {/* <button onClick={() => setShowModal(false)}>Cancel</button> */}

</div>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleModalSubmit}>
            Save
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* {showModal && (
        <div className="modal">
          <h3>Change Email Address</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={() => handleModalSubmit(email)}>Save</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )} */}
    </div>

    </FormContainer>

  );
}

export default EmailValidationPage;