const express = require('express')

const router = express.Router()
const client = require('../database')

// Get all messages
router.get('/', (req, res) => {
  client
    .query('SELECT * FROM messages')
    .then((messages) => res.send(messages.rows))
})

module.exports = router
