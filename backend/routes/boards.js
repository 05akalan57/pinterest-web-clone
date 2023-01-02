const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const client = require("../database");
const { verifyToken } = require("../middleware");

const router = express.Router();

dotenv.config();

// Create a board
router.post("/", verifyToken, (req, res) => {
  const { name, is_private } = req.body;

  client
    .query("SELECT * FROM boards WHERE name = $1 AND user_id = $2", [
      name,
      req.decoded.id,
    ])
    .then((result) => {
      if (result.rows.length > 0) {
        return res.status(200).send("Board already exists");
      }

      client
        .query(
          "INSERT INTO boards (name, user_id, is_private) VALUES ($1, $2, $3)",
          [name, req.decoded.id, is_private]
        )
        .then(() => {
          res.status(200).send("Board created");
        });
    });
});

// Get all boards
router.get("/", verifyToken, (req, res) => {
  client
    .query("SELECT * FROM boards WHERE user_id = $1", [req.decoded.id])
    .then((result) => {
      res.status(200).json(result.rows);
    });
});

// Get a board
router.get("/:board_id", (req, res) => {
  const { board_id } = req.params;
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        client
          .query("SELECT * FROM boards WHERE id = $1 AND is_private = false", [
            board_id,
          ])
          .then((result) => {
            if (result.rows.length === 0) {
              return res.status(404).send("Board not found");
            }

            res.status(200).send(result.rows[0]);
          });
      } else {
        client
          .query("SELECT * FROM boards WHERE id = $1 AND user_id = $2", [
            board_id,
            decoded.id,
          ])
          .then((result) => {
            if (result.rows.length === 0) {
              return res.status(404).send("Board not found");
            }

            res.status(200).send(result.rows[0]);
          });
      }
    });
  } else {
    client
      .query("SELECT * FROM boards WHERE id = $1 AND is_private = false", [
        board_id,
      ])
      .then((result) => {
        if (result.rows.length === 0) {
          return res.status(404).send("Board not found");
        }

        res.status(200).send(result.rows[0]);
      });
  }
});

// Delete a board
router.delete("/:board_id", verifyToken, (req, res) => {
  client
    .query("DELETE FROM boards WHERE id = $1 AND user_id = $2", [
      req.params.board_id,
      req.decoded.id,
    ])
    .then((result) => {
      if (result.rowCount == 0) {
        return res.status(400).send("Board not found");
      }

      res.status(200).send("Board deleted");
    });
});

module.exports = router;
