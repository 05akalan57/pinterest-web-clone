const express = require('express')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const client = require('../database')
const { verifyToken } = require('../middleware')

const router = express.Router()

dotenv.config()

// Create a pin
router.post('/', verifyToken, (req, res) => {
  const { name, imageUrl, boardId } = req.body

  client
    .query('SELECT * FROM boards WHERE id = $1 AND user_id = $2', [
      boardId,
      req.decoded.id
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        res
          .status(401)
          .send('You are not authorized to create a pin on this board')
      } else {
        client
          .query(
            'INSERT INTO pins (name, image_url, board_id) VALUES ($1, $2, $3)',
            [name, imageUrl, boardId]
          )
          .then(() => {
            res.status(200).send('Pin created')
          })
      }
    })
})

// Get all pins
router.get('/', verifyToken, (req, res) => {
  client
    .query('SELECT * FROM boards WHERE user_id = $1', [req.decoded.id])
    .then((result) => {
      if (result.rows.length === 0) {
        res.status(404).send('No pins found')
      } else {
        const boardIds = result.rows.map((board) => board.id)

        client
          .query(
            `SELECT * FROM pins WHERE board_id IN (${boardIds
              .map((id, index) => `$${index + 1}`)
              .join(', ')})`,
            boardIds
          )
          .then((pins) => {
            res.status(200).send(pins.rows)
          })
      }
    })
})

// Get a pin
router.get('/:id', (req, res) => {
  const { id } = req.params
  const { authorization } = req.headers

  if (!authorization) {
    client.query('SELECT * FROM pins WHERE id = $1', [id]).then((result) => {
      if (result.rows.length === 0) {
        res.status(404).send('Pin not found')
      } else {
        client
          .query('SELECT * FROM boards WHERE id = $1', [
            result.rows[0].board_id
          ])
          .then((boards) => {
            if (boards.rows[0].is_private) {
              res
                .status(401)
                .send('You do not have permission to access this private pin')
            } else {
              client
                .query('SELECT * FROM pins WHERE id = $1', [id])
                .then((pins) => {
                  res.status(200).send(pins.rows[0])
                })
            }
          })
      }
    })
  } else {
    const token = authorization.split(' ')[1]

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send('Unauthorized')
      } else {
        client
          .query('SELECT * FROM pins WHERE id = $1', [id])
          .then((result) => {
            if (result.rows.length === 0) {
              res.status(404).send('Pin not found')
            } else {
              client
                .query('SELECT * FROM boards WHERE id = $1', [
                  result.rows[0].board_id
                ])
                .then((boards) => {
                  const isPrivate = boards.rows[0].is_private
                  const userId = boards.rows[0].user_id

                  if (isPrivate && userId !== decoded.id) {
                    res
                      .status(401)
                      .send(
                        "You don't have permission to view this private pin belonging to another user."
                      )
                  } else {
                    client
                      .query('SELECT * FROM pins WHERE id = $1', [id])
                      .then((pins) => {
                        res.status(200).send(pins.rows[0])
                      })
                  }
                })
            }
          })
      }
    })
  }
})

// Delete a pin
router.delete('/:id', (req, res) => {
  const { id } = req.params

  client.query('SELECT * FROM pins WHERE id = $1', [id]).then((result) => {
    if (result.rows.length === 0) {
      res.status(404).send('Pin not found')
    } else {
      client
        .query('SELECT * FROM boards WHERE id = $1', [result.rows[0].board_id])
        .then((boards) => {
          if (boards.rows[0].user_id !== req.decoded.id) {
            res.status(401).send('Unauthorized')
          } else {
            client.query('DELETE FROM pins WHERE id = $1', [id]).then(() => {
              res.status(200).send('Pin deleted')
            })
          }
        })
    }
  })
})

module.exports = router
