import express, { Router, Request, Response } from "express";
import ProductRouter from "../controller/productController";
import {ProductModel} from "../model/productmodel";
import { signinverify,adminverify } from "@auth-middlewares/common";


const route: Router = express.Router();

const productController: ProductRouter = new ProductRouter(ProductModel);

route.post("/api/product",adminverify, (req: Request, res: Response) =>
  productController.createProduct(req, res)
);

route.get("/api/product/get-product/:id", (req: Request, res: Response) =>
  productController.getProduct(req, res)
);



export default route;