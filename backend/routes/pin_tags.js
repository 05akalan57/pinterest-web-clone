const express = require('express')

const router = express.Router()
const client = require('../database')

// Get all pin_tags
router.get('/', (req, res) => {
  client
    .query('SELECT * FROM pin_tags')
    .then((pinTags) => res.send(pinTags.rows))
})

module.exports = router
