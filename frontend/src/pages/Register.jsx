import { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  useLoadScript,
  GoogleMap,
  Marker,
} from "@react-google-maps/api";
import { Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from '../components/Loader';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import SouthAfricanFlagSVG from "../assets/south-africa-flag-icon.svg";
import {
  updateName,
  updateSurname,
  updateEmail,
  updateCellNumber,
  updatePassword,
  updateEmailIsVerified,
  updateNumberIsVerified,
  updateTerms,
  updateMarketing,
} from "../slices/userInfoSlice";
import {
  updateAddressName,
  updateLat,
  updateLong,
  updateTown,
  updateSuburb,
  updateStreet,
  updateStreetNumber,
  updatePostalCode,
  updateUnit,
  updateBuilding,
  updateOptionalAddressInfo,
  updateFormattedAddress,
} from "../slices/autocompleteSlice";
import { Form as BootstrapForm, ProgressBar , Modal, FormGroup, FormCheck  } from "react-bootstrap";
import { useEmailExistsMutation, useCellnumberExistsMutation } from "../slices/usersApiSlice";
import ScrollToTopInput from '../components/scrollToTopInput';

import "../styles/Map.css";
import "../styles/Autocomplete.css";
import "../styles/Register.css";


const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// function AdvancedMarker({ position, icon, map }) {
//   const markerRef = useRef(null);

//   useEffect(() => {
//     if (markerRef.current) {
//       markerRef.current.setMap(null);
//     }
//     if (map) {
//       const marker = new window.google.maps.marker.AdvancedMarkerElement({
//         position,
//         map: map,
//         content: document.createElement('div'), // Customize this element as needed
//       });
//       markerRef.current = marker;
//     }
//     return () => {
//       if (markerRef.current) {
//         markerRef.current.setMap(null);
//       }
//     };
//   }, [position, map]);

//   return null;
// }


// const excludedBounds = [
//   { lat: -26.66253, lng: 27.07885 },
//   { lat: -26.66253, lng: 27.1244 },
//   { lat: -26.72736, lng: 27.1244 },
//   { lat: -26.72736, lng: 27.07885 },
// ];

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [addressName, setAddressName] = useState("");
  const [unit, setUnit] = useState("");
  const [building, setBuilding] = useState("");
  const [optionalAddressInfo, setOptionalAddressInfo] = useState("");
  const [cellNumber, setCellNumber] = useState("");

  const [isValidName, setIsValidName] = useState(false);
  const [isValidSurname, setIsValidSurname] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isValidConfirmPassword, setIsValidConfirmPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [isValidUnit, setIsValidUnit] = useState(false);
  const [isValidTerms, setIsValidTerms] = useState(false);
  const [isCheckedMarketing, setIsCheckedMarketing] = useState(false);
  const [isMarketing, setIsMarketing] = useState('0');
  const [showPP, setShowPP] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [isBlurName, setIsBlurName] = useState(false);
  const [isBlurSurname, setIsBlurSurname] = useState(false);
  const [isBlurPassword, setIsBlurPassword] = useState(false);
  const [isBlurConfirmPassword, setIsBlurConfirmPassword] = useState(false);
  const [isBlurEmail, setIsBlurEmail] = useState(false);
  const [isBlurCellNumber, setIsBlurCellNumber] = useState(false);
  const [isBlurUnit, setIsBlurUnit] = useState(false);
  const [isBlurAddress, setIsBlurAddress] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(false);

  const [isExistingEmail, setIsExistingEmail] = useState(false);
  const [isExistingNumber, setIsExistingCellNumber] = useState(false);

  const [step, setStep] = useState(1);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [formattedAddress, setFormattedAddress] = useState("");

  const [center, setCenter] = useState({ lat: -26.7145, lng: 27.097 });
  const [zoom, setZoom] = useState(14);
  const [searchResult, setSearchResult] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaaeYWTKUm-ifLJXGZ1kcHmp6SnB7hyKA",
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const mapRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailExists, { isLoadingEmailExits }] = useEmailExistsMutation();
  const [cellnumberExists, { isLoadingCellnumberExits }] = useCellnumberExistsMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);


  useEffect(() => {
    (async () => {
      try {
        const response = await emailExists({ email }).unwrap();
        if (response.message === '1') {
          setIsExistingEmail(true); // Set state based on 201 status
        } else {
          setIsExistingEmail(false); // Set state for any other status
        }
      } catch (err) {
        setIsExistingEmail(false); // Set state to indicate email doesn't exist
      }
    })();
  }, [email]);


  useEffect(() => {
    const noSpaceCellNumber = cellNumber.replace(/\s/g, "");
    (async () => {
      try {
        const response = await cellnumberExists({ noSpaceCellNumber }).unwrap();
        if (response.message === '1') {
          setIsExistingCellNumber(true); // Set state based on 201 status
        } else {
          setIsExistingCellNumber(false); // Set state for any other status
        }
      } catch (err) {
        setIsExistingCellNumber(false); // Set state to indicate email doesn't exist
      }
    })();
  }, [cellNumber]);


  useEffect(() => {
    if (isCheckedMarketing === true){
      setIsMarketing('1');
      //console.log(isMarketing);
    } else 
    if (isCheckedMarketing === false){
      setIsMarketing('0');
      //console.log(isMarketing);
    }
  }, [isCheckedMarketing]);



  const handleNameChange = (e) => {
    const newName = e.target.value.replace(/\d/g, "");
    setName(newName);

    // Regular expression to validate name format (only text characters)
    //const nameRegex = /^[A-Za-z]+$/;
    const isValid = newName.length >= 1 ;
    //const isValid = newName.length >= 1 && nameRegex.test(newName);

    // Update isValidName state based on name format
    setIsValidName(isValid);

  };

  const handleNameBlur = () => {
    setIsBlurName(true);
  };

  const handleSurnameBlur = () => {
    setIsBlurSurname(true);
  };

  const handleSurnameChange = (e) => {
    //const newSurname = e.target.value;
    const newSurname = e.target.value.replace(/\d/g, "");
    setSurname(newSurname);

    // Regular expression to validate name format (only text characters)
    // const nameRegex = /^[A-Za-z]+$/;
    // const isValid = newSurname.length >= 1 && nameRegex.test(newSurname);
    const isValid = newSurname.length >= 1 ;

    // Update isValidName state based on name format
    setIsValidSurname(isValid);

  };

  const handleCellNumberChange = (event) => {
    let inputNumber = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    let formattedNumber = "";

    for (let i = 0; i < Math.min(inputNumber.length, 10); i++) {
      if (i === 3 || i === 6) {
        formattedNumber += " "; // Add space after the 3rd and 7th character
      }
      formattedNumber += inputNumber[i];
    }

    if (inputNumber.length === 10) {
      setIsValidNumber(true);
    } else {
      setIsValidNumber(false);
    }

    setCellNumber(formattedNumber);

  };

  const handleCellNumberBlur = () => {
    setIsBlurCellNumber(true);
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

  const handleEmailBlur = () => {
    setIsBlurEmail(true);
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

    if (isBlurConfirmPassword) {
      let cp = confirmPassword;
      if (newPassword !== cp) {
        setIsValidConfirmPassword(false);
      }
      else if (newPassword === cp) {
        setIsValidConfirmPassword(true);
      }
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

  };

  const handleConfirmPasswordBlur = () => {
    setIsBlurConfirmPassword(true);
  };

  const handleUnitChange = (e) => {
    let newUnit = e.target.value;
    setUnit(newUnit);

    const isValid = newUnit.length >= 1;

    // Update isValidName state based on name format
    setIsValidUnit(isValid);
  };

  const handleUnitBlur = () => {
    setIsBlurUnit(true);
  };

  const handleCheckboxChange = () => {
    setIsValidTerms(!isValidTerms);
  };

  const handleCheckboxMarketingChange = () => {
    setIsCheckedMarketing(!isCheckedMarketing);
  };

  const handleBuildingChange = (e) => {
    let newBuilding = e.target.value;
    setBuilding(newBuilding);
  }

  const handleOAIChange = (e) => {
    let newOAI = e.target.value;
    setOptionalAddressInfo(newOAI);
  }

  
  const handleNext = async (e) => {
    e.preventDefault();
    if (step === 1 && isValidName && isValidSurname && isValidEmail && isValidNumber){
      // try {
      //   const resEmailExits = await emailExists({ email }).unwrap();
      //   console.log(resEmailExits);
      //   setIsExistingEmail(true);
      //   //navigate('/');
      // } catch (err) {
      //   console.log('Error');
      //   //console.log(resEmailExits);
      //   //toast.error(err?.data?.message || err.error);
      // }

      // try {
      //   const resCellnumberExits = await cellnumberExists({ cellNumber }).unwrap();
      //   console.log(resCellnumberExits);
      //   setIsExistingCellNumber(true);
      //   //navigate('/');
      // } catch (err) {
      //   console.log('Error');
      //   //console.log(resEmailExits);
      //   //toast.error(err?.data?.message || err.error);
      // }

      if (!isExistingEmail && !isExistingNumber){
        setStep(step + 1);
      }
      
    } else if (step === 1){
      if (!isValidName){
        setIsBlurName(true);
      }
      if (!isValidSurname){
        setIsBlurSurname(true);
      }
      if (!isValidEmail){
        setIsBlurEmail(true);
      }
      if (!isValidNumber){
        setIsBlurCellNumber(true);
      }
    }


    // if (step === 1 && isValidName && isValidSurname && isValidEmail && isValidNumber){
    //   setStep(step + 1);
    // } else if (step === 1){
    //   if (!isValidName){
    //     setIsBlurName(true);
    //   }
    //   if (!isValidSurname){
    //     setIsBlurSurname(true);
    //   }
    //   if (!isValidEmail){
    //     setIsBlurEmail(true);
    //   }
    //   if (!isValidNumber){
    //     setIsBlurCellNumber(true);
    //   }
    // }

    if (step === 2 && isValidAddress && isValidUnit){
      setStep(step + 1);
    } else if (step === 2){
      if (!isValidAddress){
        setIsBlurAddress(true);
      }
      if (!isValidUnit){
        setIsBlurUnit(true);
      }
    }

    if (step === 3 && isValidPassword && isValidConfirmPassword){
      setStep(step + 1);
    } else if (step === 3){
      if (!isValidPassword){
        setIsBlurPassword(true);
      }
      if (!isValidConfirmPassword){
        setIsBlurConfirmPassword(true);
      }
    }
    //(step === 2 && isValidPassword && isValidConfirmPassword)
    //setStep(step + 1);
    // setIsEnabledNext(false);

  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleCloseTerms = () => setShowTerms(false);
  const handleShowTerms = () => setShowTerms(true);

  const handleClosePP = () => setShowPP(false);
  const handleShowPP = () => setShowPP(true);

  // const togglePasswordVisibility = () => {
  //   setPasswordVisible(!passwordVisible);
  // };

  const OnPlaceChanged = () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const geometry = place.geometry.location;
      const lat = geometry.lat();
      const lng = geometry.lng();

      // console.log(place.address_components);
      // Check if coordinates fall within specified bounds
      if (
        lat > -26.66253 ||
        lat < -26.72736 ||
        lng < 27.07885 ||
        lng > 27.1244
      ) {
        // Display error message
        // alert("The selected location is outside the supported area. Please choose a location within the specified boundaries.");
        toast.error(
          "The selected address is outside our supported area. Only Central Potchefstroom is covered at present."
        );
        // Reset the map and search results (optional)
        setCenter({ lat: -26.7145, lng: 27.097 });
        setZoom(14);
        //setSearchResult(null);
        // Clear the input text
        const inputToClear = document.querySelector("#searchInput");
        inputToClear.value = "";
        //setPlaceShow('')
        setFormattedAddress('');
        setUnit('');
        setBuilding('');
        setOptionalAddressInfo('');
        setAddressName('');
        setIsBlurAddress(false);
        setIsValidAddress(false);
        setIsBlurUnit(false);
        setIsValidUnit(false);
        // Add a subtle animation
        // inputToClear.classList.add("cleared");
        // setTimeout(() => {
        //   inputToClear.classList.remove("cleared");
        // }, 500); 
        // Adjust the timeout duration as needed
      } else {
        //setPlaceShow(place.formatted_address)
        setFormattedAddress(place.formatted_address);
        setUnit('');
        setBuilding('');
        setOptionalAddressInfo('');
        setIsBlurUnit(false);
        setIsValidUnit(false);
        //setPlaceShow(place.formatted_address)
        // Proceed with updating state and map as usual
        setCenter({ lat, lng });
        setZoom(16);
        // ... your existing code to update state and dispatch actions ...
        // Loop through address_components to extract specific information
        const { street_number, route, locality, sublocality, postal_code } =
          extractAddressComponents(place.address_components);

        // Update state and dispatch actions
        setAddressName(place.name);
        dispatch(updateFormattedAddress(place.formatted_address))
        dispatch(updateAddressName(place.name));
        dispatch(updateLat(lat));
        dispatch(updateLong(lng));
        dispatch(updateStreetNumber(street_number));
        dispatch(updateStreet(route));
        dispatch(updateSuburb(sublocality));
        dispatch(updateTown(locality));
        dispatch(updatePostalCode(postal_code));
        setIsValidAddress(true);

        //var streetForm = route
        const inputToClear = document.querySelector("#searchInput");
        inputToClear.value = "";
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
      } else if (
        component.types.includes("sublocality") ||
        component.types.includes("sublocality_level_1")
      ) {
        addressData.sublocality = component.long_name;
      } else if (component.types.includes("postal_code")) {
        addressData.postal_code = component.long_name;
      }
    });
    return addressData;
  };



  const handleSubmit = async (e) => {
    // Your form submission logic here
    if (!isValidTerms){
      //setIsBlurTerms(true);
    }

    if (isValidTerms){
    const newNoSpaceCellNuber = cellNumber.replace(/\s/g, "");
    dispatch(updateName(name));
    dispatch(updateSurname(surname));
    dispatch(updateEmail(email));
    dispatch(updateCellNumber(newNoSpaceCellNuber));
    dispatch(updatePassword(password));
    dispatch(updateEmailIsVerified("1"));
    dispatch(updateNumberIsVerified("0"));
    dispatch(updateTerms("1"));
    dispatch(updateUnit(unit));
    dispatch(updateBuilding(building));
    dispatch(updateOptionalAddressInfo(optionalAddressInfo));
    dispatch(updateMarketing(isMarketing));
    navigate('/validate')
    }
  
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded)
    return (
      <div style={{ display: "flex", justifyContent: "center" , paddingTop: '10px'}}>
        <Loader animation="border" />
      </div>
    );

  return (

<div className="py-2">
    <FormContainer>

{step === 1 && (
        <div>
      <h1>Register</h1>

      <Row className="py-3">
        <Col>
          Already have an account? <Link to={`/login`}>Login</Link>
        </Col>
      </Row>
      </div>
      )}

      <BootstrapForm onSubmit={handleSubmit}>

      <ProgressBar variant='warning' animated now={(step / 4) * 100} />

      {step === 1 && (
        <div>
        <BootstrapForm.Group className="mt-2" controlId="firstNameForm">
          <BootstrapForm.Label>
            Name&nbsp;
            {isValidName && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidName && isBlurName && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="text"
            name="firstNameForm"
            className="form-control"
            placeholder="Enter Name"
            value={name}
            onChange={handleNameChange}
            onBlur={handleNameBlur}
            required
            style={{
              border: isValidName
                ? "1px solid #198754"
                : !isValidName && isBlurName
                ? "1px solid #ea868f"
                : "",
            }}
          />
        </BootstrapForm.Group>
        {!isValidName && isBlurName ? (
          <span className="error-message">Please enter a valid Name</span>
        ) : null}


        <BootstrapForm.Group className="mt-2" controlId="surnameForm">
          <BootstrapForm.Label>
            Surname&nbsp;
            {isValidSurname && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidSurname && isBlurSurname && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="text"
            placeholder="Enter Surname"
            name="surnameForm"
            className="form-control"
            onChange={handleSurnameChange}
            value={surname}
            onBlur={handleSurnameBlur}
            required
           style={{
              border: isValidSurname
                ? "1px solid #198754"
                : !isValidSurname && isBlurSurname
                ? "1px solid #ea868f"
                : "",
            }}
          ></input>
        </BootstrapForm.Group>
        {!isValidSurname && isBlurSurname ? (
          <span className="error-message">Please enter a valid Surname</span>
        ) : null}

        <BootstrapForm.Group className="mt-2" controlId="emailForm">
          <BootstrapForm.Label>
          Email Address&nbsp;
            {isValidEmail && !isExistingEmail && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidEmail && isBlurEmail && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
            {isExistingEmail && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="email"
            name="emailForm"
            className="form-control"
            placeholder="Enter Email Address"
            value={email}
            onChange={handleEmailChange}
            onBlur={handleEmailBlur}
            required
            style={{
              border: isValidEmail
                ? "1px solid #198754"
                : !isValidEmail && isBlurEmail
                ? "1px solid #ea868f"
                : "",
            }}
          />
        </BootstrapForm.Group>
        {!isValidEmail && isBlurEmail ? (
          <div className="error-message">Please enter a valid Email</div>
        ) : null}
                {isExistingEmail ? (
          <div className="error-message">Email already registered</div>
        ) : null}
        

<BootstrapForm.Label className='mt-2' >Cellphone Number&nbsp;
            {isValidNumber && !isExistingNumber && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidNumber && isBlurCellNumber && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />  
            )}
            {isExistingNumber && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />  
            )}
            
            </BootstrapForm.Label>
<InputGroup  controlId='cellNumberForm' >
  <InputGroup.Text><img src={SouthAfricanFlagSVG} alt="South African Flag" style={{ width: '13px', height: 'auto' }} />&nbsp;+27</InputGroup.Text>
  <BootstrapForm.Control
      type='text'
      name='cellNumberForm'
      placeholder='E.g. 081 123 4567'
      value={cellNumber}
      onChange={handleCellNumberChange}
      onBlur={handleCellNumberBlur}
      required
      minLength='12'
      maxLength='12'
      style={{
        border: isValidNumber
          ? "1px solid #198754"
          : !isValidNumber && isBlurCellNumber
          ? "1px solid #ea868f"
          : "",
      }}
    ></BootstrapForm.Control>
</InputGroup>
{!isValidNumber && isBlurCellNumber ? (
          <div className="error-message">Please enter a valid Cellphone Number</div>
        ) : null} 

{isExistingNumber? (
          <div className="error-message">Cellphone Number already registered</div>
        ) : null} 




</div>
      )}
            {step === 2 && (
        <div>
<h1>Delivery Address</h1>

          {/* <BootstrapForm.Label>
          Delivery Address
          </BootstrapForm.Label> */}
{/* <div className="inputContainer"> */}
<Autocomplete onLoad={setSearchResult} onPlaceChanged={OnPlaceChanged}
bounds={{
  east: 27.12440,
  west: 27.07885,
  north: -26.66253,
  south: -26.72736,
}}
>

<BootstrapForm.Group className="my-2" controlId="searchAddress">
  {/* <input  type="text" name="searchAddress" placeholder="Search for a location" id="searchInput" required className="form-control"/> */}
  <ScrollToTopInput />
  </BootstrapForm.Group>
</Autocomplete>
<GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={center} options={options} onLoad={map => (mapRef.current = map)} className ="map">
<Marker // Use Marker instead of MarkerF
    position={center}
    icon={{
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Set the icon URL
    }}
  />
{/* <AdvancedMarker position={center} icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} map={mapRef.current} /> */}
  {/* <MarkerF position={center} icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} /> */}
  {/* <Polygon paths={[excludedBounds]} options={{ strokeColor: "#FF0000", strokeOpacity: 0.5, strokeWeight: 2 }} /> */}
</GoogleMap>
{/* </div> */}

{isValidAddress ? <strong>{formattedAddress}</strong> : <strong></strong>}

{/* {isValidAddress ? <strong>{placeShow}</strong> : <strong></strong>} */}

<BootstrapForm.Group className="mt-2" controlId="firstNameForm">
          <BootstrapForm.Label>
          Address Name&nbsp;
            {isValidAddress && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidAddress && isBlurAddress && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="text"
            name="AddressNameForm"
            className="form-control"
            placeholder='Address'
            value={addressName}
            onClick={() => document.getElementById("searchInput").focus()}
            readOnly
            style={{
              border: isValidAddress
                ? "1px solid #198754"
                : ''
            }}
          />
        </BootstrapForm.Group>
        {!isValidAddress && isBlurAddress ? (
          <span className="error-message">Please search for a valid Address</span>
        ) : null}


        <BootstrapForm.Group className="mt-2" controlId="unitForm">
          <BootstrapForm.Label>
          Unit / Floor / Apartment&nbsp;
            {isValidUnit && (
              <FaCheckCircle style={{ color: "green", marginLeft: "5px" }} />
            )}
            {!isValidUnit && isBlurUnit && (
              <FaTimesCircle style={{ color: "red", marginLeft: "5px" }} />
            )}
          </BootstrapForm.Label>
          <input
            type="text"
            name="unitForm"
            className="form-control"
            placeholder="E.g. 102"
            value={unit}
            onChange={handleUnitChange}
            onBlur={handleUnitBlur}
            required
            style={{
              border: isValidUnit
                ? "1px solid #198754"
                : !isValidUnit && isBlurUnit
                ? "1px solid #ea868f"
                : "",
            }}
          />
        </BootstrapForm.Group>
        {!isValidUnit && isBlurUnit ? (
          <span className="error-message">Please enter a valid Unit / Floor / Apartment</span>
        ) : null}

<BootstrapForm.Group className="mt-2" controlId="buildingName">
          <BootstrapForm.Label>
          Building Name
          &nbsp;
    <span className='optional-label'>*Optional</span>
          </BootstrapForm.Label>
          <input
            type="text"
            name="buildingName"
            className="form-control"
            placeholder="E.g. Jongebrug"
            value={building}
            onChange={handleBuildingChange}
          />
        </BootstrapForm.Group>

        <BootstrapForm.Group className="mt-2" controlId="optionalAddressInfo">
          <BootstrapForm.Label>
          Additional Address Information
          &nbsp;
    <span className='optional-label'>*Optional</span>
          </BootstrapForm.Label>
          <input
            type="text"
            name="optionalAddressInfo"
            className="form-control"
            placeholder="Enter any Additional Address Information"
            value={optionalAddressInfo}
            onChange={handleOAIChange}
          />
        </BootstrapForm.Group>

        </div>
        )}
            {step === 3 && (
        <div>
         <h1>Password</h1>

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

</div>
      )}

{step === 4 && (
        <div>
          <h1>Maaltijd's Terms of Use & Privacy Policy</h1>
                    {/* <BootstrapForm.Label>
          Maaltijd's Terms of Use & Privacy Policy
          </BootstrapForm.Label> */}



            <FormGroup>
            <BootstrapForm.Label className="mr-2">By selecting "I Accept" you agree to the&nbsp;</BootstrapForm.Label>
              
              <a href="#" onClick={handleShowTerms}>
                Terms of Use
              </a>
              <BootstrapForm.Label className="mr-2">&nbsp;and the&nbsp;</BootstrapForm.Label>
              <a href="#" onClick={handleShowPP}>
                Privacy Policy
              </a>
              <BootstrapForm.Label className="mr-2">&nbsp;as well that you are at least 18 years of age. &nbsp;</BootstrapForm.Label>
            </FormGroup>

            <InputGroup className="mt-3 ">
              <FormCheck
                type="switch"
                id="termsCheckbox"
                label="I Accept"
                checked={isValidTerms}
                onChange={handleCheckboxChange}
              />
                                {!isValidTerms  ? (
          <div className="error-message">&nbsp;*Required</div>
        ) : null}      
            </InputGroup>

            <FormGroup>
            <BootstrapForm.Label className="mr-2 mt-2">If you would like to receive the latest Special Offers, News and Info, select "I Agree" below&nbsp;</BootstrapForm.Label>
            </FormGroup>

            <InputGroup className="mt-2 ">
              <FormCheck
                type="switch"
                id="termsCheckbox"
                label="I Agree"
                checked={isCheckedMarketing}
                onChange={handleCheckboxMarketingChange}
              />     
            </InputGroup>




        <Modal show={showPP} onHide={handleClosePP}>
        <Modal.Header closeButton>
          <Modal.Title>Privacy Policy</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="privacy-policy">
  <h1>Privacy Policy for Maaltijd Food Ordering and Delivery Service</h1>
  <p>Last Updated: 30/01/2024</p>

  <p>
    Thank you for choosing Maaltijd for your food ordering and delivery needs.
    This Privacy Policy outlines how we collect, use, and protect your personal
    information in accordance with the Protection of Personal Information Act
    (POPIA) in South Africa.
  </p>

  <h2>1. Information We Collect</h2>

  <p>
    We collect the following personal information from users for the purpose of
    providing our food ordering and delivery services:
  </p>

  <ul>
    <li>
      Name and Surname: To personalize your experience and address you
      appropriately.
    </li>
    <li>Address: To facilitate the delivery of your food orders.</li>
    <li>Cellphone Number: To contact you for order updates and delivery purposes.</li>
    <li>Email Address: To communicate order confirmations, promotions, and other
      service-related information.</li>
  </ul>

  <h2>2. How We Use Your Information</h2>

  <p>
    We use the collected information solely for the purpose of delivering food
    orders to you and improving our services. Specifically, we may use your
    information for:
  </p>

  <ul>
    <li>Confirming and processing your food orders.</li>
    <li>Communicating order status, delivery updates, and promotions.</li>
    <li>Ensuring the accuracy and efficiency of our delivery services.</li>
  </ul>

  <h2>3. Information Security</h2>

  <p>
    We are committed to ensuring the security and confidentiality of your personal
    information. We implement reasonable security measures to protect against
    unauthorized access, disclosure, alteration, or destruction of your data.
  </p>

  <h2>4. Third-Party Services</h2>

  <p>
    We may use third-party services to facilitate aspects of our business, such
    as payment processing and delivery logistics. These third parties are
    required to adhere to privacy and data protection standards consistent with
    this Privacy Policy.
  </p>

  <h2>5. Your Consent</h2>

  <p>
    By using our website and services, you consent to the collection and use of
    your personal information as described in this Privacy Policy.
  </p>

  <h2>6. Contact Information</h2>

  <p>
    If you have any questions or concerns about our Privacy Policy or the
    handling of your personal information, please contact us at:
  </p>

  <ul>
    <li>Maaltijd</li>
    <li>15 Leivoorlaan,</li>
    <li>Potchefstroom, 2351</li>
    <li>Email: info@maaltijd.co.za</li>
  </ul>

  <h2>7. Changes to the Privacy Policy</h2>

  <p>
    We reserve the right to update and modify this Privacy Policy at any time.
    Any changes will be effective immediately upon posting the updated Privacy
    Policy on our website.
  </p>

  <h2>8. Governing Law</h2>

  <p>
    This Privacy Policy is governed by the laws of South Africa and is subject
    to the jurisdiction of South African courts.
  </p>

  <p>Thank you for choosing Maaltijd for your food ordering and delivery needs.</p>
</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePP}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      <Modal show={showTerms} onHide={handleCloseTerms}>
        <Modal.Header closeButton>
          <Modal.Title>Terms of Use</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
      <h1>Maaltijd - Terms of Use</h1>
      <p>Thank you for choosing Maaltijd for your food ordering and delivery needs. By using our services, you agree to comply with the following Terms of Use:</p>

      <h2>1. Order Placement and Delivery Schedule:</h2>
      <p>1.1. Order Placement Deadline: Orders must be placed before 12:00 (noon) to qualify for next-day delivery.</p>
      <p>1.2. Delivery Days and Hours: Deliveries will be carried out from Monday to Friday between 08:00 and 17:00, and on Saturdays from 08:00 to 12:00. No deliveries will be made on Sundays.</p>

      <h2>2. Returns Policy:</h2>
      <p>2.1. Product Returns: Due to the nature of our products, we do not accept returns. However, if you believe a product does not meet our standards, please contact us at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a> promptly. We will conduct an inspection and issue a refund for any sub-standard products. No refund will be provided if it is determined that the food's quality was affected by improper consumer handling.</p>

      <h2>3. Collection Responsibilities:</h2>
      <p>3.1. Address Accuracy: Please ensure that the provided delivery address is accurate and that someone is available to collect the food at the specified location.</p>
      <p>3.2. Collection Timeframe: Failure to collect the food within a reasonable timeframe will result in the order being considered as your loss. If the initial delivery is unsuccessful, we will attempt one additional free delivery on the next delivery day. Subsequent attempts will incur additional charges, and arrangements can be made via contact at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>

      <h2>4. Food Storage Recommendations:</h2>
      <p>4.1. Refrigeration: It is recommended to refrigerate any food intended for consumption within the next day or two.</p>
      <p>4.2. Freezing: For food intended to be consumed after two days, please freeze and defrost as needed.</p>

      <h2>5. Consumer Risk and Liability:</h2>
      <p>5.1. Consumption Risk: While Maaltijd maintains the highest standards in ingredients, food preparation, and handling, the consumption of Maaltijd products is at your own risk.</p>
      <p>5.2. Liability Disclaimer: Maaltijd will not be liable for any sickness or death resulting from the consumption of any Maaltijd product.</p>

      <h2>6. General Provisions</h2>
      <p>6.1 Intellectual Property: All content on the Maaltijd platform, including but not limited to text, graphics, logos, and images, is the property of Maaltijd and is protected by copyright and other intellectual property laws.</p>
      <p>6.2 Privacy Policy: Your use of the Services is also governed by our Privacy Policy.</p>
      <p>6.3 Modifications: Maaltijd reserves the right to modify, suspend, or terminate the Services or these Terms of Use at any time. Users will be notified of significant changes.</p>
      <p>6.4 Contact Information: For any inquiries or assistance, please contact us at <a href="mailto:info@maaltijd.co.za">info@maaltijd.co.za</a>.</p>

      <p>By using Maaltijd's Services, you agree to these Terms of Use. If you do not agree with any part of these terms, please refrain from using our Services.</p>
    </div>


        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseTerms}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


</div>
      )}


        {/* {isLoading && <Loader />} */}




<div className={step === 1 ? "d-flex justify-content-end mt-3" : "d-flex justify-content-between mt-3"} >
  {step > 1 && (
    <Button variant="secondary" style={{backgroundColor: '#DAA927', borderColor: '#DAA927'}} onClick={handlePrevious}>
      Previous
    </Button>
  )}
  {step < 4 ? (
    <Button
      variant="primary"
      onClick={handleNext}
      style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}
    >
      Next
    </Button>

  ) : (
    <Button variant="primary" type="submit" disabled={!isValidTerms}  style={{backgroundColor: '#1F305E',  borderColor: '#1F305E'}}>
     
      Submit
    </Button>
  )}
</div>


      </BootstrapForm>

    </FormContainer>
    </div>

  );
};

export default RegisterScreen;
