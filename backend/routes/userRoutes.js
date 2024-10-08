import express from 'express';
import {
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
  createWalletLog, 
  getUserWalletAmountLog,
  createTempWalletLog,
  getTempWalletLog
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.put('/updatepassword', updateUserPassword);
router.route('/updateprofile').put(protect, updateProfile);
router.route('/updateaddress').put(protect, updateAddress);
//router.put('/updateprofile', updateProfile);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.post('/findEmail', getUserEmail);
router.post('/emailExists', getEmailExits);
router.post('/cellnumberExists', getCellNumberExits);
router.post('/cellnumberExistsForOtherUser', getCellNumberExitsForOtherUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  router.route('/getwalletamount').post(protect, getUserWalletAmountLog);
  router.route('/createwalletlog').post(protect, createWalletLog);
  
router.route('/createtempwalletlog').post(protect, createTempWalletLog);
router.route('/gettempwalletlog').post(protect, getTempWalletLog);

export default router;
