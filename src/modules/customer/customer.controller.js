import { customerModel } from "../../DB/Model/customer.js";

export const createUser = async (req, res) => {
    try {
        const data = req.body;
        
        if (!data) {
            return res.status(400).json({
                message: 'Bad Request - No data provided'
            });
        }

        // Validate required fields
        const { name, email, balance } = data;
        if (!name || !email || balance === undefined) {
            return res.status(400).json({
                message: 'Name, email, and balance are required fields'
            });
        }

        const newUser = await customerModel.create(data);
        
        res.status(201).json({
            message: 'User created successfully',
            data: newUser
        });
    } catch (error) {
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Email already exists'
            });
        }
        
        res.status(500).json({
            message: 'Error creating user',
            error: error.message
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { name, email, minBalance, maxBalance } = req.query;
        
        // Build filter object
        const filter = {};
        
        if (name) {
            filter.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }
        
        if (email) {
            filter.email = { $regex: email, $options: 'i' }; // Case-insensitive search
        }
        
        if (minBalance || maxBalance) {
            filter.balance = {};
            if (minBalance) filter.balance.$gte = Number(minBalance);
            if (maxBalance) filter.balance.$lte = Number(maxBalance);
        }
        
        const users = await customerModel.find(filter).select('-__v');
        
        res.status(200).json({
            message: 'Users retrieved successfully',
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving users',
            error: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await customerModel.findById(id).select('-__v');
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            message: 'User retrieved successfully',
            data: user
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error retrieving user',
            error: error.message
        });
    }
};

