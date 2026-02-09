const User = require('../model/users');
const Expense = require('../model/expenses');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardOfUsers = await User.find()
            .sort({ totalExpenses: -1 })
            .exec();

        res.status(200).json(leaderboardOfUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

module.exports = {
    getUserLeaderBoard

}
                                                                                                                                                 