import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const app = express();
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const account = process.env.STRIPE_ACCOUNT_ID;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/payments", async (req, res) => {
  try {
    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        payments: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: true,
          },
        },
      },
    });

    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

app.get("/payment-details", async (req, res) => {
  const merchantAccount = req.query.merchant_account;
  console.log(merchantAccount);
  try {
    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        payment_details: {
          enabled: true,
          features: {
            refund_management: true,
            dispute_management: true,
            capture_payments: true,
            destination_on_behalf_of_charge_management: true,
          },
        },
      },
    });

    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

app.get("/payouts", async (req, res) => {
  const merchantAccount = req.query.merchant_account;
  console.log(merchantAccount);
  try {
    const accountSession = await stripe.accountSessions.create({
      account,
      components: {
        payouts: {
          enabled: true,
          features: {
            instant_payouts: true,
            standard_payouts: true,
            edit_payout_schedule: true,
            external_account_collection: true,
          },
        },
      },
    });

    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

app.post("/account_session", async (req, res) => {
  const merchantAccount = req.query.merchant_account;
  console.log(req.body.payouts);
  try {
    const accountSession = await stripe.accountSessions.create({
      account,
      components: req.body,
    });

    res.json({
      client_secret: accountSession.client_secret,
    });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log(`account ${account} Server is running on http://localhost:3000`);
});
