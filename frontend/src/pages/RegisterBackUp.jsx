import { useState, useEffect } from 'react';
import { Autocomplete, useLoadScript, GoogleMap, MarkerF, Polygon } from "@react-google-maps/api";
import { Form, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import {FormControl} from 'react-bootstrap';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import PlacesAutocomplete from '../components/PlacesAutocomplete';
//import Places from '../components/Places';
//import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import 'bootstrap-icons/font/bootstrap-icons.css';
//import { FaFlagZa } from 'react-icons/fa'; // Font Awesome
// Or from other icon libraries:
//import { FiZa } from 'react-icons/fi'; // Feather Icons
import { IoMdFlag } from 'react-icons/io'; // Ionicons
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Spinner from 'react-bootstrap/Spinner';
//import SouthAfricanFlagSVG from '..../public/south-africa-flag-icon.svg';
import SouthAfricanFlagSVG from '../assets/south-africa-flag-icon.svg';
import {updateName, updateSurname, updateEmail, updateCellNumber, updatePassword, updateVerifiedEmail, updateVerifiedNumber, resetUserInfo  } from '../slices/userInfoSlice';
import { updateAddressName, updateLat, updateLong, resetAddress, updateTown, updateSuburb, updateStreet, updateStreetNumber, updatePostalCode } from '../slices/autocompleteSlice';

import "../styles/Map.css";
import "../styles/Autocomplete.css";
import "../styles/Register.css";

import Map from '../components/Map';
import { set } from 'mongoose';

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const excludedBounds = [
  { lat: -26.66253, lng: 27.07885 },
  { lat: -26.66253, lng: 27.12440 },
  { lat: -26.72736, lng: 27.12440 },
  { lat: -26.72736, lng: 27.07885 },
];

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [addressName, setAddressName] = useState('');
  const [street, setStreet] = useState('');
  const [suburb, setSuburb] = useState('');
  const [town, setTown] = useState('');
  const [unit, setUnit] = useState('');
  const [building, setBuilding] = useState('');
  const [optionalAddressInfo, setOptionalAddressInfo] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [Lat, setLat] = useState('');
  const [Long, setLong] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [addressNameError, setAddressNameError] = useState('');
  const [cellNumber, setCellNumber] = useState('');

  const [validated, setValidated] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const [isValidSurname, setIsValidSurname] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isValidStreet, setIsValidStreet] = useState(false);
  const [isValidStreetNumber, setIsValidStreetNumber] = useState(false);
  const [isValidSuburb, setIsValidSuburb] = useState(false);
  const [isValidTown, setIsValidTown] = useState(false);
  const [isValidUnit, setIsValidUnit] = useState(false);
  const [isValidBuilding, setIsValidBuilding] = useState(false);



  const [isValidNumber, setIsValidNumber] = useState(false);

  const [showNameRequired, setShowNameRequired] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
 

  const [width, setWidth] = useState(window.innerWidth);
  const [center, setCenter] = useState({ lat: -26.7145, lng: 27.0970 });
  const [zoom, setZoom] = useState(14);
  const [searchResult, setSearchResult] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaaeYWTKUm-ifLJXGZ1kcHmp6SnB7hyKA",
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [newTown, setNewTown] = useState('');
  // const [newSuburb, setNewSuburb] = useState('');
  // const [newStreet, setNewStreet] = useState('');
  // const [newStreetNumber, setNewStreetNumber] = useState('');
  // const [newPostalCode, setNewPostalCode] = useState('');
  // const [newName, setNewName] = useState('');
  // const [newaddressComponent, setNewaddressComponent] = useState('');
  // const [newLat, setNewLat] = useState('');
  // const [newLong, setNewLong] = useState('');

  //const streetForm = useSelector(state => state.autocompleteSlice.street);

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);


  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const handleCellNumberChange = (event) => {
  //   const formattedNumber = event.target.value
  //     .replace(/\D/g, '') // Remove non-numeric characters
  //     .slice(0, 10) // Limit to 10 digits
  //     .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3'); // Add spaces for formatting
  //   setCellNumber(formattedNumber);
  // };

  const handleNameChange = (e) => {
    const newName = e.target.value.replace(/\d/g, '');
    setName(newName);

    // Regular expression to validate name format (only text characters)
    const nameRegex = /^[A-Za-z]+$/;
    const isValid = newName.length >= 1 && nameRegex.test(newName);

    // Update isValidName state based on name format
    setIsValidName(isValid);
  };

  const handleSurnameChange = (e) => {
    //const newSurname = e.target.value;
    const newSurname = e.target.value.replace(/\d/g, '');
    setSurname(newSurname);

    // Regular expression to validate name format (only text characters)
    const nameRegex = /^[A-Za-z]+$/;
    const isValid = newSurname.length >= 1 && nameRegex.test(newSurname);

    // Update isValidName state based on name format
    setIsValidSurname(isValid);
  };


  const handleCellNumberChange = (event) => {
    let inputNumber = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    let formattedNumber = '';

    for (let i = 0; i < Math.min(inputNumber.length, 10); i++) {
      if (i === 3 || i === 6) {
        formattedNumber += ' '; // Add space after the 3rd and 7th character
      }
      formattedNumber += inputNumber[i];
    }

    if (inputNumber.length === 10){
      setIsValidNumber(true);
    }

    setCellNumber(formattedNumber);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    // Regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(newEmail);

    // Update isValidEmail state based on email format
    setIsValidEmail(isValid);
  };

  const handlePasswordChange = (e) => {
    let newPassword = e.target.value;
    setPassword(newPassword);

    // Check if password meets the criteria
    const isLengthValid = newPassword.length >= 8;
    const hasDigit = /\d/.test(newPassword);
    const hasNonDigit = /\D/.test(newPassword);

    // Update isValid state based on criteria
    setIsValidPassword(isLengthValid && hasDigit && hasNonDigit);
  };

  const handleConfirmPasswordChange = (e) => {
    let newCofirmPassword = e.target.value;
    setConfirmPassword(newCofirmPassword);
    let equal = false;

    // Check if password meets the criteria
    const isLengthValid = newCofirmPassword.length >= 8;
    const hasDigit = /\d/.test(newCofirmPassword);
    const hasNonDigit = /\D/.test(newCofirmPassword);
    if (password === confirmPassword){ 
      equal = true;
    }
      
    //const equal =  newCofirmPassword === password;

    // Update isValid state based on criteria
    setIsValidConfirmPassword(isLengthValid && hasDigit && hasNonDigit && equal);
    // console.log(isValidConfirmPassword)
  };

  const handleUnitChange = (e) => {
    let newUnit = e.target.value;
    setUnit(newUnit);


    const isValid = newUnit.length >= 1 

    // Update isValidName state based on name format
    setIsValidUnit(isValid);
  };


  

  const [passwordType, setPasswordType] = useState("password");
  const [passwordInput, setPasswordInput] = useState("");
  // const handlePasswordChange =(evnt)=>{
  //     setPasswordInput(evnt.target.value);
  // }
  const togglePassword =()=>{
    if(passwordType==="password")
    {
     setPasswordType("text")
     return;
    }
    setPasswordType("password")
  }

  // const togglePasswordVisibility = () => {
  //   setPasswordVisible(!passwordVisible);
  // };

  const OnPlaceChanged = () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const geometry = place.geometry.location;
      const lat = geometry.lat();
      const lng = geometry.lng();


// Check if coordinates fall within specified bounds
if ((lat > -26.66253) || (lat < -26.72736) || (lng < 27.07885) || (lng > 27.12440)) {
  // Display error message
  // alert("The selected location is outside the supported area. Please choose a location within the specified boundaries.");
  toast.error('The selected address is outside our supported area. Only Central Potchefstroom is covered at present.');
  // Reset the map and search results (optional)
  setCenter({ lat: -26.7145, lng: 27.0970 });
  setZoom(14);
  setSearchResult(null);
  // Clear the input text
  const inputToClear = document.querySelector('#searchInput');
  inputToClear.value = '';

  // Add a subtle animation
  inputToClear.classList.add('cleared');
  setTimeout(() => {
    inputToClear.classList.remove('cleared');
  }, 500); // Adjust the timeout duration as needed
} else {
  // Proceed with updating state and map as usual
  setCenter({ lat, lng });
  setZoom(16);
  // ... your existing code to update state and dispatch actions ...
      // Loop through address_components to extract specific information
  const { street_number, route, locality, sublocality, postal_code } = extractAddressComponents(place.address_components);

  // Update state and dispatch actions
  setAddressName(place.name);
  setLat(lat);
  setLong(lng);
  setStreetNumber(street_number);
  setStreet(route);
  setSuburb(sublocality);
  setTown(locality);
  setPostalCode(postal_code);


  dispatch(updateAddressName(place.name));
  dispatch(updateLat(lat));
  dispatch(updateLong(lng));
  dispatch(updateStreetNumber(street_number));
  dispatch(updateStreet(route));
  dispatch(updateSuburb(sublocality));
  dispatch(updateTown(locality));
  dispatch(updatePostalCode(postal_code));
  setIsValidAddress(true);
  setIsValidStreet(true);
  setIsValidSuburb(true);
  setIsValidStreetNumber(true);
  setIsValidTown(true);

  
  //var streetForm = route


}

    }
  };

