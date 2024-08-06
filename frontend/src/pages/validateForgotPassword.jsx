import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { useRegisterAddressMutation } from "../slices/usersApiSlice";
import {
  updateEmail
} from "../slices/userInfoSlice";
import {  Form as BootstrapForm, Row, Col  } from "react-bootstrap";
import "../styles/validateEmail.css";
import OtpInput from '../components/otpInput.jsx';
import FormContainer from "../components/FormContainer";
import {   useSendFPOTPMutation, useVerifyFPOTPMutation } from '../slices/otpAPIslice';



function ValidateForgotPasswordPage() {
  const [email, setEmail] = useState('');
  //const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResendButtonEnabled, setIsResendButtonEnabled] = useState(false);
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('')

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [sendFPOTPMutate, { isLoadingSendOTP }] = useSendFPOTPMutation();
  const [verifyFPOTPMutate, { isLoadingVerifySendOTP }] = useVerifyFPOTPMutation();


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

    if (otp.replace(/\s/g, '').length === 4) {

      handleVerifyOTP(email, otp);
    }
  }, [otp]);

  const onChange = (value) => {
    setOTP(value);
  };


  async function sendOTP(email){
    try {
      const response = await sendFPOTPMutate({email}).unwrap();

      setMessage(response.message);
    } catch (error) {
      //console.error('Error:', error);
      setMessage('Error sending OTP');
    }
  };


  const handleVerifyOTP = async (email, otp ) => {
    try {
      const response = await verifyFPOTPMutate({ email, otp }).unwrap();
      if (response.message === 'Email verified successfully') {
        try {
          navigate('/forgotpassword/changepassword');
        } catch (err) {
          setMessage('❌ Wrong OTP Please Check Again');
        }
      }

      setMessage(response.message);
    } catch (error) {
  };

      //console.error('Error:', error);
      setMessage('❌ Wrong OTP Please Check Again');
    }

    
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