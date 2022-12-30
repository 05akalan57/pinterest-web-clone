const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client
    .query("SELECT * FROM pin_tags")
    .then((pin_tags) => res.send(pin_tags.rows));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  client
    .query("SELECT * FROM pin_tags WHERE id = $1", [id])
    .then((pin_tags) => res.send(pin_tags.rows));
});

module.exports = router;
