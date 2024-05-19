import transporter from '../config/nodemailerConfig.js';

const otpMap = {};

const sendFPOTP = async (req, res) => {
  const { email } = req.body;
  const OTP = Math.floor(1000 + Math.random() * 9000);

  otpMap[email] = OTP;

  const mailOptions = {
    from: 'no-reply@maaltijd.co.za',
    to: email,
    subject: 'Maaltijd Forgot Password OTP',
    text: `Your one-time PIN to change you password is: ${OTP}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    //res.status(200).send('OTP sent successfully');
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    //console.error(error);
    //res.status(500).send('Error sending OTP');
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

const verifyFPOTP = (req, res) => {
  const { email, otp } = req.body;

  if (otpMap[email] && otpMap[email] == otp) {
    delete otpMap[email];
    //res.status(200).send('Email verified successfully');
    res.status(200).json({ message: 'Email verified successfully' });
  } else {
    //res.status(400).send('Invalid OTP');
    res.status(400).json({ message: 'Invalid OTP' });
  }
};

export { sendFPOTP, verifyFPOTP };