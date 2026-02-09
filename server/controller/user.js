const User = require('../model/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

function isstringinvalid(string) {
    if (string == undefined || string.length == 0) {
        return true
    } else {
        return false
    }
}

const Signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ err: "bad parameter. something is missing" })
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user using the User model
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'Successfuly create new user' });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

function generateAccessToken (id, name, ispremiumuser) {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, process.env.TOKEN_SECRET)
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ message: 'Email id or password missing', success: false });
        }

        // Find the user by email using the User model
        const user = await User.findOne({ email });

        if (user) {
            // Compare the provided password with the hashed password stored in the database
            const result = await bcrypt.compare(password, user.password);

            if (result) {
                res.status(200).json({
                    success: true,
                    message: 'User logged in successfully',
                    token: generateAccessToken(user.id, user.name, user.ispremiumuser)
                });
            } else {
                return res.status(400).json({ success: false, message: 'Password is incorrect' });
            }
        } else {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};

module.exports = {
    Signup,
    login,
    generateAccessToken
}
