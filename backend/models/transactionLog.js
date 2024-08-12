import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const transactionLogSchema = mongoose.Schema(
  {
    merchantTransactionId: {
      type: String,
      required: true,
    },
    resultCode: {
        type: String,
        required: true
    },
    resultDescription: {
        type: String,
        required: true
  },
  amount: {
    type: String,
    required: true
},
},
  {
    timestamps: true,
  }
);


const TransactionLog = mongoose.model('TransactionLog', transactionLogSchema);

export default TransactionLog;