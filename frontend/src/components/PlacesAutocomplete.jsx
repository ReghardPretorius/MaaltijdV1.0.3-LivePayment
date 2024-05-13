import React, { useState, useEffect } from "react";
import { Autocomplete, useLoadScript, GoogleMap, MarkerF, Polygon } from "@react-google-maps/api";
import "../styles/Map.css";
import "../styles/Autocomplete.css";
import { useSelector, useDispatch } from 'react-redux';
// import { updateTown, updateSuburb, updateStreet, updateStreetNumber, updatePostalCode, updateLat, updateLong } from '../slices/addressSlice'; // Import your action creators
import { updateAddressName, updateLat, updateLong, resetAddress, updateTown, updateSuburb, updateStreet, updateStreetNumber, updatePostalCode } from '../slices/autocompleteSlice';
import { set } from "mongoose";

const libraries = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "400px",
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

function PlacesAutocomplete() {
// const town = useSelector(state => state.userAddress.town);
// const suburb = useSelector(state => state.userAddress.suburb);
// const street = useSelector(state => state.userAddress.street);
const name = useSelector(state => state.userAutocomplete.name);
const addressComponent = useSelector(state => state.userAutocomplete.addressComponent);
const lat = useSelector(state => state.userAutocomplete.lat);
const long = useSelector(state => state.userAutocomplete.long);

const dispatch = useDispatch();

const [newTown, setNewTown] = useState('');
const [newSuburb, setNewSuburb] = useState('');
const [newStreet, setNewStreet] = useState('');
const [newStreetNumber, setNewStreetNumber] = useState('');
const [newPostalCode, setNewPostalCode] = useState('');
const [newName, setNewName] = useState('');
const [newaddressComponent, setNewaddressComponent] = useState('');
const [newLat, setNewLat] = useState('');
const [newLong, setNewLong] = useState('');


// console.log(process.env.MONGO_URI);

  const [width, setWidth] = useState(window.innerWidth);
  const [center, setCenter] = useState({ lat: -26.7145, lng: 27.0970 });
  const [zoom, setZoom] = useState(14);
  const [searchResult, setSearchResult] = useState(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBaaeYWTKUm-ifLJXGZ1kcHmp6SnB7hyKA",
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
  
    window.addEventListener("resize", handleResize);
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // const mapContainerStyle = {
  //   width: "100%",
  //   height: width > 768 ? "600px" : "300px", // adjust height based on screen size
  // };

  const onPlaceChanged = () => {
    if (searchResult != null) {
      const place = searchResult.getPlace();
      const geometry = place.geometry.location;
      // const town = place.address_components[3]["long_name"];
      // const suburb = place.address_components[2]["long_name"];
      // const street = place.address_components[1]["long_name"];
      // const streetNumber = place.address_components[0]["long_name"];
      // const postalCode = place.address_components[7]["long_name"];
      // console.log(place.address_components);
      // console.log(town);
      // console.log(suburb);
      // console.log(street);
      // console.log(streetNumber);
      // console.log(postalCode);
      // console.log(geometry.lat());
      // console.log(geometry.lng());

      const lat = geometry.lat();
      const lng = geometry.lng();


// Check if coordinates fall within specified bounds
if ((lat > -26.66253) || (lat < -26.72736) || (lng < 27.07885) || (lng > 27.12440)) {
  // Display error message
  alert("The selected location is outside the supported area. Please choose a location within the specified boundaries.");
  // Reset the map and search results (optional)
  setCenter({ lat: -26.7145, lng: 27.0970 });
  setZoom(14);
  setSearchResult(null);
  // Clear the input text
  const input = document.querySelector('input');
  input.value = '';

  // Add a subtle animation
  input.classList.add('cleared');
  setTimeout(() => {
    input.classList.remove('cleared');
  }, 500); // Adjust the timeout duration as needed
} else {
  // Proceed with updating state and map as usual
  setCenter({ lat, lng });
  setZoom(16);
  // ... your existing code to update state and dispatch actions ...
      // Loop through address_components to extract specific information
  const { street_number, route, locality, sublocality, postal_code } = extractAddressComponents(place.address_components);

  // console.log(street_number);
  // console.log(route);
  // console.log(locality);
  // console.log(sublocality);

  // Update state and dispatch actions
  setNewName(place.name);
  setNewLat(lat);
  setNewLong(lng);
  setNewStreetNumber(street_number);
  setNewStreet(route);
  setNewSuburb(sublocality);
  setNewTown(locality);
  setNewPostalCode(postal_code);

  dispatch(updateAddressName(place.name));
  dispatch(updateLat(lat));
  dispatch(updateLong(lng));
  dispatch(updateStreetNumber(street_number));
  dispatch(updateStreet(route));
  dispatch(updateSuburb(sublocality));
  dispatch(updateTown(locality));
  dispatch(updatePostalCode(postal_code));

  // dispatch(updateStreetNumber(street_number));
  // dispatch(updateStreet(route));
  // dispatch(updateSuburb(sublocality));
  // dispatch(updateTown(locality));




}

      // setNewName(place.name);
      // setNewaddressComponent(place.address_components);
      // setNewLat(lat);
      // setNewLong(lng);

      // // dispatch(updateTown(town));
      // // dispatch(updateSuburb(suburb));
      // // dispatch(updateStreet(street));
      // dispatch(updateName(place.name));
      // dispatch(updateAddressComponent(place.address_components));
      // dispatch(updateLat(lat));
      // dispatch(updateLong(lng));


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
    } else if (component.types.includes("sublocality")) {
      addressData.sublocality = component.long_name;
    } else if (component.types.includes("postal_code")) {
      addressData.postal_code = component.long_name;
    }
  });
  return addressData;
};

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading maps";

  return (
    <div className="inputContainer">
      <Autocomplete onLoad={setSearchResult} onPlaceChanged={onPlaceChanged}
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
        <input  type="text" placeholder="Search for a location" />
      </Autocomplete>
      <GoogleMap mapContainerStyle={mapContainerStyle} zoom={zoom} center={center} options={options} className ="map">
      {/* <GoogleMap zoom={zoom} center={center} options={options} className ="map"> */}
        <MarkerF position={center} icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} />
        <Polygon paths={[excludedBounds]} options={{ strokeColor: "#FF0000", strokeOpacity: 0.5, strokeWeight: 2 }} />
      </GoogleMap>
    </div>
  );
}

export default PlacesAutocomplete;
