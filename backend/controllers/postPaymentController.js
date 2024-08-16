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
      res.status(201).redirect(`https://maaltijd.co.za/postpayment/${merchantTransactionId}`);
    } else {
      res.status(400).redirect(`https://maaltijd.co.za/postpayment/${merchantTransactionId}`);;
      throw new Error('Invalid transaction data');
    }

  
  });


  // @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const manualPostPaymentAllWallet = asyncHandler(async (req, res) => {
  const { merchantTransactionId, amount } = req.body;

  const resultCode = '000.000.000';
  const resultDescription = 'Manual Payment - Full amount paid from Wallet';

  const transaction = await TransactionLog.create({
    resultCode,
    resultDescription,
    merchantTransactionId,
    amount
  });

  //console.log(transaction);
  if (transaction) {
    res.status(201)//.redirect(`https://maaltijd.co.za/postpayment/${merchantTransactionId}`);;
  } else {
    res.status(400)//.redirect(`https://maaltijd.co.za/postpayment/${merchantTransactionId}`);;
    throw new Error('Invalid transaction data');
  }


});

  export {
    postPaymentController,
    manualPostPaymentAllWallet
  };