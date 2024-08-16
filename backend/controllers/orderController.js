import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import OrderItem from '../models/orderItemModel.js';
import PaidOrder from '../models/paidOrderModel.js';
import OrderCounter from '../models/orderCounter.js';
import orderStatus from '../models/orderStatusLog.js';
import Address from '../models/addressModel.js';
import generateToken from '../utils/generateToken.js';
import moment from 'moment'
import TransactionLog from '../models/transactionLog.js';



// @desc    Create a new order
// @route   POST /api/users
// @access  Public
const createInitialOrder = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  const { userID } = req.body;

  // const counter = await OrderCounter.findById('invoiceNumber');
  // if (!counter) {
  //   await new OrderCounter({ _id: 'invoiceNumber', seq: 0 }).save();
  // }


  const getNextSequenceValue = async (sequenceName) => {
    const counter = await OrderCounter.findByIdAndUpdate(
      sequenceName,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    return counter.seq;
  };
  
  const formatInvoiceNumber = (seq) => {
    const paddedSeq = String(seq).padStart(6, '0'); // Ensure the sequence is at least 6 digits long
    return `MAA${paddedSeq}`;
  };


  const seq = await getNextSequenceValue('invoiceNumber');
  const invoiceNumber = formatInvoiceNumber(seq);
  const merchantTransactionId = invoiceNumber;


  const order = await Order.create({
    userID,
    merchantTransactionId
  });

  if (order) {
    res.status(201).json({
      _id: order._id,
      merchantTransactionId: order.merchantTransactionId
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.body.order._id);
    if (order) {

      // let dateUTC;
      // if (req.body.deliveryDate){
      //   dateUTC = new Date(req.body.deliveryDate + 'T00:00:00.000Z');
      // }
      // const localizedDate = moment.utc(dateUTC).local().format('YYYY-MM-DD HH:mm:ss');
      



        order.paymentSuccessful = req.body.paymentSuccessful || order.paymentSuccessful;
        order.totalPrice = req.body.totalPrice || order.totalPrice;
        order.deliveryLat = req.body.deliveryLat || order.deliveryLat;
        order.deliveryLong = req.body.deliveryLong || order.deliveryLong;
        order.deliveryAddress = req.body.deliveryAddress || order.deliveryAddress;
        //order.freeDelivery = req.body.freeDelivery || order.freeDelivery;
        order.totalQuantity = req.body.totalQuantity || order.totalQuantity;
        order.typesOfItems = req.body.typesOfItems || order.typesOfItems;
        order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
        order.shortAddress = req.body.shortAddress || order.shortAddress;
        order.status = req.body.status || order.status;
        order.deliveryFee = req.body.deliveryFee || order.deliveryFee;
        //order.merchantTransactionId = req.body.merchantTransactionId || order.merchantTransactionId;
        if (req.body.totalQuantity >= 3){
          order.freeDelivery = 'Yes'
        } else {
          order.freeDelivery = 'No'
        }
       
  
  
      const updatedOrder = await order.save();
  
      res.json({
        _id: updatedOrder._id,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  });


  // @desc    Create a new Order Item
// @route   POST /api/users
// @access  Public
const createOrderItem = asyncHandler(async (req, res) => {
    //const { name, email, password } = req.body;
    const { orderID, userID, orderItemCode, orderItemName, quantity, orderItemPrice, orderTotalPrice, deliveryDate, merchantTransactionId } = req.body;
    //const deliveryDate = new Date(deliveryDate1 + 'T00:00:00.000Z');
    const orderItem = await OrderItem.create({
        orderID,
        userID,
        orderItemCode,
        orderItemName,
        quantity,
        orderItemPrice,
        orderTotalPrice,
        deliveryDate,
        merchantTransactionId
    });
  
    if (orderItem) {
  
      res.status(201).json({
        _id: orderItem._id
      });
    } else {
      res.status(400);
      throw new Error('Invalid orderItem data');
    }
  });

  // @desc    Create a paid order
// @route   POST /api/users
// @access  Public
const createPaidOrder = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  const { userID, totalPrice, deliveryLat, deliveryLong , deliveryAddress, freeDelivery, totalQuantity, typesOfItems, deliveryDate, shortAddress , status, OGOrderID, merchantTransactionId, deliveryFee  } = req.body;
  const numberOfFailedDeliveryAttempts = 0;
  const rescheduled = "No";
  const existingOrder = await PaidOrder.findOne({ merchantTransactionId });
  
  if (!existingOrder) {


  const paidorder = await PaidOrder.create({
    userID,
    totalPrice,
    deliveryLat, 
    deliveryLong ,
    deliveryAddress, 
    freeDelivery, 
    totalQuantity, 
    typesOfItems, 
    deliveryDate ,
    shortAddress, 
    status, 
    OGOrderID,
    merchantTransactionId,
    numberOfFailedDeliveryAttempts,
    rescheduled,
    deliveryFee
  });

  if (paidorder) {
    res.status(201).json({
      _id: paidorder._id,
    });
  } else {
    res.status(400);
    throw new Error('Invalid data');
  }
}
});

  // @desc   Get all user orders
// @route   POST /api/users
// @access  Public

const getUserOrders = asyncHandler(async (req, res) => {
  const { userID } = req.body; // Assuming user ID is passed in the route parameters
  

  // Input validation (optional but recommended):
  if (!userID) {
    return res.status(400).json({ message: 'Missing required parameter: userID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const orders = await PaidOrder.find({ userID });

  if (orders) {
    res.status(200).json(orders);
  } else {
    res.status(404).json({ message: 'No orders found for this user' });
  }
});

  // @desc   Get all order items
// @route   POST /api/users
// @access  Public

const getOrderItems = asyncHandler(async (req, res) => {
  const { orderID } = req.body; // Assuming user ID is passed in the route parameters
  
  // Input validation (optional but recommended):
  if (!orderID) {
    return res.status(400).json({ message: 'Missing required parameter: userID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const orderItems = await OrderItem.find({ orderID });
  if (orderItems) {
    res.status(200).json(orderItems);
  } else {
    res.status(404).json({ message: 'No order items found for this order' });
  }
});

  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getOrderDetails = asyncHandler(async (req, res) => {
  const { orderID } = req.body; // Assuming user ID is passed in the route parameters
  const _id = orderID;
  // Input validation (optional but recommended):
  if (!_id) {
    return res.status(400).json({ message: 'Missing required parameter: orderID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await Order.find({ _id });
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});

  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getPaidOrderDetails = asyncHandler(async (req, res) => {
  const { orderID, userID } = req.body; // Assuming user ID is passed in the route parameters
  const OGOrderID = orderID;
  // Input validation (optional but recommended):
  if (!OGOrderID) {
    return res.status(400).json({ message: 'Missing required parameter: orderID' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await PaidOrder.findOne({ OGOrderID });
  if (order.userID === userID) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});

  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getPaidOrderDetailsByMerchant = asyncHandler(async (req, res) => {
  const { merchantTransactionId, userID } = req.body; // Assuming user ID is passed in the route parameters

  // Input validation (optional but recommended):
  if (!merchantTransactionId) {
    return res.status(400).json({ message: 'Missing required parameter: merchantTrasnactionId' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await PaidOrder.findOne({ merchantTransactionId });
  if(order){
    if (order.userID === userID) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: 'No order found for this order' });
    }
  } else {
    res.status(200).json({ message: 'No order' });
  }

});


  // @desc    Create a new Status log
// @route   POST /api/users
// @access  Public
const createStatusLog = asyncHandler(async (req, res) => {
  //const { name, email, password } = req.body;
  const { OGOrderID, userID, merchantTransactionId,status, orderPlacedTimestamp } = req.body;
  //const deliveryDate = new Date(deliveryDate1 + 'T00:00:00.000Z');
  const currentStatus = status;
  const orderstatus = await orderStatus.create({
    OGOrderID,
      userID,
      merchantTransactionId,
      currentStatus,
      orderPlacedTimestamp
  });

  if (orderstatus) {

    res.status(201).json({
      _id: orderItem._id
    });
  } else {
    res.status(400);
    throw new Error('Invalid order status data');
  }
});


// @desc    Update Status Log
// @route   PUT /api/users/profile
// @access  Private

/// FIX
const updateStatusLog = asyncHandler(async (req, res) => {
const OGOrderID = req.body.id
    
  const orderstatus =  await orderStatus.findOne({ OGOrderID });

  if (orderstatus) {





      order.paymentSuccessful = req.body.paymentSuccessful || order.paymentSuccessful;
      order.totalPrice = req.body.totalPrice || order.totalPrice;
      order.deliveryLat = req.body.deliveryLat || order.deliveryLat;
      order.deliveryLong = req.body.deliveryLong || order.deliveryLong;
      order.deliveryAddress = req.body.deliveryAddress || order.deliveryAddress;
      //order.freeDelivery = req.body.freeDelivery || order.freeDelivery;
      order.totalQuantity = req.body.totalQuantity || order.totalQuantity;
      order.typesOfItems = req.body.typesOfItems || order.typesOfItems;
      order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
      order.shortAddress = req.body.shortAddress || order.shortAddress;
      //order.merchantTransactionId = req.body.merchantTransactionId || order.merchantTransactionId;
      if (req.body.totalQuantity >= 3){
        order.freeDelivery = 'Yes'
      } else {
        order.freeDelivery = 'No'
      }
     


    const updatedOrder = await orderStatus.save();

    res.json({
      _id: updatedOrder._id,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});


  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getTransactionStatus = asyncHandler(async (req, res) => {

  const { merchantTransactionId } = req.body; // Assuming user ID is passed in the route parameters

  // Input validation (optional but recommended):
  if (!merchantTransactionId) {
    return res.status(400).json({ message: 'Missing required parameter: merchantTransactionId' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const transactions = await TransactionLog.find({ merchantTransactionId });
  if (transactions) {
    res.status(200).json(transactions);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});


  // @desc   Get a single order
// @route   POST /api/users
// @access  Public

const getOrderID = asyncHandler(async (req, res) => {

  //console.log(req.body);
  const { merchantTransactionId } = req.body; // Assuming user ID is passed in the route parameters
  //console.log(merchantTransactionId);

  // Input validation (optional but recommended):
  if (!merchantTransactionId) {
    return res.status(400).json({ message: 'Missing required parameter: merchantTransactionId' });
  }

  // Efficiently retrieve orders using query with filtering by userID:
  const order = await Order.find({ merchantTransactionId });
  //console.log(order);
  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404).json({ message: 'No order found for this order' });
  }
});





export {
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
};