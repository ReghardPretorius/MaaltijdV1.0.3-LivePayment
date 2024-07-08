import { useState, useEffect } from "react";
import FormContainer from "../components/FormContainer";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import "bootstrap-icons/font/bootstrap-icons.css";
import Spinner from "react-bootstrap/Spinner";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import SouthAfricanFlagSVG from "../assets/south-africa-flag-icon.svg";
import { Form as BootstrapForm,  Modal  } from "react-bootstrap";
import { useCellnumberExistsForOtherUsersMutation } from "../slices/usersApiSlice";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from '../slices/authSlice';

import { Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';

import "../styles/Map.css";
import "../styles/Autocomplete.css";
import "../styles/Register.css";
import "../styles/UpdateProfile.css";


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

  const handleArrowClick = () => {
    navigate('/user');
  };
  

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
        setIsExistingCellNumber(false); // Set state to indicate email doesn't exist
      }
    })();
  }, [cellNumber]);

  


  const handleNameChange = (e) => {
    const newName = e.target.value.replace(/\d/g, "");
    setName(newName);
    const isValid = newName.length >= 1 ;

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

    const isValid = newSurname.length >= 1;

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
      {/* <h1>Profile</h1> */}
      {/* <Row >
        <span>
          <div className="justify-content-left"><FaArrowLeft /></div>
          <div className="justify-content-center"><h1 className="text-center">Profile</h1></div>
        </span>
        </Row> */}
        {/* <Col className="justify-content-left">
          <FaArrowLeft />
        </Col>
        <Col className="justify-content-center">
          <h1 className="text-center">Profile</h1>
        </Col> */}
<div className="d-flex align-items-center mb-3">
  <div className="arrow">
    <FaArrowLeft onClick={handleArrowClick} />
  </div>
  <div className="profile flex-grow-1">
    <h1 className="text-center my-auto">Profile</h1>
  </div>
</div>




      


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

    </div>
  );
};

export default UpdateProfile;