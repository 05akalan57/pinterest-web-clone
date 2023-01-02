const express = require("express");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const client = require("../database");
const { verifyToken } = require("../middleware");

const router = express.Router();

dotenv.config();

// Create a pin
router.post("/", verifyToken, (req, res) => {
  const { name, image_url, board_id } = req.body;

  client
    .query("SELECT * FROM boards WHERE id = $1 AND user_id = $2", [
      board_id,
      req.decoded.id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return res
          .status(401)
          .send("You are not authorized to create a pin on this board");
      }
      client
        .query(
          "INSERT INTO pins (name, image_url, board_id) VALUES ($1, $2, $3)",
          [name, image_url, board_id]
        )
        .then(() => {
          res.status(200).send("Pin created");
        });
    });
});

// Get all pins
router.get("/", verifyToken, (req, res) => {
  client
    .query("SELECT * FROM boards WHERE user_id = $1", [req.decoded.id])
    .then((result) => {
      const boardIds = result.rows.map((board) => board.id);

      client
        .query(
          "SELECT * FROM pins WHERE board_id IN (" +
            boardIds.map((id, index) => `$${index + 1}`).join(", ") +
            ")",
          boardIds
        )
        .then((result) => {
          res.status(200).send(result.rows);
        });
    });
});

// Get a pin
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const authorization = req.headers.authorization;

  if (!authorization) {
    client.query("SELECT * FROM pins WHERE id = $1", [id]).then((result) => {
      if (result.rows.length === 0) {
        return res.status(404).send("Pin not found");
      }

      client
        .query("SELECT * FROM boards WHERE id = $1", [result.rows[0].board_id])
        .then((result) => {
          if (result.rows[0].is_private) {
            return res
              .status(401)
              .send("You do not have permission to access this private pin");
          }

          client
            .query("SELECT * FROM pins WHERE id = $1", [id])
            .then((result) => {
              res.status(200).send(result.rows[0]);
            });
        });
    });
  } else {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }

      client.query("SELECT * FROM pins WHERE id = $1", [id]).then((result) => {
        if (result.rows.length === 0) {
          return res.status(404).send("Pin not found");
        }

        client
          .query("SELECT * FROM boards WHERE id = $1", [
            result.rows[0].board_id,
          ])
          .then((result) => {
            if (
              result.rows[0].is_private &&
              result.rows[0].user_id !== decoded.id
            ) {
              return res
                .status(401)
                .send(
                  "You don't have permission to view this private pin belonging to another user."
                );
            }

            client
              .query("SELECT * FROM pins WHERE id = $1", [id])
              .then((result) => {
                res.status(200).send(result.rows[0]);
              });
          });
      });
    });
  }
});

// Delete a pin
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  client.query("SELECT * FROM pins WHERE id = $1", [id]).then((result) => {
    if (result.rows.length === 0) {
      return res.status(404).send("Pin not found");
    }

    client
      .query("SELECT * FROM boards WHERE id = $1", [result.rows[0].board_id])
      .then((result) => {
        if (result.rows[0].user_id !== req.decoded.id) {
          return res.status(401).send("Unauthorized");
        }

        client.query("DELETE FROM pins WHERE id = $1", [id]).then(() => {
          res.status(200).send("Pin deleted");
        });
      });
  });
});

module.exports = router;
