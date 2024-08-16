import express from 'express';
import {
    createInitialOrder,
    updateOrder,
    createOrderItem,
    createPaidOrder,
    getUserOrders,
    getOrderItems,
    getOrderDetails,
    createStatusLog,
    updateStatusLog,
    getPaidOrderDetails,
    getTransactionStatus,
    getOrderID,
    getPaidOrderDetailsByMerchant
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createOrder', createInitialOrder);
router.route('/updateOrder').put(protect, updateOrder);
router.route('/createOrderItem').post(protect, createOrderItem);
router.route('/userOrders').post(protect, getUserOrders);
router.route('/createPaidOrder').post(protect, createPaidOrder);
router.route('/orderItems').post(protect, getOrderItems);
router.route('/orderdetails').post(protect, getOrderDetails);
router.route('/createStatus').post(protect, createStatusLog);
router.route('/updateStatus').post(protect, updateStatusLog);
router.route('/paidorderdetails').post(protect, getPaidOrderDetails);
router.route('/transactionstatus').post(protect, getTransactionStatus);
router.route('/getorderID').post(protect, getOrderID);
router.route('/paidorderdetailsbymtid').post(protect, getPaidOrderDetailsByMerchant);




export default router;