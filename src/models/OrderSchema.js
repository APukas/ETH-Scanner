import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  startedAt: {
    type: Date,
    required: true
  },
  callbackUrl: {
    type: String,
    required: true
  },
  timeToLive: {
    type: Number,
    required: true
  },
  confirmationCount: {
    type: Number,
    required: true
  },
  txs: [
    {
      hash: {
        type: String,
        required: true
      },
      received: {
        type: Date,
        required: true
      },
      sender: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      fee: {
        type: Number,
        required: true
      }
    }
  ],
  isActive: {
    type: Boolean,
    default: true
  }
});

export default orderSchema;
