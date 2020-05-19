import amqp from "amqplib/callback_api";
import { QUEUES, EVENTS } from "../constants";
import { createChannel } from "../utils";

// To run this publisher rabbitMQ server requires to have enabled rabbitmq_delayed_message_exchange:
// In RabbitMQ Command Prompt (sbin dir) run this command: rabbitmq-plugins enable rabbitmq_delayed_message_exchange
// If rabbitMQ server runned on Docker:
// https://stackoverflow.com/questions/52819237/how-to-add-plugin-to-rabbitmq-docker-image
// After that you should create exchange by yourself
let channel;
amqp.connect(
  // process.env.RABBITMQ_SERVER_URL,
  "amqp://user:user@rabbitmq:5672/",
  (connectionError, connection) => {
    createChannel(connection, (ch) => {
      channel = ch;
    });
  }
);

function publishTask(taskInformation) {
  switch (taskInformation.event) {
    case EVENTS.transaction:
      sendTransactionEvent(channel, taskInformation);
      break;
    case EVENTS.wallet:
      sendWalletEvent(channel, taskInformation);
      break;
  }
}

function sendTransactionEvent(channel, taskInformation) {
  const QUEUE = QUEUES.transaction;

  channel.assertQueue(QUEUE, {
    durable: true,
  });

  channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(taskInformation)));
}

function sendWalletEvent(channel, taskInformation) {
  const QUEUE = QUEUES.wallet;

  const EXCHANGE = "monitor";
  channel.assertQueue(QUEUE, {
    durable: true,
  });

  channel.assertExchange(EXCHANGE, "x-delayed-message", {
    arguments: { "x-delayed-type": "direct" },
  });

  channel.bindQueue(QUEUE, EXCHANGE);
  channel.publish(EXCHANGE, "", Buffer.from(JSON.stringify(taskInformation)), {
    persistent: true,
    headers: { "x-delay": 10000 },
  });
}

export default publishTask;
