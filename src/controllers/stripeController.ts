import Stripe from 'stripe';
import asyncHandler from 'express-async-handler';
import UIDGenerator from 'uid-generator';
import sanitizedConfig from '../config';

const key: string | undefined = sanitizedConfig.STRIPE_SECRET_KEY || '';

const stripe = new Stripe(key, {
  apiVersion: '2020-08-27',
});

const uidgen = new UIDGenerator();

// @desc    payment with stripe
// @route   Post /api/orders/stripe
// @access  Private

export const stripePay = asyncHandler(async (req, res) => {
  const { token, amount } = req.body;
  const idempotencyKey = await uidgen.generate();
  return stripe.customers
    .create({
      email: token?.email,
      source: token,
    })
    .then((customer) => {
      stripe.charges.create(
        {
          amount: amount * 100,
          currency: 'usd',
          customer: customer.id,
          receipt_email: token?.email,
        },
        { idempotencyKey }
      );
    })
    .then((result) => {
      res.status(200).json(result);
    });
});
