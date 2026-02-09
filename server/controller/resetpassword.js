const Sib = require('sib-api-v3-sdk');
const User = require('../model/users');
const ForgotPasswordRequest = require('../model/forgotpasswords')
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const forgotpassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const id = uuid.v4();

        const user = await User.findOne({ email });

        if (user) {
            const forgotPasswordRequest = new ForgotPasswordRequest({
                userId: user._id, active: true, uuid: id
            })
            await forgotPasswordRequest.save();
        }
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.SIB_API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'nimbalebasavraj1@gmail.com',
            name: 'Basavraj Enterprise'
        };

        const receivers = [
            {
                email: 'shantanimbale@gmail.com'
            }
        ];

        const result = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: `Confirmation mail to reset password`,
            htmlContent: `<p>Click below to reset password!</p>
                <a href="${process.env.WEBSITE}/password/resetpassword/${id}">Reset Password</a>`
        });

        res.status(202).json({ result });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

const resetpassword = (req, res) => {
    const id = req.params.id;
    ForgotPasswordRequest.findOne({ uuid: id }).then((forgotPasswordRequest) => {
        if (forgotPasswordRequest) {
            ForgotPasswordRequest.updateOne({ uuid: id }, { $set: { active: false } })
                .then(() => {
                    res.status(200).send(`<html>
                                    <script>
                                        function formSubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>Reset Password</button>
                                    </form>
                                </html>`);
                    res.end();
                })
                .catch((error) => {
                    console.error(error);
                    res.status(500).json({ error: 'An error during updated password.' });
                });
        }
    });
};

const updatepassword = async (req, res) => {
    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;

        const resetPasswordRequest = await ForgotPasswordRequest.findOne({ uuid: resetpasswordid });

        if (resetPasswordRequest) {
            const user = await User.findOne({ _id: resetPasswordRequest.userId });

            if (user) {
                // Encrypt the password
                const saltRounds = 10;

                bcrypt.genSalt(saltRounds, (err, salt) => {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }

                    bcrypt.hash(newpassword, salt, async (err, hash) => {
                        // Store hash in your password DB.
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }

                        await user.updateOne({ password: hash });

                        res.status(201).json({ message: 'Successfully updated the new password' });
                    });
                });
            } else {
                return res.status(404).json({ error: 'No user exists', success: false });
            }
        } else {
            return res.status(404).json({ error: 'Reset password request not found', success: false });
        }
    } catch (error) {
        return res.status(500).json({ error, success: false });
    }
};

module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}