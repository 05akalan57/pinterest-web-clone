const express = require("express");
const router = express.Router();
const client = require("../database");

// GET all pins
router.get("/", (req, res) => {
  client.query("SELECT * FROM pins").then((pins) => res.send(pins.rows));
});

// POST a new pin
router.post("/", (req, res) => {
  const { name, image_url, board_id } = req.body;

  client
    .query("INSERT INTO pins (name, image_url, board_id) VALUES ($1, $2, $3)", [
      name,
      image_url,
      board_id,
    ])
    .then(() => {
      client.query("SELECT * FROM pins").then((pins) => res.send(pins.rows));
    });
});

// DELETE a pin
router.delete("/", (req, res) => {
  const { id } = req.body;

  client.query("DELETE FROM pins WHERE id = $1", [id]).then(() => {
    client.query("SELECT * FROM pins").then((pins) => res.send(pins.rows));
  });
});

module.exports = router;
