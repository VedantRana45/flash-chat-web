const express = require('express');
const { authorizeUser } = require('../middleware/authentication');
const { sendMessage, fetchMessages } = require('../Controllers/MessageController');

const Router = express.Router();

Router.route('/').post(authorizeUser, sendMessage);
Router.route('/:chatId').get(authorizeUser, fetchMessages);

module.exports = Router;