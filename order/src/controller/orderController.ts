import OrderModel from "../model/orderModel";
import { ProductModel } from "../model/productmodel";
import { Request, Response } from "express";

interface RequestWithUser extends Request {
  user?: any;
}

class OrderRouter {
  private orderModel: typeof OrderModel;

  constructor(orderModel: typeof OrderModel) {
    this.orderModel = orderModel;
  }

  async insert(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.body;
      console.log(id);
      for (let i = 0; i < id.length; i++) {
        const product = await ProductModel.findOne({ product_id: id[i] });
        if (product) {
            console.log(req.user.email)
          await new this.orderModel({
            products: product._id.toString(),
            userEmail:req.user.email,
          }).save();
        }
      }
      res.status(201).json("product order saved");
    } catch (err) {
      res.status(401).json(err);
    }
  }

  async getUser(req: RequestWithUser, res: Response) {
    try {
      const products = await this.orderModel
        .find({ userEmail: req.params.email })
        .populate("products");
      res.status(201).json(products);
    } catch (err) {
      res.status(401).json(err);
    }
  }
}

export default OrderRouter;
