// routes/emailRoutes.js

import express from 'express';
import { sendOrderEmail, sendAdminOrderEmail  } from '../controllers/emailOrderController.js';

const router = express.Router();

router.post('/sendOrder', sendOrderEmail);
router.post('/sendAdminOrder', sendAdminOrderEmail);


export default router;