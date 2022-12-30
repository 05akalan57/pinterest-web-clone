const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client.query("SELECT * FROM users").then((users) => res.send(users.rows));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  client
    .query("SELECT * FROM users WHERE id = $1", [id])
    .then((users) => res.send(users.rows));
});

router.post("/", (req, res) => {
  const { username, password, email, name } = req.body;
  client
    .query(
      "INSERT INTO users (username, password, email, name) VALUES ($1, $2, $3, $4)",
      [username, password, email, name]
    )
    .then((users) => res.send(users.rows));
});

module.exports = router;
