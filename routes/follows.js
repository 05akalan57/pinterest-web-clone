const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client
    .query("SELECT * FROM follows")
    .then((follows) => res.send(follows.rows));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  client
    .query("SELECT * FROM follows WHERE id = $1", [id])
    .then((follows) => res.send(follows.rows));
});

module.exports = router;
