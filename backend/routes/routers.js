// routes/router.js
const express = require('express');
const {register,login} = require('../controller/users');
const {getChats} = require('../controller/chat')
const {getPolls} = require('../controller/polls')

const router = express.Router();

// User routes
router.post('/register', register);
router.post('/login',  login);
// Endpoint to get all messages
router.get('/messages', getChats);
  
  // Endpoint to get all polls
router.get('/polls', getPolls);

module.exports = router;
