import { useState, useEffect } from "react";
import {
  Autocomplete,
  useLoadScript,
  GoogleMap,
  MarkerF,
} from "@react-google-maps/api";
import FormContainer from "../components/FormContainer";
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from '../components/Loader';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { setCredentials } from "../slices/authSlice";
import {
  updateAddressName,
  updateLat,
  updateLong,
  updateTown,
  updateSuburb,
  updateStreet,
  updateStreetNumber,
  updatePostalCode,
} from "../slices/autocompleteSlice";
import { Form as BootstrapForm } from "react-bootstrap";
import {  useUpdateAddressMutation } from "../slices/usersApiSlice";

import "../styles/Map.css";
import "../styles/Autocomplete.css";
import "../styles/Register.css";
import "../styles/address.css"


const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "200px",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

// const excludedBounds = [
//   { lat: -26.66253, lng: 27.07885 },
//   { lat: -26.66253, lng: 27.1244 },
//   { lat: -26.72736, lng: 27.1244 },
//   { lat: -26.72736, lng: 27.07885 },
// ];

const EditAddressScreen = () => {
  const [addressName, setAddressName] = useState("");
  const [unit, setUnit] = useState("");
  const [building, setBuilding] = useState("");
  const [optionalAddressInfo, setOptionalAddressInfo] = useState("");
  const [town, setTown] = useState("");
  const [suburb, setSuburb] = useState("");
  const [street, setStreet] = useState("");
  const [streetNumber, setstreetNumber] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");

  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isValidUnit, setIsValidUnit] = useState(true);

  const [isBlurUnit, setIsBlurUnit] = useState(true);
  const [isBlurAddress, setIsBlurAddress] = useState(true);

  // const [width, setWidth] = useState(window.innerWidth);
  //const [center, setCenter] = useState({ lat: -26.7145, lng: 27.097 });
  const [zoom, setZoom] = useState(14);
  const [searchResult, setSearchResult] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaaeYWTKUm-ifLJXGZ1kcHmp6SnB7hyKA",
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const _id = useSelector((state) => state.auth.userInfo._id);
  const OGaddressName = useSelector((state) => state.auth.userInfo.addressName);
  const OGtown = useSelector((state) => state.auth.userInfo.town);
  const OGsuburb = useSelector((state) => state.auth.userInfo.suburb);
  const OGstreet = useSelector((state) => state.auth.userInfo.street);
  const OGstreetNumber = useSelector((state) => state.auth.userInfo.streetNumber);
  const OGpostalCode = useSelector((state) => state.auth.userInfo.postalCode);
  const OGunit = useSelector((state) => state.auth.userInfo.unit);
  const OGbuilding = useSelector((state) => state.auth.userInfo.building);
  const OGOAI = useSelector((state) => state.auth.userInfo.optionalAddressInfo);
  const OGlat = useSelector((state) => state.auth.userInfo.lat);
  const OGlong = useSelector((state) => state.auth.userInfo.long);
  const OGformattedAddress = useSelector((state) => state.auth.userInfo.formattedAddress);

  const [updateAddress, { isLoadingUpdateAddress }] = useUpdateAddressMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [center, setCenter] = useState({ lat: -26.7145, lng: 27.097 });

  useEffect(() => {
    let stringLat = userInfo.lat;
    let stringLong = userInfo.long;
    if (!isNaN(stringLat) && !isNaN(stringLong)) {
      let latLng = { lat: parseFloat(stringLat), lng: parseFloat(stringLong) };
      setCenter(latLng); // Assuming setCenter expects a LatLng or LatLngLiteral object

  }
  
    setZoom(16);
  }, [userInfo]);
  
  useEffect(() => {
    setAddressName(OGaddressName);
  }, [OGaddressName]);

  useEffect(() => {
    setTown(OGtown);
  }, [OGtown]);

  useEffect(() => {
    setSuburb(OGsuburb);
  }, [OGsuburb]);

  useEffect(() => {
    setStreet(OGstreet);
  }, [OGstreet]);

  useEffect(() => {
    setstreetNumber(OGstreetNumber);
  }, [OGstreetNumber]);

  useEffect(() => {
    setPostalCode(OGpostalCode);
  }, [OGpostalCode]);

  useEffect(() => {
    setUnit(OGunit);
  }, [OGunit]);

  
  useEffect(() => {
    setBuilding(OGbuilding);
  }, [OGbuilding]);

  useEffect(() => {
    setOptionalAddressInfo(OGOAI);
  }, [OGOAI]);

  useEffect(() => {
    setLat(OGlat);
  }, [OGlat]);

  useEffect(() => {
    setLong(OGlong);
  }, [OGlong]);

  useEffect(() => {
    setFormattedAddress(OGformattedAddress);
  }, [OGformattedAddress]);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setWidth(window.innerWidth);
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);



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

  const handleBuildingChange = (e) => {
    let newBuilding = e.target.value;
    setBuilding(newBuilding);
  }

  const handleOAIChange = (e) => {
    let newOAI = e.target.value;
    setOptionalAddressInfo(newOAI);
  }

  const OnPlaceChanged = () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const geometry = place.geometry.location;
      const lat = geometry.lat();
      const lng = geometry.lng();
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
        setSearchResult(null);
        // Clear the input text
        const inputToClear = document.querySelector("#searchInput");
        inputToClear.value = "";

        // Add a subtle animation
        inputToClear.classList.add("cleared");
        setTimeout(() => {
          inputToClear.classList.remove("cleared");
        }, 500); // Adjust the timeout duration as needed
      } else {
        // setPlaceShow(place.formatted_address)
        setFormattedAddress(place.formatted_address);
        setUnit('');
        setBuilding('');
        setOptionalAddressInfo('');
        setIsBlurUnit(false);
        setIsValidUnit(false);
        // Proceed with updating state and map as usual
        setCenter({ lat, lng });
        setZoom(16);
        // ... your existing code to update state and dispatch actions ...
        // Loop through address_components to extract specific information
        const { street_number, route, locality, sublocality, postal_code } =
          extractAddressComponents(place.address_components);

        // Update state and dispatch actions
        setAddressName(place.name);

        updateAddressName(place.name);
        updateLat(lat);
        updateLong(lng);
        updateStreetNumber(street_number);
        updateStreet(route);
        updateSuburb(sublocality);
        updateTown(locality);
        updatePostalCode(postal_code);
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
    e.preventDefault();
    if (isValidAddress && isValidUnit){
      try {
        const res = await updateAddress({ _id, addressName, lat, long, town, suburb, street, streetNumber, postalCode, unit, building, optionalAddressInfo, formattedAddress }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate('/');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    } 

  };

  if (loadError) return "Error loading maps";
  if (!isLoaded)
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: '10px' }}>
        <Loader animation="border" />
      </div>
    );

  return (
<div className="addresslayout">
<div style={{paddingTop: '10px', paddingBottom:'60px'}}>
    <FormContainer >

      <BootstrapForm onSubmit={handleSubmit}>


<h1>Change Delivery Address</h1>

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
  <input  type="text" name="searchAddress" placeholder="Search for a location" id="searchInput"  className="form-control"/>
  </BootstrapForm.Group>
</Autocomplete>
<GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={center} options={options} className ="map">
  <MarkerF position={center} icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} />
  {/* <Polygon paths={[excludedBounds]} options={{ strokeColor: "#FF0000", strokeOpacity: 0.5, strokeWeight: 2 }} /> */}
</GoogleMap>
{/* </div> */}

{isValidAddress ? <strong>{formattedAddress}</strong> : <strong></strong>}

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



<div className={"d-flex justify-content-between mt-3"} >
    <Button style={{backgroundColor: '#1F305E'}} variant="primary" type="submit" disabled={(OGaddressName === addressName) && (OGunit === unit)}>
      Change
    </Button>
</div>


      </BootstrapForm>

    </FormContainer>
    </div>
    </div>

  );
};

export default EditAddressScreen;
