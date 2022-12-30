const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client.query("SELECT * FROM boards").then((boards) => res.send(boards.rows));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  client
    .query("SELECT * FROM boards WHERE id = $1", [id])
    .then((boards) => res.send(boards.rows));
});

module.exports = router;
