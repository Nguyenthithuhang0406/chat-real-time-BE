const express = require('express');

const { addMessage, getMessages } = require('../controllers/messages.controller');

const messagesRoute = express.Router();

messagesRoute.post('/addMessage', addMessage);
messagesRoute.post('/getMessages', getMessages);

module.exports = messagesRoute;