import asyncHandler from 'express-async-handler';
import TransactionLog from '../models/transactionLog.js';



// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const postPaymentController = asyncHandler(async (req, res) => {
    const data = req.body;
    const resultCode = data['result.code'];
    const resultDescription = data['result.description'];
    const amount = data.amount;
    const merchantTransactionId = data.merchantTransactionId;

    const transaction = await TransactionLog.create({
      resultCode,
      resultDescription,
      merchantTransactionId,
      amount
    });
  
    if (transaction) {
      res.status(201);
    } else {
      res.status(400);
      throw new Error('Invalid transaction data');
    }

  
  });

  export {
    postPaymentController,
  };