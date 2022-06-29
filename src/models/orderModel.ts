import { Schema, model, Types } from 'mongoose';

type CartItems = {
  name: string;
  qty: number;
  image: string;
  _id: Types.ObjectId;
};

type AddressType = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
};

interface IOrder {
  user: Types.ObjectId;
  cartItems: CartItems[];
  shippingAddress: AddressType;
  totalPrice: number;
  isPaid: boolean;
}

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    cartItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        _id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  }
);

const Order = model<IOrder>('Order', orderSchema);

export default Order;
