const express = require("express");
const router = express.Router();
const client = require("../database");

// GET all tags
router.get("/", (req, res) => {
  client.query("SELECT * FROM tags").then((tags) => res.send(tags.rows));
});

module.exports = router;
