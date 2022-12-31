const express = require("express");
const router = express.Router();
const client = require("../database");

// GET all follows
router.get("/", (req, res) => {
  client
    .query("SELECT * FROM follows")
    .then((follows) => res.send(follows.rows));
});

module.exports = router;
