import { productModel } from "../../DB/Model/product.js";

export const createProduct = async(req, res) => {

    const data = req.body;
    if (!data) {
        return res.status(400).json({
            message: 'Bad Request'
        });
    }
    await productModel.insertMany(data);
    res.status(201).json({
        message: 'Product created successfully',
        data: data
    });
    res.send('Create Product');
}

export const getAllProducts = async(req, res) => {
    const products = await productModel.find();
    res.status(200).json({
        message: 'Products retrieved successfully',
        data: products
    });
}