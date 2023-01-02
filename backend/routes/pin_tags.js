const express = require("express");
const router = express.Router();
const client = require("../database");

// Get all pin_tags
router.get("/", (req, res) => {
  client
    .query("SELECT * FROM pin_tags")
    .then((pin_tags) => res.send(pin_tags.rows));
});

module.exports = router;
