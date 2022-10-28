import express from "express";
import Stripe from "stripe";

const stripeRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_KEY);

stripeRouter.post("/payment", async (req, res, next) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: "gbp",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        // next(stripeErr);
        next(createError(500, stripeErr));
      } else {
        res.send(stripeRes);
      }
    }
  );
});

export default stripeRouter;
