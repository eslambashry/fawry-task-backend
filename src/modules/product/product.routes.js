import { Router } from "express";
import { createProduct, getAllProducts } from "./product.controller.js";

const productRouter = Router();


productRouter.post('/create', createProduct);
productRouter.get('/', getAllProducts);


export default productRouter;