const express = require("express");
const router = express.Router();
const client = require("../database");

// GET all boards
router.get("/", (req, res) => {
  client.query("SELECT * FROM boards").then((boards) => res.send(boards.rows));
});

module.exports = router;
