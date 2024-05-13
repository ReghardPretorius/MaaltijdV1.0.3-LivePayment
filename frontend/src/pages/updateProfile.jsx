import { useState, useEffect } from "react";
import {
  Autocomplete,
  useLoadScript,
  GoogleMap,
  MarkerF,
  Polygon,
} from "@react-google-maps/api";
import { Row, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import "bootstrap-icons/font/bootstrap-icons.css";
import Spinner from "react-bootstrap/Spinner";
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
} from "../slices/autocompleteSlice";
import { Nav } from 'react-bootstrap';
import { Form as BootstrapForm, ProgressBar , Modal, FormGroup, FormCheck  } from "react-bootstrap";
import { useCellnumberExistsForOtherUsersMutation } from "../slices/usersApiSlice";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from '../slices/authSlice';

import "../styles/Map.css";
import "../styles/Autocomplete.css";
import "../styles/Register.css";


import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';




const UpdateProfile = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [noSpaceCellNumber, setNoSpaceCellNumber] = useState("");


  const [isValidName, setIsValidName] = useState(false);
  const [isValidSurname, setIsValidSurname] = useState(false);


  const [isBlurName, setIsBlurName] = useState(false);
  const [isBlurSurname, setIsBlurSurname] = useState(false);
  const [isBlurCellNumber, setIsBlurCellNumber] = useState(false);
  const [isValidNumber, setIsValidNumber] = useState(false);

  const [errorUpdating, setErrorUpdating] = useState(false);
  const [isExistingNumber, setIsExistingCellNumber] = useState(false);

  const [showPP, setShowPP] = useState(false);
  const [showTerms, setShowTerms] = useState(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [cellnumberExists, { isLoadingCellnumberExits }] = useCellnumberExistsForOtherUsersMutation();
  const [updateProfile, { isLoadingUpdateProfile }] = useUpdateProfileMutation();

  const _id = useSelector((state) => state.auth.userInfo._id);
  const OGname = useSelector((state) => state.auth.userInfo.name);
  const OGsurname = useSelector((state) => state.auth.userInfo.surname);
  const OGcellNumber = useSelector((state) => state.auth.userInfo.cellNumber);

  const handleCloseTerms = () => setShowTerms(false);
  const handleShowTerms = () => setShowTerms(true);

  const handleClosePP = () => setShowPP(false);
  const handleShowPP = () => setShowPP(true);
  
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      //console.error(err);
    }
  };
  
  // setName(OGname);
  // setSurname(OGsurname);
  // setCellNumber(OGcellNumber);

  // useEffect(() => {
  //   setName(OGname);
  //   console.log(name);
  //   const nameRegex = /^[A-Za-z]+$/;
  //   const isValid = name.length >= 1 && nameRegex.test(name);
  //   console.log(isValid);
  //   // Update isValidName state based on name format
  //   setIsValidName(isValid);
  //   console.log(isValidName);
  // }, [OGname]);

  useEffect(() => {
    setName(OGname);
    const nameRegex = /^[A-Za-z]+$/;
    const isValid = OGname.length >= 1 && nameRegex.test(OGname);
    // Update isValidName state based on name format
    setIsValidName(isValid);
  }, [OGname]);

  useEffect(() => {
    setSurname(OGsurname);
    const nameRegex = /^[A-Za-z]+$/;
    const isValid = OGsurname.length >= 1 && nameRegex.test(OGsurname);

    // Update isValidName state based on name format
    setIsValidSurname(isValid);
  }, [OGsurname]);

  useEffect(() => {
    let inputNumber = OGcellNumber.replace(/\D/g, ""); // Remove non-numeric characters
    let nsCellNr = OGcellNumber.replace(/\s/g, "");
    setNoSpaceCellNumber(nsCellNr);
    let formattedNumber = "";

    if (nsCellNr.length === 10) {
      setIsValidNumber(true);
    } else {
      setIsValidNumber(false);
    }

    for (let i = 0; i < Math.min(inputNumber.length, 10); i++) {
      if (i === 3 || i === 6) {
        formattedNumber += " "; // Add space after the 3rd and 7th character
      }
      formattedNumber += inputNumber[i];
    }
    setCellNumber(formattedNumber);
  }, [OGcellNumber]);



  useEffect(() => {
    (async () => {
      const cellnumber = cellNumber.replace(/\s/g, "");
      setNoSpaceCellNumber(cellnumber)
      try {
        const resCellnumberExits = await cellnumberExists({ _id, cellnumber }).unwrap();
        if (resCellnumberExits.code === '200'){
          setIsExistingCellNumber(false);
        }
        else if (resCellnumberExits.code === '201'){
          setIsExistingCellNumber(true);
        } else if (resCellnumberExits.code === '500'){
          setErrorUpdating(true);
        }
      } catch (err) {
        //console.error('Error:', err); // Log the error for debugging
        setIsExistingCellNumber(false); // Set state to indicate email doesn't exist
      }
    })();
  }, [cellNumber]);

  


  const handleNameChange = (e) => {
    const newName = e.target.value.replace(/\d/g, "");
    setName(newName);

    // Regular expression to validate name format (only text characters)
    const nameRegex = /^[A-Za-z]+$/;
    const isValid = newName.length >= 1 && nameRegex.test(newName);

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
    const nameRegex = /^[A-Za-z]+$/;
    const isValid = newSurname.length >= 1 && nameRegex.test(newSurname);

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

  
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isValidName && isValidSurname  && isValidNumber && !isExistingNumber){
      // console.log("updating");
      try {
        const res = await updateProfile({ _id, name, surname, noSpaceCellNumber }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        console.log('Error')
        toast.error(err?.data?.message || err.error);
      }
    } 

  };




  if (isLoadingUpdateProfile)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px', paddingBottom:'60px' }}>
        <Spinner animation="border" />
      </div>
    );

  return (

<div style={{paddingTop: '10px', paddingBottom:'60px'}}>
    <FormContainer >
      <h1>Profile</h1>


      <BootstrapForm onSubmit={handleUpdateProfile}>

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

            

<div className={"d-flex justify-content-between mt-3"} >
<Button style={{backgroundColor: '#DAA927'}}  variant="secondary" href='/'>
      Cancel
    </Button>

    <Button  style={{backgroundColor: '#1F305E'}} variant="primary" type="submit" disabled={((name===OGname) && (surname===OGsurname) && (noSpaceCellNumber === OGcellNumber)) || errorUpdating}>
      Update
    </Button>
</div>


      </BootstrapForm>

    </FormContainer>

    <div className="mt-1 d-flex justify-content-end">
      <Button onClick={logoutHandler}>
        Logout
      </Button>
    </div>

    <div>
    <a href="#" onClick={handleShowTerms} style={{color: '1F305E'}}>
                Terms of Use
              </a>
    </div>

    <div className="mt-1">
    <a href="#" onClick={handleShowPP} style={{color: '1F305E'}}>
                Privacy Policy
              </a>
      </div>
              





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
  );
};

export default UpdateProfile;