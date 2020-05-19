import amqp from "amqplib/callback_api";
import walletTask from "../consumers/walletTask";
import transactionTask from "../consumers/transactionTask";
import { QUEUES } from "../constants";
import { createChannel } from "../utils";

function startSubscribing() {
  // amqp.connect(process.env.RABBITMQ_SERVER_URL,
  amqp.connect("amqp://user:user@rabbitmq:5672/",
    (connectionError, connection) => {
      createChannel(connection, (channel) => {
        // receiveTransactionTask(channel);
        receiveWalletTask(channel);
      })
    }
  );
}

function receiveWalletTask(channel) {
  const QUEUE = QUEUES.wallet;
  channel.assertQueue(QUEUE, {
    durable: true
  });
  channel.consume(QUEUE, async msg => await walletTask(msg, channel), { noAck: false });
}

function receiveTransactionTask(channel) {
  const QUEUE = QUEUES.transaction;
  channel.assertQueue(QUEUE, {
    durable: true
  });
  channel.consume(QUEUE, async msg => await transactionTask(msg, channel), {
    noAck: false
  });
}

export default startSubscribing;
