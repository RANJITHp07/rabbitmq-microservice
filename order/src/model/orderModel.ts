import { Schema, Document, model, Types } from "mongoose";
import { IProduct } from "./productmodel";

interface IOrder extends Document {
  products: Types.ObjectId | IProduct;
  userEmail: string;
}

const OrderSchema: Schema<IOrder> = new Schema({
  products: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  userEmail: String
});

const OrderModel = model<IOrder>("Order", OrderSchema);

export default OrderModel;
