const express = require("express");
const router = express.Router();
const client = require("../database");

// GET all users
router.get("/", (req, res) => {
  client.query("SELECT * FROM users").then((users) => res.send(users.rows));
});

// POST a new user
router.post("/", (req, res) => {
  const { username, password, email, name } = req.body;

  client
    .query(
      "INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)",
      [username, password, email, name]
    )
    .then(() => {
      client.query("SELECT * FROM users").then((users) => res.send(users.rows));
    });
});

// DELETE a user
router.delete("/", (req, res) => {
  const { id } = req.body;

  client.query("DELETE FROM users WHERE id = $1", [id]).then(() => {
    client.query("SELECT * FROM users").then((users) => res.send(users.rows));
  });
});

module.exports = router;
