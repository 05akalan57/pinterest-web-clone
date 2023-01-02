const express = require("express");
const client = require("../database");
const { verifyToken } = require("../middleware");

const router = express.Router();

// Create a user
router.post("/", (req, res) => {
  const { username, password, email, name } = req.body;

  client
    .query("SELECT * FROM users WHERE username = $1", [username])
    .then((result) => {
      if (result.rows.length > 0) {
        res.status(409).send("Username already exists");
      } else {
        client
          .query(
            "INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)",
            [username, password, email, name]
          )
          .then(() => {
            res.status(200).send("User created");
          });
      }
    });
});

// Delete a user
router.delete("/:id", verifyToken, (req, res) => {
  const { id } = req.params;

  if (req.decoded.id !== id) {
    return res
      .status(401)
      .send("You do not have permission to delete this user.");
  }

  client.query("DELETE FROM users WHERE username = $1", [id]).then(() => {
    res.status(200).send("User deleted");
  });
});

module.exports = router;
