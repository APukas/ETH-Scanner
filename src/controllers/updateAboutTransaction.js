import { getOrderCollection } from "./index";

async function updateAboutTransaction(
  transaction,
  { id },
  orderType
) {
  try {
    const { hash, received, inputs, total, fees } = transaction;
    const OrderCollection = getOrderCollection(orderType);
    const existingTransaction = await OrderCollection.findOne({ id }, { "txs.hash": hash });
    if (existingTransaction.txs.length > 0) {
      throw new Error("Transaction hash exists");
    }
    return await OrderCollection.findOneAndUpdate(
      { id },
      {
        $push: {
          txs: {
            hash,
            received,
            sender: inputs[0].addresses[0],
            amount: total,
            fee: fees
          }
        }
      }
    );

  } catch (error) {
    throw error;
  }
}

export default updateAboutTransaction;