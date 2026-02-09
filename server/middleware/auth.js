const jwt = require('jsonwebtoken');
const User = require('../model/users');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);

        const user = await User.findOne({ _id: decodedToken.userId });

        if (user) {
            req.user = user;
            next();
        } else {
            throw new Error('User not found');
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false });
    }
};

module.exports = {
    authenticate
}