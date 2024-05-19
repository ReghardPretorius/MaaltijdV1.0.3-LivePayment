import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './app/store';
import { Provider } from 'react-redux';
import HomeScreen from './pages/Home.jsx';
import LoginScreen from './pages/Login.jsx';
import RegisterScreen from './pages/Register.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import EmailVerification from './components/EmailVerification.jsx';
import EmailValidationPage from './pages/validateEmail.jsx';
import OtpInputWithValidation from './pages/otp.jsx';
import EnterEmail from './pages/forgotPassword.jsx';
import ValidateForgotPasswordPage from './pages/validateForgotPassword.jsx';
import ChangePassword from './pages/ChangePassword.jsx';
import UpdateProfile from './pages/updateProfile.jsx';
import EditAddressScreen from './pages/address.jsx';
import Cart from './pages/cart.jsx';
import Checkout from './pages/checkout.jsx';
import Pay from './pages/pay.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/validate' element={<EmailValidationPage />} />
      <Route path='/updateprofile' element={<UpdateProfile />} />
      <Route path='/address' element={<EditAddressScreen />} />
      <Route path='/otp' element={<OtpInputWithValidation  numberOfDigits={4}/>} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/forgotpassword' element={<EnterEmail />} />
      <Route path='/validatefp' element={<ValidateForgotPasswordPage />} />
      <Route path='/forgotpassword/changepassword' element={<ChangePassword />} />
      <Route path='/mail' element={<EmailVerification />} />
      <Route path='' element={<PrivateRoute />}>
      <Route path='/cart' element={<Cart />} />
      <Route path='/pay' element={<Pay />} />
      <Route path='/checkout' element={<Checkout />} />
      </Route>
    </Route>
  )
);


ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
