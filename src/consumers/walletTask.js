import { AVAILABLE_ORDER_TYPES } from "../constants";
import { monitorEthWalletTransactions } from "../scanners";
import { getOrderCollection } from "../controllers";

async function walletTask(msg, channel) {
  const { eventType, recordId: id } = JSON.parse(msg.content.toString());
  const OrderCollection = getOrderCollection(eventType);
  const order = await OrderCollection.findOne({ id });

  switch (eventType) {
    case AVAILABLE_ORDER_TYPES.ETH:
      return monitorEthWalletTransactions(order, msg, channel);
  }
}

export default walletTask;