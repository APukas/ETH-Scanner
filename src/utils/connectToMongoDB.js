import mongoose from "mongoose";

function connectToMongoDB() {
  return (
    mongoose
      // .connect(process.env.MONGO_DB_URL, {
      .connect("mongodb://mongo:27017/Scanner", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {
        return true;
      })
      .catch((err) => {
        throw err;
      })
  );
}

export default connectToMongoDB;
