import { Request, Response } from "express";
import dotenv from "dotenv";
import amqp, { Channel, Connection } from "amqplib";
import { ProductModel, IProduct } from "../model/productmodel";

let channel: Channel;
let connection: Connection;

dotenv.config();

interface RequestWithUser extends Request {
  user?: any;
}

function connect(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const amqpServer = "amqp://rabbitmq-service";
      connection = await amqp.connect(amqpServer);
      channel = await connection.createChannel();
      console.log("products");
      await channel.assertQueue("ORDER");
      resolve();
    } catch (err) {
      console.error("Error connecting to RabbitMQ:", err);
      reject(err);
    }
  });
}


 connect();



class ProductRouter {
  private productModel: typeof ProductModel;

  constructor(productModel: typeof ProductModel) {
    this.productModel = productModel;
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productModel.findOne({
        productname: req.body.productname,
      });
      if (!product) {
        const newProduct = new this.productModel(req.body);
        await newProduct.save();
 
        channel.sendToQueue("ORDER", Buffer.from(JSON.stringify({
          product_id: newProduct._id.toString(),
          productname: req.body.productname,
          price: req.body.price,
          company: req.body.company,
          desc: req.body.desc
        })));

        res.status(201).json(newProduct);
      } else {
        res.status(201).json("Product already exists");
      }
    } catch (err) {
      res.status(401).json(err);
    }
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    try {
      const product = await this.productModel.findOne({ _id: req.params.id });
      if (product) {
        res.status(201).json(product);
      } else {
        res.status(201).json("No such product");
      }
    } catch (err) {
      res.status(401).json(err);
    }
  }
}

export default ProductRouter;
