import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import { useMemo } from "react";
import "../styles/Map.css"
// import dotenv from 'dotenv';
// dotenv.config();


const Map = () => {
  const { isLoaded } = useLoadScript({
    //googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    //googleMapsApiKey: "AIzaSyBaaeYWTKUm-ifLJXGZ1kcHmp6SnB7hyKA"
    googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY
  });
  const center = useMemo(() => ({ lat: -26.7145, lng: 27.0970 }), []);

  const options = {
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  };

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          options={options}
          center={center}
          zoom={14}
        >
          <MarkerF position={{ lat: -26.7145, lng: 27.0970 }}
          icon={"http://maps.google.com/mapfiles/ms/icons/red-dot.png"} />
        </GoogleMap>
      )}
    </div>
  );
};

export default Map;