import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addressName: '',
  lat: '',
  long: '',
  town: '',
  suburb: '',
  street: '',
  streetNumber: '',
  postalCode: '',
  unit: '',
  building: '',
  optionalAddressInfo:'',
  formattedAddress: '',

};

const autocompleteSlice = createSlice({
  name: 'userAutocomplete',
  initialState,
  reducers: {
    updateAddressName: (state, action) => {
        state.addressName = action.payload;
    },
    updateLat: (state, action) => {
        state.lat = action.payload;
    },
    updateLong: (state, action) => {
        state.long = action.payload;
    },
    updateTown: (state, action) => {
        state.town = action.payload;
    },
    updateSuburb: (state, action) => {
        state.suburb = action.payload;
    },
    updateStreet: (state, action) => {
        state.street = action.payload;
    },
    updateStreetNumber: (state, action) => {
        state.streetNumber = action.payload;
    },
    updatePostalCode: (state, action) => {
        state.postalCode = action.payload;
    },
    updateUnit: (state, action) => {
        state.unit = action.payload;
    },
    updateBuilding: (state, action) => {
        state.building = action.payload;
    },
    updateOptionalAddressInfo: (state, action) => {
        state.optionalAddressInfo = action.payload;
    },
    updateFormattedAddress: (state, action) => {
        state.formattedAddress = action.payload;
    },
    resetAddress: (state) => {
        state.addressName = '';
        state.lat = '';
        state.long= '';
        state.town = '';
        state.suburb = '';
        state.street = '';
        state.streetNumber = '';
        state.postalCode = '';
        state.unit = '';
        state.building = '';
        state.optionalAddressInfo = '';
        state.formattedAddress = '';
}
  }
});

export const { updateAddressName, updateLat, updateLong, resetAddress, updateTown, updateSuburb, updateStreet, updateStreetNumber,  updatePostalCode, updateUnit, updateBuilding, updateOptionalAddressInfo, updateFormattedAddress } = autocompleteSlice.actions;
export default autocompleteSlice.reducer;
