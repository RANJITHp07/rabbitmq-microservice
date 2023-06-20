import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  product_id:String,
  productname: string;
  company: string;
  desc:string;
  price: number;
}

const productSchema: Schema<IProduct> = new mongoose.Schema({
  product_id:{
    type:String
  },
  productname: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
  },
  desc:{
    type:String
  },
  price: {
    type:Number,
    required: true,
  },
});

const ProductModel = mongoose.model<IProduct>("Product", productSchema);

export {IProduct,ProductModel};
