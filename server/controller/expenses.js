const Expense = require('../model/expenses');
const User = require('../model/users');
const S3service = require('../services/S3services')
const Url = require('../model/urls')
const mongoose = require('mongoose');

exports.addExpense = async (req, res, next) => {
    try {
        const { expenseamount, description, category } = req.body;

        // Create expense document
        const expense = new Expense({
            expenseamount: expenseamount,
            description: description,
            category: category,
            userId: req.user._id,
        });
        await expense.save() 
        
        const totalExpense = Number(req.user.totalExpenses) + Number(expenseamount);
        await User.findByIdAndUpdate(req.user._id, { totalExpenses: totalExpense });

        await req.user.save();

        res.status(200).json({ expense });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;

        if (!expenseId) {
            return res.status(400).json({ success: false, message: 'Bad parameter' });
        }

        const deletedExpense = await Expense.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({ success: false, message: 'Expense not found' });
        }

        req.user.totalExpenses -= deletedExpense.expenseamount;

        await req.user.save();

        res.status(200).json({ deletedExpense, user: req.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'An error occurred while deleting the expense.' });
    }
};

exports.getExpenses = async (req, res, next) => {
    try {
        let { page, number } = req.query;
        page = Number(page);
        number = Number(number);

        const total = await Expense.countDocuments({ userId: req.user._id });

        const hasNextPage = (page * number) < total;
        const nextPage = hasNextPage ? page + 1 : null;

        const expenses = await Expense.find({ userId: req.user._id })
            .skip((page - 1) * number)
            .limit(number);

        const pageData = {
            currentPage: page,
            lastPage: Math.ceil(total / number),
            hasNextPage,
            previousPage: page > 1 ? page - 1 : null,
            nextPage
        };

        const response = { expenses, pageData };
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching expenses.' });
    }
};

exports.downloadexpense = async (req, res) => {
    try {
        const expenses = await Expense.find({ userId: req.user._id })
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user._id
        const filename = `Expense${userId}/${new Date()}.txt`;
        const fileURL = await S3service.uploadToS3(stringifiedExpenses, filename);
        const url = await Url.create({ url: fileURL, userId: req.user._id })
        res.status(200).json({ filename, fileURL, success: true, url });

    } catch (err) {
        console.log(err)
        res.status(500).json({ fileURL: '', success: false, err: err });
    }
};