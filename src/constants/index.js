const AVAILABLE_ORDER_TYPES = {
  ETH: "ETH"
};
const API_LINKS = {
  ETH: {
    address: "https://api.blockcypher.com/v1/beth/test/addrs/",
    transactions: "https://api.blockcypher.com/v1/beth/test/txs/",
    webhook: `https://api.blockcypher.com/v1/beth/test/hooks?token=${process.env.BLOCKCYPHER_TOKEN}`
  }
};

const QUEUES = {
  wallet: "wallet-event",
  transaction: "transaction-event"
};

const EVENTS = {
  transaction: "transaction",
  wallet: "wallet"
};
export {
  AVAILABLE_ORDER_TYPES,
  API_LINKS,
  QUEUES,
  EVENTS
}