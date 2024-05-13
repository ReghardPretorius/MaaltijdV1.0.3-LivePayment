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

export default router;
