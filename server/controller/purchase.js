const Rezorpay = require('razorpay')
const Order = require('../model/orders')
const Expense = require('../model/expenses')
const user = require('./user')
const mongoose = require('mongoose');

const purchasepremium = async (req, res, next) => {
    try {
        const rzp = new Rezorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const amount = 2500;

        const order = await rzp.orders.create({
            amount,
            currency: "INR"
        });

        const orderObj = new Order({
            orderid: order.id,
            status: "PENDING",
            userId: req.user
        });
        await orderObj.save();

        return res.status(201).json({ order, key_id: rzp.key_id });
        
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};

const updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });
        order.status = 'SUCCESSFUL';
        order.paymentid = payment_id;

        // Save the updated order
        await order.save();

        req.user.ispremiumuser = true;
        await req.user.save();

        return res.status(202).json({
            success: true,
            message: "Transaction Successful",
            // Assuming you have a method to generate an access token in your User model
            token: user.generateAccessToken(order.userId, undefined, true)
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err })
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus

}