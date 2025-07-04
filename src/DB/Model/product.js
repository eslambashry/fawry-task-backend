import { model, Schema } from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  description: String,
  image: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date,
  },
  requiresShipping: {
    type: Boolean,
    default: false
  },
  weight: {
    type: Number, // in kg
    min: 0
  }
}, {
  timestamps: true // adds createdAt and updatedAt fields
},{timestamps: true});

export const productModel = model('Product', productSchema);


