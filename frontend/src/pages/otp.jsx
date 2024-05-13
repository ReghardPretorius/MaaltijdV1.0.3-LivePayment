// import React, { useRef, useEffect, useState } from 'react';

// const correctOTP = "123456" 

// function OtpInputWithValidation({ numberOfDigits }) {
//   const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
//   const [otpError, setOtpError] = useState(null);
//   const otpBoxReference = useRef([]);

//   function handleChange(value, index) {
//     let newArr = [...otp];
//     newArr[index] = value;
//     setOtp(newArr);

//     if(value && index < numberOfDigits-1){
//       otpBoxReference.current[index + 1].focus()
//     }
//   }

//   function handleBackspaceAndEnter(e, index) {
//     if(e.key === "Backspace" && !e.target.value && index > 0){
//       otpBoxReference.current[index - 1].focus()
//     }
//     if(e.key === "Enter" && e.target.value && index < numberOfDigits-1){
//       otpBoxReference.current[index + 1].focus()
//     }
//   }

//   useEffect(() => { 
//     if(otp.join("") !== "" && otp.join("") !== correctOTP){
//       setOtpError("❌ Wrong OTP Please Check Again")
//     }else{
//       setOtpError(null)
//     } 
//    }, [otp]);

//   return (
//     <article className="w-1/2">
//       <p className="text-2xl font-medium mt-12">OTP Input With Validation</p>
//       <p className="text-base mt-4  p-4 rounded-md">A special type of input box where as user types, it checks if the otp is correct else it shows an error message below with a shake animation.</p>
      
//       <p className="text-base mt-6 mb-4">One Time Password (OTP)</p>
     
//      <div className='flex items-center gap-4'>
//       {otp.map((digit, index)=>(
//         <input key={index} value={digit} maxLength={1}  
//         onChange={(e)=> handleChange(e.target.value, index)}
//         onKeyUp={(e)=> handleBackspaceAndEnter(e, index)}
//         ref={(reference) => (otpBoxReference.current[index] = reference)}
//         className={`border mr-3 w-5 h-auto p-3 rounded-md block  focus:border-2 focus:outline-none appearance-none`}
//         />
//       ))}

//      </div>


//       <p className={`text-lg mt-4 ${otpError ? 'error-show' : ''}`}>{otpError}</p>
//     </article>
//   );
// }

// export default OtpInputWithValidation;

import { useState, useEffect } from 'react';
import OtpInput from '../components/otpInput.jsx';
//import './App.css';



function OtpInputWithValidation() {
  const [otp, setOtp] = useState('');

  useEffect(() => {
    // console.log(otp); 
    if (otp.replace(/\s/g, '').length === 4) {
      // console.log('run verify');
      //handleVerifyOTP(email, otp);
    }
  }, [otp]);

  const onChange = (value) => {
    setOtp(value);
  };

  return (
    <div className="container">
      <h1>React TypeScript OTP Input</h1>
      <OtpInput value={otp} valueLength={4} onChange={onChange} />
    </div>
    
  );
}

export default OtpInputWithValidation;