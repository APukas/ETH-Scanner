import "@babel/polyfill";

import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import routes from "./routes";
import { connectToMongoDB } from "./utils";
import { startSubscribing } from "./controllers";

const app = express();
dotenv.config();

const port = 5000;

connectToMongoDB()
  .then(() => {
    console.log("Connected to MongoDB");
    return startSubscribing();
  })
  .catch(error => {
    throw error;
  });

app.use(
  bodyParser.json()
);
app.use(bodyParser.json());
app.use(routes);

app.listen(port, () => console.log(`Listening on port ${port}...`));
