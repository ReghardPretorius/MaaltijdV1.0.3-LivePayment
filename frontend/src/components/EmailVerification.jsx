import React, { useState } from 'react';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
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

      // setMessage(data.message);
    } catch (error) {
      //console.error('Error:', error);
      setMessage('Error sending OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await fetch('http://localhost:5000/email/verifyOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      // setMessage(data.message);
    } catch (error) {
      //console.error('Error:', error);
      setMessage('Invalid OTP');
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleSendOTP}>Send OTP</button>
      <br />
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
      />
      <button onClick={handleVerifyOTP}>Verify OTP</button>
      <p>{message}</p>
    </div>
  );
};

export default EmailVerification;
