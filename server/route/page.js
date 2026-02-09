const express = require('express');

const route = express.Router();

const pageController = require('../controller/page')

route.get('/', pageController.getloginpage)

module.exports = route;