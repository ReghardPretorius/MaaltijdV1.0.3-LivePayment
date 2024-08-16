import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const tempWalletLogSchema = mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      required: true
    },
    walletAmount: {
      type: Number,
      required: true,
    },
    admin: {
      type: String,
      required: false,
    } ,
    campaign: {
        type: String,
        required: false,
      },
      expire: {
        type: String,
        required: false,
      },
      
      expiryDate: {
        type: Date,
        required: false,
      },
      allocatedBy: {
        type: String,
        required: false,
      },
      userName: {
        type: String,
        required: false,
      },
      merchantTransactionId: {
        type: String,
        required: false,
      }

  },
  {
    timestamps: true,
  }
);


const TempWalletLog = mongoose.model('TempWalletLog', tempWalletLogSchema);

export default TempWalletLog;