import express from 'express';
import {postPaymentController, manualPostPaymentAllWallet } from "../controllers/postPaymentController.js"

const router = express.Router();

router.post("/query", postPaymentController);
router.post("/manualallwallet", manualPostPaymentAllWallet);

export default  router;