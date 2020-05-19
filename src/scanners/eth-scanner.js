import axios from "axios";
import mongoose from "mongoose";
import { orderSchema } from "../models";
import { API_LINKS, AVAILABLE_ORDER_TYPES, EVENTS } from "../constants";
import { publishTask, updateAboutTransaction } from "../controllers";

const OrderCollection = mongoose.model("eth-order", orderSchema);

async function monitorEthWalletTransactions(order, msg, channel) {
  if (!order) {
    return;
  }
  const { id, startedAt, timeToLive } = order;
  console.log("Order", order);
  if (Date.now() > new Date(startedAt).getTime() + timeToLive * 100000) {
    channel.ack(msg);
    return await OrderCollection.findOneAndUpdate({ id }, { isActive: false });
  } else {
    publishTask({
      event: EVENTS.wallet,
      eventType: AVAILABLE_ORDER_TYPES.ETH,
      recordId: id,
    });
    channel.ack(msg);
  }
  const newTransactions = await getWalletTransactions(order);
  console.log("NewTransactions", newTransactions);
  if (newTransactions.length > 0) {
    return newTransactions.map((transaction) => {
      updateAboutTransaction(transaction, order, AVAILABLE_ORDER_TYPES.ETH);
      publishTask({
        event: EVENTS.transaction,
        eventType: AVAILABLE_ORDER_TYPES.ETH,
        recordId: id,
        hash: transaction.hash,
      });
    });
  }
}

async function getWalletTransactions(order) {
  const { address, startedAt } = order;
  try {
    const response = await axios.get(`${API_LINKS.ETH.address}${address}`);
    const { txrefs } = response.data;
    
    if (!txrefs) {
      return [];
    }

    return await Promise.all(
      txrefs.map(async (transaction) => {
        const { confirmed, tx_hash: txHash } = transaction;
        const transactionTimestamp = new Date(confirmed).getTime();
        if (transactionTimestamp > new Date(startedAt).getTime()) {
          const { data } = await axios.get(
            `${API_LINKS.ETH.transactions}${txHash}`
          );
          return data;
        }
      })
    ).then((newTransactions) => newTransactions.filter((v) => v));
  } catch (error) {
    throw error;
  }
}

export { monitorEthWalletTransactions };
