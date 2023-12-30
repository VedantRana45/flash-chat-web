const express = require('express');
const { loginUser, registerUser, searchUser, updateUserProfile } = require('../Controllers/UserController');
const { authorizeUser } = require('../middleware/authentication');

const Router = express.Router();


Router.route('/register').post(registerUser);
Router.route('/login').post(loginUser);
Router.route('/').get(authorizeUser, searchUser).put(authorizeUser, updateUserProfile);


module.exports = Router;