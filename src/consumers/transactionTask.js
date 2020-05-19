import axios from "axios";
import { getOrderCollection, publishTask, sendWebhook } from "../controllers";
import { API_LINKS } from "../constants";
import { EVENTS } from "../constants";

async function transactionTask(msg, channel) {
  const message = JSON.parse(msg.content.toString());
  const { eventType, recordId: id } = message;
  const OrderCollection = getOrderCollection(eventType);
  const order = await OrderCollection.findOne({ id });
  return channel.ack(msg);
  // return await processTransactionTask(eventType, order, channel, msg);
}

async function processTransactionTask(eventType, { id, callbackUrl, confirmationCount }, channel, msg) {
  const { hash } = JSON.parse(msg.content.toString());
  const transactionEndpoint = `${ API_LINKS[eventType].transactions }${ hash }`;
  const webhookUrl = `${ API_LINKS[eventType].webhook }`;
  try {
    const { data } = await axios.get(transactionEndpoint);
    const info = {
      event: "tx-confirmation",
      hash: data.hash,
      url: callbackUrl,
      confirmations: confirmationCount + 1
    };
    await Promise.all([sendWebhook(callbackUrl, data), sendWebhook(webhookUrl, JSON.stringify(info))]);
    return channel.ack(msg);
  } catch (error) {
    if (error.response.status === 429) {
      channel.ack(msg);
      publishTask({
        event: EVENTS.transaction,
        eventType,
        recordId: id,
        hash
      });
    }
  }
}

export default transactionTask;