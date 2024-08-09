import express from 'express';
import {postPaymentController } from "../controllers/postPaymentController.js"

const router = express.Router();

router.post("/query", postPaymentController);
export default  router;