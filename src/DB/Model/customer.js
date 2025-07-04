import { Schema, model } from 'mongoose';

const customerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    balance: {
        type: Number,
        required: [true, 'Balance is required'],
        min: [0, 'Balance cannot be negative'],
        default: 0
    }
}, {
    timestamps: true
});

export const customerModel = model('Customer', customerSchema);
