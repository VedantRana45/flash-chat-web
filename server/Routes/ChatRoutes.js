const express = require('express');
const { authorizeUser } = require('../middleware/authentication');
const { accessChat, fetchChats, createGroupChat, renameGroup, removeGroupUser, addUserToGroup } = require('../Controllers/ChatController');

const Router = express.Router();

Router.route('/').post(authorizeUser, accessChat).get(authorizeUser, fetchChats);
Router.route('/group').post(authorizeUser, createGroupChat).put(authorizeUser, renameGroup);
Router.route('/addUserGroup').put(authorizeUser, addUserToGroup)
Router.route('/removeGroupUser').put(authorizeUser, removeGroupUser);

module.exports = Router;