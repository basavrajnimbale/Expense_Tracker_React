const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT

const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const mongoose = require('mongoose')

const User = require('./model/users');
const Expense = require('./model/expenses');
const Order = require('./model/orders');
const ForgotPasswordRequest = require('./model/forgotpasswords')
const Url = require('./model/urls')

const userRoutes = require('./route/user');
const expenseRoutes = require('./route/expense')
const purchaseRoutes = require('./route/purchase');
const premiumFeactureRoutes = require('./route/premiumFeature');
const resetPasswordRoutes = require('./route/resetpassword');
const pageRoutes = require('./route/page')

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
)

app.use(pageRoutes);
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(bodyParser.json({ extended: false }));

app.use(express.json());

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/premium', premiumFeactureRoutes)
app.use('/password', resetPasswordRoutes)

app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/dist/index.html")
  );
});

mongoose
    .connect(process.env.MONGODB_ID)
    .then(result => {
        console.log('connected to mongoose')
        app.listen(PORT);
    }).catch(err => {
        console.log(err);
    })