// Function to extract address components
const extractAddressComponents = (addressComponents) => {
  const addressData = {};
  addressComponents.forEach((component) => {
    if (component.types.includes("street_number")) {
      addressData.street_number = component.long_name;
    } else if (component.types.includes("route")) {
      addressData.route = component.long_name;
    } else if (component.types.includes("locality")) {
      addressData.locality = component.long_name;
    } else if (component.types.includes("sublocality") || component.types.includes("sublocality_level_1")) {
      addressData.sublocality = component.long_name;
    } else if (component.types.includes("postal_code")) {
      addressData.postal_code = component.long_name;
    }
  });
  return addressData;
};

  // Function to validate form fields
const validateForm = () => {
  let valid = true;

  if (name === '' || !name) {
    setNameError('Name is required');
    setShowNameRequired(true);

    valid = false;
  } else {
    setNameError('');
    setShowNameRequired(false);
  }

  if (!email) {
    setEmailError('Email is required');
    valid = false;
  } else {
    setEmailError('');
  }

  if (!password) {
    setPasswordError('Password is required');
    valid = false;
  } else {
    setPasswordError('');
  }

  if (!confirmPassword) {
    setConfirmPasswordError('Confirm Password is required');
    valid = false;
  } else if (password !== confirmPassword) {
    setConfirmPasswordError('Passwords do not match');
    valid = false;
  } else {
    setConfirmPasswordError('');
  }

  if (!addressName) {
    setAddressNameError('Address is required');
    valid = false;
  } else {
    setAddressNameError('');
  }

  return valid;
};

  const submitHandler = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    const newNoSpaceCellNuber = cellNumber.replace(/\s/g, "");
    dispatch(updateName(name));
    dispatch(updateSurname(surname));
    dispatch(updateEmail(email));
    dispatch(updateCellNumber(newNoSpaceCellNuber));
    dispatch(updatePassword(password));


    setValidated(true);
    //const values = Object.fromEntries(new FormData(e.target));

    // Validate required fields
    //const requiredFields = ['name', 'email', 'password', 'confirmPassword', 'addressName'];
    //const missingFields = requiredFields.filter((field) => !values[field]);

    //if (missingFields.length > 0) {
    //  setErrors({ ...errors, ...missingFields.reduce((acc, field) => ({ ...acc, [field]: 'This field is required' }), {}) });
    //  return;
    //}

    if (name === '' || !name) {
      setNameError('Name is required');
      setShowNameRequired(true);
      //valid = false;
    } else {
      setNameError('');
      setShowNameRequired(false);
    }
  
    if (!email) {
      setEmailError('Email is required');
      // valid = false; (Assuming this is used to control overall form validity)
    } else {
      // Check for valid email format using a regular expression
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');

        // valid = false; (Assuming this is used to control overall form validity)
      } else {
        setEmailError('');
      }
    }
  
    if (!password) {
      setPasswordError('Password is required');
      //valid = false;
    } else {
      setPasswordError('');
    }
  
    if (!confirmPassword) {
      setConfirmPasswordError('Confirm Password is required');
      //valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      //valid = false;
    } else {
      setConfirmPasswordError('');
    }
  
    if (!addressName) {
      setAddressNameError('Address is required');
      //valid = false;
    } else {
      setAddressNameError('');
    }

    //const isValid = validateForm();

    // if (isValid) {
    //   try {
    //     const res = await register({ name, email, password }).unwrap();
    //     dispatch(setCredentials({ ...res }));
    //     navigate('/');
    //   } catch (err) {
    //     toast.error(err?.data?.message || err.error);
    //   }
    // }

    // if (password !== confirmPassword) {
    // toast.error('Passwords do not match');
    // } else {
    //   try {
    //     const res = await register({ name, email, password }).unwrap();
    //     dispatch(setCredentials({ ...res }));
    //     navigate('/');
    //   } catch (err) {
    //     toast.error(err?.data?.message || err.error);
    //   }
    // }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return <div style={{ display: "flex", justifyContent: "center"}}>
  <Spinner animation="border" />
