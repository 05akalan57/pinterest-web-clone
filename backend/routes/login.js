const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const client = require('../database')

const router = express.Router()

dotenv.config()

// User login
router.post('/', (req, res) => {
  const { username, password } = req.body

  client
    .query('SELECT * FROM users WHERE username = $1 AND password = $2', [
      username,
      password
    ])
    .then((result) => {
      if (result.rows.length > 0) {
        const token = jwt.sign(
          {
            id: result.rows[0].id,
            username
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        )

        res.status(201).json({
          ...result.rows[0],
          token
        })
      } else {
        res.status(401).send('Invalid username or password')
      }
    })
})

module.exports = router
