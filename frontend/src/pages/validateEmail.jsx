import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useRegisterAddressMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import {
  updateEmail,
  updateEmailIsVerified,
} from "../slices/userInfoSlice";
import { Form as BootstrapForm, Row, Col , Button, Modal  } from "react-bootstrap";
import "../styles/validateEmail.css";
import OtpInput from '../components/otpInput.jsx';
import FormContainer from "../components/FormContainer";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useSendOTPMutation , useVerifyOTPMutation } from '../slices/otpAPIslice';



function EmailValidationPage() {
  const [newEmail, setNewEmail] = useState('');
  const [email, setEmail] = useState('');
  //const [code, setCode] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendButtonEnabled, setIsResendButtonEnabled] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isTouchedEmail, setIsTouchedEmail] = useState(false);
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const [sendOTPMutate, { isLoadingSendOTP }] = useSendOTPMutation();
  const [verifyOTPMutate, { isLoadingVerifySendOTP }] = useVerifyOTPMutation();


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


  async function sendOTP(email){
    try {
      const response = await sendOTPMutate({email}).unwrap();
      setMessage(response.message);
    } catch (error) {
      setMessage('Error sending OTP');
    }
  };


  const handleVerifyOTP = async (email, otp ) => {
    try {

      const response = await verifyOTPMutate({ email, otp }).unwrap();

      if (response.status === 200) {
        try {
          await updateEmailIsVerified("1"); 
      
          const res = await register({ name, surname, email, cellNumber, password, emailIsVerified, numberIsVerified, terms, addressName, lat, long, town, suburb, street, streetNumber, postalCode, unit, building, optionalAddressInfo, formattedAddress, marketing }).unwrap();
          dispatch(setCredentials({ ...res }));

          navigate('/');
        } catch (err) {
          setMessage('❌ Wrong OTP Please Check Again');
        }
      }
      
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      //console.error('Error:', error);
      setMessage('❌ Wrong OTP Please Check Again');
    }
  };


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

    <div>
      <h2>Verify your email address</h2>
      <p>We've sent a verification code to {email}</p>

      <div className="container mb-4">
      {/* <h1>React TypeScript OTP Input</h1> */}
      <OtpInput value={otp} valueLength={4} onChange={onChange} />
    </div>
      
      {errorMessage && <p className="error">{errorMessage}</p>}

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

      {message && <p className="error">{message}</p>}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Email Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="privacy-policy">
        <h3>Change Email Address</h3>


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

    </div>

    </FormContainer>

  );
}

export default EmailValidationPage;