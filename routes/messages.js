const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client
    .query("SELECT * FROM messages")
    .then((messages) => res.send(messages.rows));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  client
    .query("SELECT * FROM messages WHERE id = $1", [id])
    .then((messages) => res.send(messages.rows));
});

module.exports = router;