</div>;

  return (

    <FormContainer>



      <h1>Register</h1>

      <Row className='py-3'>
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>

      <Form noValidate validated={validated} onSubmit={submitHandler}>

        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name&nbsp;
          {/* <span className='required-label' hidden={!showNameRequired}>*Required</span> Added span for "Required" text */}
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Name'
            value={name}
            //onChange={(e) => setName(e.target.value)}
            onChange={handleNameChange}
            isValid={isValidName}
            required
            // isInvalid={!!errors.name}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please provide your Name.
          </Form.Control.Feedback>
          {/* <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback> */}
          {/* <Form.Text className='text-danger'>{nameError}</Form.Text> */}
        </Form.Group>

        <Form.Group className='my-2' controlId='surname'>
          <Form.Label>Surname
          {/* <span className='required-label' hidden={!showNameRequired}>*Required</span> Added span for "Required" text */}
          </Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Surname'
            value={surname}
            //onChange={(e) => setSurname(e.target.value)}
            onChange={handleSurnameChange}
            isValid={isValidSurname}
            required
            // isInvalid={!!errors.name}
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please provide your Surname.
          </Form.Control.Feedback>
          {/* <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback> */}
          {/* <Form.Text className='text-danger'>{nameError}</Form.Text> */}
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            //onChange={(e) => setEmail(e.target.value)}
            onChange={handleEmailChange}
            isValid={isValidEmail}
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Email address.
          </Form.Control.Feedback>
        </Form.Group>

        {/* <Form.Group className='my-2' controlId='cellNumber'>
          <Form.Label>Cellphone Number</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Cellphone Number'
            value={cellNumber}
            onChange={handleCellNumberChange}
            required
          ></Form.Control>
        </Form.Group> */}

        {/* <Form.Label>Cellphone Number</Form.Label>
        <InputGroup className='my-2' controlId='cellNumber'>
        <DropdownButton
          variant="outline-secondary"
          title="+27"
          id="input-group-dropdown-1"
        >
          <Dropdown.Item href="#"><img src={SouthAfricanFlagSVG} alt="South African Flag" style={{ width: '15px', height: 'auto' }} /> +27</Dropdown.Item>
          <Dropdown.Item href="#">Another action</Dropdown.Item>
          <Dropdown.Item href="#">Something else here</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#">Separated link</Dropdown.Item>
        </DropdownButton>
        <Form.Control
            type='text'
            placeholder='E.g. 081 123 4567'
            value={cellNumber}
            onChange={handleCellNumberChange}
            required
          ></Form.Control>
      </InputGroup> */}

      <Form.Label>Cellphone Number</Form.Label>
      <InputGroup className='my-2' controlId='cellNumber'>
        <InputGroup.Text><img src={SouthAfricanFlagSVG} alt="South African Flag" style={{ width: '13px', height: 'auto' }} />&nbsp;+27</InputGroup.Text>
        <Form.Control
            isValid={isValidNumber}
            type='text'
            placeholder='E.g. 081 123 4567'
            value={cellNumber}
            onChange={handleCellNumberChange}
            required
           minLength='12'
            maxLength='12'
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Cellphone Number.
          </Form.Control.Feedback>
        {/* <InputGroup.Text>.00</InputGroup.Text> */}
      </InputGroup>
      

      
        {/* <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            // type='password'
            type={passwordVisible ? 'text' : 'password'}
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required>
            <Button onClick={() => setPasswordVisible(!passwordVisible)}>
            {passwordVisible ? 'Hide' : 'Show'} 
          </Button>
          </Form.Control>
        </Form.Group> */}

<p class="password-policy" aria-live="polite">
  <span className="strong">Password requirements:</span>
  <ul>
    <li>At least 8 characters long</li>
    <li>At least one number</li>
    <li>At least one non-numeric character (e.g., letter, symbol)</li>
  </ul>
</p>

<Form.Label>Password</Form.Label>
<InputGroup className='my-2' controlId='password'>
        <Form.Control
          
          placeholder="Password"
          type={passwordVisible ? 'text' : 'password'}
          aria-label="Recipient's username"
          aria-describedby="basic-addon3"
          value={password}
          //onChange={(e) => setPassword(e.target.value)}
          onChange={handlePasswordChange}
          isValid={isValidPassword}
          required
          minLength={8}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={() => setPasswordVisible(!passwordVisible)}>
        {/* {passwordVisible ? 'Hide' : 'Show'}  */}
        <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`} />
        </Button>
      </InputGroup>






        {/* <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          ></Form.Control>
        </Form.Group> */}

<Form.Label>Confirm Password</Form.Label>
<InputGroup className='my-2' controlId='confirmPassword'>
        <Form.Control
          placeholder="Confirm password"
          type={confirmPasswordVisible ? 'text' : 'password'}
          aria-describedby="basic-addon4"
          value={confirmPassword}
          //onChange={(e) => setConfirmPassword(e.target.value)}
          onChange={handleConfirmPasswordChange}
          isValid={isValidConfirmPassword}
          required
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
        {/* {passwordVisible ? 'Hide' : 'Show'}  */}
        <i className={`bi bi-eye${confirmPasswordVisible ? '-slash' : ''}`} />
        </Button>
      </InputGroup>

        <Form.Group className='my-2' controlId='town'>
          <Form.Label>Delivery Address</Form.Label>

        </Form.Group>
        <div className="inputContainer">
      <Autocomplete onLoad={setSearchResult} onPlaceChanged={OnPlaceChanged}
      bounds={{
        east: 27.12440,
        west: 27.07885,
        north: -26.66253,
        south: -26.72736,
      }}
            // options={{
            //   fields: ['address_components', 'geometry'],
            //   componentRestrictions: {
            //     country: "ZA",
            //     locality: "Potchefstroom"
            //   }
              // bounds: {
              //   north: -26.66253,
              //   south: -26.72736,
              //   east: 27.12440,
              //   west: 27.07885
              // }
              // bounds and types options as needed
            // }}
            >
        <input  type="text" placeholder="Search for a location" id="searchInput" />
      </Autocomplete>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={center} options={options} className ="map">
      {/* <GoogleMap zoom={zoom} center={center} options={options} className ="map"> */}
        <MarkerF position={center} icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} />
        <Polygon paths={[excludedBounds]} options={{ strokeColor: "#FF0000", strokeOpacity: 0.5, strokeWeight: 2 }} />
      </GoogleMap>
    </div>

    {/* <Form.Group className='my-2' controlId='street'>
    <Form.Label>Street</Form.Label>
    <Form.Control
      type='name'
      placeholder='Street'
      value={street}
      readOnly
    ></Form.Control>
    </Form.Group> */}


        <Form.Group className='my-2' controlId='addressName'>
        <Form.Label>Address</Form.Label>
          <Form.Control
            type='name'
            placeholder='Address'
            value={addressName}
            isValid={isValidAddress}
            readOnly
            required
          ></Form.Control>
          <Form.Control.Feedback type="invalid">
            Please provide a valid Address.
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className='my-2' controlId='street'>
        <Form.Label>Street</Form.Label>
          <Form.Control
            type='name'
            placeholder='Street'
            value={street}
            readOnly
            isValid={isValidStreet}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='streetNumber'>
        <Form.Label>Street Number</Form.Label>
          <Form.Control
            type='name'
            placeholder='Street Number'
            value={streetNumber}
            readOnly
            isValid={isValidStreetNumber}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='suburb'>
        <Form.Label>Suburb</Form.Label>
          <Form.Control
            type='name'
            placeholder='Suburb'
            value={suburb}
            readOnly
            isValid={isValidSuburb}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='town'>
        <Form.Label>Town</Form.Label>
          <Form.Control
            type='name'
            placeholder='Town'
            value={town}
            readOnly
            isValid={isValidTown}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='unit'>
        <Form.Label>Unit / Floor / Apartment</Form.Label>
          <Form.Control
            type='name'
            placeholder='E.g. 102'
            value={unit}
            onChange={handleUnitChange}
            required
            isValid={isValidUnit}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='buildingName'>
        <Form.Label>Building Name
        &nbsp;
          <span className='optional-label'>*Optional</span>
        </Form.Label>
          <Form.Control
            type='name'
            placeholder='E.g. Jongebrug'
            value={building}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='optionalAddressInfo'>
        <Form.Label>Additional Address Information
        &nbsp;
          <span className='optional-label'>*Optional</span>
        </Form.Label>
          <Form.Control
            type='name'
            placeholder='Enter any Additional Address Information'
            value={optionalAddressInfo}
          ></Form.Control>
        </Form.Group>

        {/* <Map /> */}



        {/* <Button type='submit' variant='primary' className='mt-3' disabled={Object.keys(errors).length > 0}>
          Register
        </Button> */}

        {/* <Button type='submit' variant='primary' className='mt-3' disabled={!validateForm()}>
        Register
      </Button> */}

        <Button type='submit' variant='primary' className='mt-3'>
        Register
      </Button>
        {isLoading && <Loader />}
      </Form>


    </FormContainer>
  );
};

export default RegisterScreen;

//////////////////////     NAME BACKUP /////////////////////////////////////
<Form.Group className='my-2' controlId='firstName'>
<Form.Label>Name&nbsp;
{isValidName && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}
{/* <span className='required-label' hidden={!showNameRequired}>*Required</span> Added span for "Required" text */}
</Form.Label>
<Form.Control
  type='text'
  name='firstName'
  placeholder='Enter Name'
  //value={name}
  
  //onChange={(e) => setName(e.target.value)}
  onChange={handleNameChange}
  //isValid={isValidName}
  required
  //isInvalid={!!errors.name}
  //style={{ border: isValidName ? '2px solid green' : '1px solid #ccc' }} // Adjust styling as needed
  style={{ border: isValidName ? '1px solid #198754': ''}}
  // isInvalid={!!errors.name}
></Form.Control>

{/* <Form.Control.Feedback type="invalid">
  Please provide your Name.
</Form.Control.Feedback> */}

{/* <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback> */}
{/* <Form.Text className='text-danger'>{nameError}</Form.Text> */}
<ErrorMessage name="firstName" component="div" className="text-danger" />
</Form.Group>


///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// Form Backup //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

<Form noValidate validated={formik.isValid} onSubmit={formik.handleSubmit}>

<Form.Group className='my-2' controlId='name'>
<Form.Label>Name</Form.Label>
<Form.Control
type='text'
name='firstName'
placeholder='Enter Name'
value={formik.values.firstName}
onChange={formik.handleChange}
isInvalid={formik.touched.firstName && !!formik.errors.firstName}
required
/>
<Form.Control.Feedback type="invalid">
{formik.errors.firstName}
</Form.Control.Feedback>
</Form.Group>



  <Form.Group className='my-2' controlId='surname'>
    <Form.Label>Surname&nbsp;
    {isValidSurname && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}
    {/* <span className='required-label' hidden={!showNameRequired}>*Required</span> Added span for "Required" text */}
    </Form.Label>
    <Form.Control
      type='text'
      placeholder='Enter Surname'
      value={surname}
      //onChange={(e) => setSurname(e.target.value)}
      onChange={handleSurnameChange}
      //isValid={isValidSurname}
      required
      style={{ border: isValidSurname ? '1px solid #198754': ''}}
      // isInvalid={!!errors.name}
    ></Form.Control>
    <Form.Control.Feedback type="invalid">
      Please provide your Surname.
    </Form.Control.Feedback>

  </Form.Group>

  <Form.Group className='my-2' controlId='email'>
    <Form.Label>Email Address&nbsp;
    {isValidEmail && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='email'
      placeholder='Enter email'
      value={email}
      //onChange={(e) => setEmail(e.target.value)}
      onChange={handleEmailChange}
      //isValid={isValidEmail}
      required
      style={{ border: isValidEmail ? '1px solid #198754': ''}}
    ></Form.Control>
    <Form.Control.Feedback type="invalid">
      Please provide a valid Email address.
    </Form.Control.Feedback>
  </Form.Group>

<Form.Label>Cellphone Number&nbsp;
    {isValidNumber && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
<InputGroup className='my-2' controlId='cellNumber'>
  <InputGroup.Text><img src={SouthAfricanFlagSVG} alt="South African Flag" style={{ width: '13px', height: 'auto' }} />&nbsp;+27</InputGroup.Text>
  <Form.Control
      //isValid={isValidNumber}
      //isValid={!errors.cellNumber}
      //error={errors.cellNumber}
      //helperText={errors.cellNumber}
      type='text'
      name='cellNumber'
      placeholder='E.g. 081 123 4567'
      value={cellNumber}
      onChange={handleCellNumberChange}
      required
     minLength='12'
      maxLength='12'
      style={{ border: isValidNumber ? '1px solid #198754': ''}}
    ></Form.Control>
    <Form.Control.Feedback type="invalid">
      Please provide a valid Cellphone Number.
    </Form.Control.Feedback>
</InputGroup>

<p class="password-policy" aria-live="polite">
<span className="strong">Password requirements:</span>
<ul>
<li>At least 8 characters long</li>
<li>At least one number</li>
<li>At least one non-numeric character (e.g., letter, symbol)</li>
</ul>
</p>

<Form.Label>Password&nbsp;
    {isValidPassword && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
<InputGroup className='my-2' controlId='password'>
  <Form.Control
    
    placeholder="Password"
    type={passwordVisible ? 'text' : 'password'}
    aria-label="Recipient's username"
    aria-describedby="basic-addon3"
    value={password}
    onChange={handlePasswordChange}
    //isValid={isValidPassword}
    isInvalid={!isValidPassword && password.touched}
    required
    minLength={8}
    style={{ border: isValidPassword ? '1px solid #198754': ''}}
  />
  <Button variant="outline-secondary" id="button-addon3" onClick={() => setPasswordVisible(!passwordVisible)}>
  <i className={`bi bi-eye${passwordVisible ? '-slash' : ''}`} />
  </Button>
  <Form.Control.Feedback type="invalid">
      Please provide a valid Password.
  </Form.Control.Feedback>
</InputGroup>
<div>
{isValidPassword ? <strong>Valid</strong> : <strong>Invalid</strong>}
</div>


<Form.Label>Confirm Password&nbsp;
    {isValidConfirmPassword && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
<InputGroup className='my-2' controlId='confirmPassword'>
  <Form.Control
    placeholder="Confirm password"
    type={confirmPasswordVisible ? 'text' : 'password'}
    aria-describedby="basic-addon2"
    value={confirmPassword}
    onChange={handleConfirmPasswordChange}
    //isValid={isValidConfirmPassword}
    isInvalid={!isValidConfirmPassword && confirmPassword.touched}
    required
    //minLength={8}
    style={{ border: isValidConfirmPassword ? '1px solid #198754': ''}}
  />
  <Button variant="outline-secondary" id="button-addon2" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
  <i className={`bi bi-eye${confirmPasswordVisible ? '-slash' : ''}`} />
  </Button>
  <Form.Control.Feedback type="invalid">
      {/* Confirm Password is Invalid. */}
      {!isValidConfirmPassword && confirmPassword.touched ? 'Passwords do not match.' : 'Confirm Password is Invalid.'}
  </Form.Control.Feedback>
</InputGroup>

<div>
{isValidConfirmPassword ? <strong>Valid</strong> : <strong>Invalid</strong>}
</div>

  <Form.Group className='my-2' controlId='town'>
    <Form.Label>Delivery Address</Form.Label>

  </Form.Group>
  <div className="inputContainer">
<Autocomplete onLoad={setSearchResult} onPlaceChanged={OnPlaceChanged}
bounds={{
  east: 27.12440,
  west: 27.07885,
  north: -26.66253,
  south: -26.72736,
}}
>
  <input  type="text" placeholder="Search for a location" id="searchInput" />
</Autocomplete>
<GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={center} options={options} className ="map">
{/* <GoogleMap zoom={zoom} center={center} options={options} className ="map"> */}
  <MarkerF position={center} icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} />
  <Polygon paths={[excludedBounds]} options={{ strokeColor: "#FF0000", strokeOpacity: 0.5, strokeWeight: 2 }} />
</GoogleMap>
</div>

  <Form.Group className='my-2' controlId='addressName'>
  <Form.Label>Address&nbsp;
    {isValidAddress && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='name'
      placeholder='Address'
      value={addressName}
      //isValid={isValidAddress}
      readOnly
      required
      style={{ border: isValidAddress ? '1px solid #198754': ''}}
    ></Form.Control>
    <Form.Control.Feedback type="invalid">
      Please provide a valid Address.
    </Form.Control.Feedback>
  </Form.Group>

  <Form.Group className='my-2' controlId='street'>
  <Form.Label>Street&nbsp;
    {isValidAddress && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='name'
      placeholder='Street'
      value={street}
      readOnly
      //isValid={isValidStreet}
      style={{ border: isValidAddress ? '1px solid #198754': ''}}
    ></Form.Control>
  </Form.Group>

  <Form.Group className='my-2' controlId='streetNumber'>
  <Form.Label>Street Number&nbsp;
    {isValidAddress && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='name'
      placeholder='Street Number'
      value={streetNumber}
      readOnly
      //isValid={isValidStreetNumber}
      style={{ border: isValidAddress ? '1px solid #198754': ''}}
    ></Form.Control>
  </Form.Group>

  <Form.Group className='my-2' controlId='suburb'>
  <Form.Label>Suburb&nbsp;
    {isValidAddress && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='name'
      placeholder='Suburb'
      value={suburb}
      readOnly
      //isValid={isValidSuburb}
      style={{ border: isValidAddress ? '1px solid #198754': ''}}
    ></Form.Control>
  </Form.Group>

  <Form.Group className='my-2' controlId='town'>
  <Form.Label>Town&nbsp;
    {isValidAddress && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='name'
      placeholder='Town'
      value={town}
      readOnly
      //isValid={isValidTown}
      style={{ border: isValidAddress ? '1px solid #198754': ''}}
    ></Form.Control>
  </Form.Group>

  <Form.Group className='my-2' controlId='unit'>
  <Form.Label>Unit / Floor / Apartment&nbsp;
    {isValidUnit && <FaCheckCircle style={{ color: 'green', marginLeft: '5px' }} />}</Form.Label>
    <Form.Control
      type='name'
      placeholder='E.g. 102'
      value={unit}
      onChange={handleUnitChange}
      required
      //isValid={isValidUnit}
      style={{ border: isValidUnit ? '1px solid #198754': ''}}
    ></Form.Control>
  </Form.Group>

  <Form.Group className='my-2' controlId='buildingName'>
  <Form.Label>Building Name
  &nbsp;
    <span className='optional-label'>*Optional</span>
  </Form.Label>
    <Form.Control
      type='name'
      placeholder='E.g. Jongebrug'
      value={building}
    ></Form.Control>
  </Form.Group>

  <Form.Group className='my-2' controlId='optionalAddressInfo'>
  <Form.Label>Additional Address Information
  &nbsp;
    <span className='optional-label'>*Optional</span>
  </Form.Label>
    <Form.Control
      type='name'
      placeholder='Enter any Additional Address Information'
      value={optionalAddressInfo}
    ></Form.Control>
  </Form.Group>


  <Button type='submit' variant='primary' className='mt-3'>
  Register
</Button>

  {isLoading && <Loader />}
</Form>