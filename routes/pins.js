const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client.query("SELECT * FROM pins").then((pins) => res.send(pins.rows));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  client
    .query("SELECT * FROM pins WHERE id = $1", [id])
    .then((pins) => res.send(pins.rows));
});

module.exports = router;
