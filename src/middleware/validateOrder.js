import Joi from "joi";
import { AVAILABLE_ORDER_TYPES } from "../constants";

const orderSchema = {
  id: Joi.string().required(),
  type: Joi.string()
    .required()
    .valid(...Object.values(AVAILABLE_ORDER_TYPES)),
  address: Joi.string()
    .required()
    .min(25)
    .max(40),
  startedAt: Joi.date().required(),
  callbackUrl: Joi.string()
    .uri()
    .required(),
  timeToLive: Joi.number()
    .integer()
    .required()
    .min(1),
  confirmationCount: Joi.number()
    .integer()
    .required()
    .min(1)
};

const validateOrder = (req, res, next) => {
  const { order } = req.body;
  const { error } = Joi.validate(order, orderSchema);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  order.startedAt = new Date(parseInt(order.startedAt));

  return next();
};

export default validateOrder;
