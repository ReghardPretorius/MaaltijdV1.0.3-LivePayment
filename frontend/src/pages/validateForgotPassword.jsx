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



function ValidateForgotPasswordPage() {
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

  const emailFromRedux = useSelector((state) => state.userInfo.email);
  //setEmail(emailFromRedux);

  useEffect(() => {
    setEmail(emailFromRedux);
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
      console.log('run verify');
      handleVerifyOTP(email, otp);
    }
  }, [otp]);

  const onChange = (value) => {
    setOTP(value);
  };


  async function sendOTP(email){
    try {
      const response = await fetch('http://localhost:5000/change/email/sendFPOTP', {
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
      const response = await fetch('http://localhost:5000/change/email/verifyFPOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      if (response.status === 200) {
        try {
          navigate('/forgotpassword/changepassword');
        } catch (err) {
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
      <h1>Forgot Password</h1>
    <div>
      <h2>Verify your email address</h2>
      <p>We've sent a verification code to {email}</p>

      <div className="container mb-4">

      <OtpInput value={otp} valueLength={4} onChange={onChange} />
    </div>

      
      {errorMessage && <p className="error">{errorMessage}</p>}

      <Row className="py-3">
        <Col>
        Did not receive any code?&nbsp; <Link onClick={handleResend}>Resend Code</Link>
        </Col>
      </Row>

      {message && <p className="error">{message}</p>}

    </div>

    </FormContainer>

  );
}

export default ValidateForgotPasswordPage;