import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    }
}, { _id: false });

const cartSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    subtotal: {
        type: Number,
        default: 0,
        min: [0, 'Subtotal cannot be negative']
    },
    shipping: {
        type: Number,
        default: 0,
        min: [0, 'Shipping cannot be negative']
    },
    total: {
        type: Number,
        default: 0,
        min: [0, 'Total cannot be negative']
    },
    itemCount: {
        type: Number,
        default: 0,
        min: [0, 'Item count cannot be negative']
    }
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', function(next) {
    this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Calculate shipping (example: $5 per item that requires shipping)
    this.shipping = this.itemCount * 5; // You can customize this logic
    
    this.total = this.subtotal + this.shipping;
    next();
});

export const cartModel = model('Cart', cartSchema);
