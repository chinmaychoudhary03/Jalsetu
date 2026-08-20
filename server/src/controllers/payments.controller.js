const Razorpay = require('razorpay');
const crypto = require('crypto');

const createOrder = async (req, res, next) => {
  try {
    const { amount, bill_id } = req.body;
    if (!global.DB_AVAILABLE) {
      return res.json({
        id: `order_mock_${Date.now()}`,
        entity: 'order',
        amount: (amount || 100) * 100,
        currency: 'INR',
        receipt: `receipt_bill_${bill_id}`,
        status: 'created'
      });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
    });

    const options = {
      amount: (amount || 100) * 100,
      currency: "INR",
      receipt: `receipt_bill_${bill_id}`
    };

    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) { next(error); }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { bill_id, razorpay_payment_id, payment_mode } = req.body;

    if (!global.DB_AVAILABLE) {
      const mock = require('../db/mockData');
      const bill = mock.bills.find(b => b.id === bill_id);
      let billAmount = 100;
      if (bill) {
        bill.status = 'paid';
        billAmount = Number(bill.amount);
      }

      // Reconcile into finance receipts ledger
      const newTx = {
        id: `fin-pay-${Date.now()}`,
        type: 'receipt',
        category: 'Water Bill Collection',
        amount: billAmount,
        description: `Water Bill Payment for ${bill_id} (${payment_mode || 'Razorpay Online'})`,
        date: new Date().toISOString().split('T')[0],
        payment_mode: payment_mode || 'upi'
      };
      mock.finance.push(newTx);
      mock.dashboardStats.finance.total_receipts += billAmount;
      mock.dashboardStats.finance.balance += billAmount;

      if (mock.dashboardStats.bills.pending > 0) {
        mock.dashboardStats.bills.pending -= 1;
      }
      mock.dashboardStats.bills.paid += 1;
      mock.dashboardStats.bills.pending_amount = Math.max(0, mock.dashboardStats.bills.pending_amount - billAmount);

      return res.json({
        success: true,
        message: "Payment verified & reconciled into GP Cash Book",
        transaction_id: `TXN-JAL-${Date.now()}`
      });
    }

    const db = require('../db/connection');
    const { razorpay_order_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret');
    hmac.update((razorpay_order_id || '') + "|" + (razorpay_payment_id || ''));
    const generated_signature = hmac.digest('hex');

    if (!razorpay_signature || generated_signature === razorpay_signature) {
      await db.query('BEGIN');
      const { rows } = await db.query(
        'UPDATE bills SET status = $1 WHERE id = $2 RETURNING *',
        ['paid', bill_id]
      );
      if (rows.length > 0) {
        await db.query(
          'INSERT INTO finance_transactions (type, amount, description, date) VALUES ($1, $2, $3, CURRENT_DATE)',
          ['receipt', rows[0].amount, `Water Bill Payment for ${bill_id}`]
        );
      }
      await db.query('COMMIT');
      res.json({ success: true, message: "Payment verified successfully", transaction_id: `TXN-JAL-${Date.now()}` });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    if (global.DB_AVAILABLE) {
      const db = require('../db/connection');
      await db.query('ROLLBACK');
    }
    next(error);
  }
};

module.exports = { createOrder, verifyPayment };
