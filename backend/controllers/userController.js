import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Address from '../models/addressModel.js';
import generateToken from '../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      cellNumber: user.cellNumber,
      email: user.email,
      addressName: user.addressName,
      lat: user.lat, 
      long: user.long, 
      town: user.town, 
      suburb: user.suburb, 
      street: user.street, 
      streetNumber: user.streetNumber, 
      postalCode: user.postalCode,
      unit: user.unit, 
      building: user.building, 
      optionalAddressInfo: user.optionalAddressInfo,
      formattedAddress: user.formattedAddress,
      wallet: user.wallet,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  const { name, surname, email, cellNumber, password, emailIsVerified, numberIsVerified, terms, addressName, lat, long, town, suburb, street, streetNumber, postalCode, unit, building, optionalAddressInfo, formattedAddress , marketing, walletInitial} = req.body;
  const wallet = Number(walletInitial);

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    surname,
    email,
    cellNumber,
    password,
    emailIsVerified,
    numberIsVerified,
    terms,
    addressName, 
    lat, 
    long, 
    town, 
    suburb, 
    street, 
    streetNumber, 
    postalCode, 
    unit, 
    building, 
    optionalAddressInfo,
    formattedAddress,
    marketing,
    wallet
  });

  if (user) {
    generateToken(res, user._id);

    const address = await Address.create({
      userID: user._id ,
      addressName: user.addressName,
      lat: user.lat,
      long: user.long ,
      town: user.town ,
      suburb: user.suburb,
      street:  user.street ,
      streetNumber: user.streetNumber ,
      postalCode: user.postalCode ,
      unit: user.unit ,
      building: user.building ,
      optionalAddressInfo: user.optionalAddressInfo ,
      formattedAddress: user.formattedAddress
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      cellNumber: user.cellNumber,
      email: user.email,
      addressName: user.addressName,
      lat: user.lat, 
      long: user.long, 
      town: user.town, 
      suburb: user.suburb, 
      street: user.street, 
      streetNumber: user.streetNumber, 
      postalCode: user.postalCode,
      unit: user.unit, 
      building: user.building, 
      optionalAddressInfo: user.optionalAddressInfo,
      formattedAddress: user.formattedAddress,
      wallet: user.wallet,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      cellNumber: user.cellNumber,
      emailIsVerified: user.emailIsVerified,
      numberIsVerified: user.numberIsVerified,
      terms: user.terms,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    See if email exist
// @route   GET /api/users/profile
// @access  Private
const getUserEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const userExists = await User.findOne({ email });

  if (userExists) {
    //const user = await User.findByEmail(email);
    res.status(201).json({
      _id: userExists._id,
      email: userExists.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }

});


// @desc    See if email exist for Register
// @route   GET /api/users/emailExists
// @access  Private
const getEmailExits = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const userExists = await User.findOne({ email });

  if (userExists) {
    //const user = await User.findByEmail(email);
    res.status(201).json({
      // email: userExists.email,
      message: '1',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }

});


// @desc    See if cell number exist for Register
// @route   GET /api/users/cellnumberExists
// @access  Private
const getCellNumberExits = asyncHandler(async (req, res) => {
  
  const  cellnumber  = req.body.noSpaceCellNumber;
  const cellNumber = cellnumber;
  const userExists = await User.findOne({ cellNumber });

  if (userExists) {
    //const user = await User.findByEmail(email);
    res.status(201).json({
      // cellNumber: userExists.cellNumber,
      message: '1',
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }

});




// @desc    See if cell number exist for Register
// @route   GET /api/users/cellnumberExistsForOtherUser
// @access  Private
const getCellNumberExitsForOtherUser = asyncHandler(async (req, res) => {
  const  cellnumber  = req.body.cellnumber;
  const cellNumber = cellnumber;
  const _id = req.body;

  try {
    const userExistsWithDifferentId = await User.findOne({ cellNumber, _id: { $ne: _id } }); // Find a user with the same cell number but a different _id

    if (userExistsWithDifferentId) {
      res.status(201).json({
        message: 'Cell number exists for a different user',
        code: '201'
        // Optionally include userExistsWithDifferentId._id to reveal the other user's _id
      });
    } else {
      res.status(200).json({ message: 'Cell number does not exist for other users' ,
      code: '200' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking cell number existence' ,
    code: '500'}); // Handle potential errors gracefully
  }
});



// @desc    Update user password
// @route   PUT /api/users/updatepassword
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
   // user._id = req.body._id || user._id;
    user.email = req.body.email || user.email;
    user.password = req.body.password;

    const updatedUser = await user.save();
    generateToken(res, user._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      surname: updatedUser.surname,
      cellNumber: updatedUser.cellNumber,
      //emailIsVerified: user.emailIsVerified,
      //numberIsVerified: user.numberIsVerified,
      //terms: user.terms,
      addressName: updatedUser.addressName, 
      lat: updatedUser.lat, 
      long: updatedUser.long, 
      town: updatedUser.town, 
      suburb: updatedUser.suburb, 
      street: updatedUser.street, 
      streetNumber: updatedUser.streetNumber, 
      postalCode: updatedUser.postalCode,
      unit: updatedUser.unit, 
      building: updatedUser.building, 
      optionalAddressInfo: updatedUser.optionalAddressInfo,
      formattedAddress: updatedUser.formattedAddress
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/updateaddress
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
   // user._id = req.body._id || user._id;
    user.name = req.body.name || user.name;
    user.surname = req.body.surname || user.surname;
    user.cellNumber = req.body.noSpaceCellNumber || user.cellNumber;    

    const updatedUser = await user.save();
    generateToken(res, user._id);

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      surname: updatedUser.surname,
      cellNumber: updatedUser.cellNumber,
      //emailIsVerified: user.emailIsVerified,
      //numberIsVerified: user.numberIsVerified,
      //terms: user.terms,
      addressName: updatedUser.addressName, 
      lat: updatedUser.lat, 
      long: updatedUser.long, 
      town: updatedUser.town, 
      suburb: updatedUser.suburb, 
      street: updatedUser.street, 
      streetNumber: updatedUser.streetNumber, 
      postalCode: updatedUser.postalCode,
      unit: updatedUser.unit, 
      building: updatedUser.building, 
      optionalAddressInfo: updatedUser.optionalAddressInfo,
      formattedAddress: updatedUser.formattedAddress
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


// @desc    Update user address
// @route   PUT /api/users/updateprofile
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);

  if (user) {
   user._id = req.body._id || user._id;
   user.addressName = req.body.addressName ;
   user.lat = req.body.lat ;
   user.long = req.body.long ;
   user.town = req.body.town ;
   user.suburb = req.body.suburb ;
   user.street = req.body.street ;
   user.streetNumber = req.body.streetNumber ;
   user.postalCode = req.body.postalCode ;
   user.unit = req.body.unit ;
   user.building = req.body.building ;
   user.optionalAddressInfo = req.body.optionalAddressInfo ;
   user.formattedAddress = req.body.formattedAddress ;

   // user.name = req.body.name || user.name;
   // user.surname = req.body.surname || user.surname;
   // user.cellNumber = req.body.noSpaceCellNumber || user.cellNumber;    

    const updatedUser = await user.save();
    //generateToken(res, user._id);
    const address = await Address.create({
      userID: user._id ,
      addressName: user.addressName,
      lat: user.lat,
      long: user.long ,
      town: user.town ,
      suburb: user.suburb,
      street:  user.street ,
      streetNumber: user.streetNumber ,
      postalCode: user.postalCode ,
      unit: user.unit ,
      building: user.building ,
      optionalAddressInfo: user.optionalAddressInfo ,
      formattedAddress: user.formattedAddress
    });

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      surname: updatedUser.surname,
      cellNumber: updatedUser.cellNumber,
      //emailIsVerified: user.emailIsVerified,
      //numberIsVerified: user.numberIsVerified,
      //terms: user.terms,
      addressName: updatedUser.addressName, 
      lat: updatedUser.lat, 
      long: updatedUser.long, 
      town: updatedUser.town, 
      suburb: updatedUser.suburb, 
      street: updatedUser.street, 
      streetNumber: updatedUser.streetNumber, 
      postalCode: updatedUser.postalCode,
      unit: updatedUser.unit, 
      building: updatedUser.building, 
      optionalAddressInfo: updatedUser.optionalAddressInfo,
      formattedAddress: updatedUser.formattedAddress
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  getUserEmail,
  updateUserProfile,
  updateUserPassword,
  getEmailExits,
  getCellNumberExits,
  getCellNumberExitsForOtherUser,
  updateProfile,
  updateAddress,
};