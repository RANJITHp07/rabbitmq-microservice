import express from "express";
import amqp, { Channel, Connection } from "amqplib";
import { ProductModel } from "./model/productmodel";
import { UserModel } from "./model/userModel";
import OrderRoute from "./routes/orderRoute"
import connectDB from "../db";

let orderChannel: Channel;
let userChannel: Channel;
let connection: Connection;

connectDB();

async function connect() {
  try {
    const amqpServer = "amqp://rabbitmq-service";
    connection = await amqp.connect(amqpServer);
    console.log("Connection to RabbitMQ established");
    orderChannel = await connection.createChannel();
    userChannel = await connection.createChannel();
    console.log("Channel created");
    await orderChannel.assertQueue("ORDER");
    await userChannel.assertQueue("USER");
  } catch (err) {
    console.error("Error connecting to RabbitMQ:", err);
    throw err;
  }
}

async function setupOrderConsumer() {
  try {
    await connect();

    await orderChannel.consume("ORDER", async (data: any) => {
      if (data && data.content) {
        const contentString = data.content.toString();
        console.log("Received content:", contentString);
        try {
          const order = JSON.parse(contentString);
          const orderFind = await ProductModel.findOne({
            productname: order.productname,
          });
          console.log(orderFind);
          if (!orderFind) {
            const newOrder = new ProductModel(order);
            await newOrder.save();
            orderChannel.ack(data);
            console.log("Order saved:", newOrder);
          }
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      }
    }, { noAck: false });
  } catch (err) {
    console.error("Error setting up order consumer:", err);
    throw err;
  }
}

async function setupUserConsumer() {
  try {
    await connect();

    await userChannel.consume("USER", async (data: any) => {
      if (data && data.content) {
        const contentString = data.content.toString();
        console.log("Received content:", contentString);
        try {
          const user = JSON.parse(contentString);
            const newUser = new UserModel(user);
            await newUser.save();
            userChannel.ack(data);
            console.log("User saved:", newUser);
        } catch (err) {
          console.error("Error parsing JSON:", err);
        }
      }
    }, { noAck: false });
  } catch (err) {
    console.error("Error setting up user consumer:", err);
    throw err;
  }
}

Promise.all([setupOrderConsumer(), setupUserConsumer()])
  .then(() => {
    const app = express();
    app.use(express.json());

    app.use(OrderRoute);

    app.listen(3000, () => {
      console.log("Connected to port 3000");
    });
  })
  .catch((err) => {
    console.error("Error starting the server:", err);
  });
