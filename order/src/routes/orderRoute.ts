import express, { Router, Request, Response } from "express";
import OrderRouter from "../controller/orderController";
import OrderModel from "../model/orderModel";
import {signinverify} from "@auth-middlewares/common"


const route: Router = express.Router();
const orderController=new OrderRouter(OrderModel)


route.post("/api/order",signinverify,(req:Request,res:Response)=>{
   orderController.insert(req,res)
})

route.get("/api/order/:email",(req:Request,res:Response)=>{
    orderController.getUser(req,res)
 })
 

export default route;
