import { publishTask } from "./";
import { getOrderCollection } from "./";

const acceptOrder = async (req, res) => {
  const { order } = req.body;
  const OrderCollection = getOrderCollection(order.type);

  let result;
  try {
    result = await OrderCollection.findOne({ id: order.id });
  } catch (e) {
    return res.status(422).json({ message: "Validation error" });
  }

  if (result) {
    return res.status(409).json({ message: "Order with this ID already exists." });
  }

  try {
    await new OrderCollection(order).save();
    publishTask({
      event: "wallet",
      eventType: order.type,
      recordId: order.id
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Error while publishing your task" });
  }

  return res.json({ order });
};

export default acceptOrder;
