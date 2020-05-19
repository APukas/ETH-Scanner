import mongoose from "mongoose";
import { AVAILABLE_ORDER_TYPES } from "../constants";
import { orderSchema } from "../models";

const getOrderCollection =  orderType => {
  switch (orderType) {
    case AVAILABLE_ORDER_TYPES.ETH:
      return mongoose.model("eth-order", orderSchema);
  }
};

export default  getOrderCollection;