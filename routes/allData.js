const express = require("express");
const router = express.Router();
const client = require("../database");

router.get("/", (req, res) => {
  client
    .query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    )
    .then((users) => {
      let allData = {};

      users.rows.forEach((table, i) => {
        allData[table.table_name] = [];

        client.query(`SELECT * FROM ${table.table_name}`).then((data) => {
          allData[table.table_name] = data.rows;

          if (i === users.rows.length - 1) {
            res.send(allData);
          }
        });
      });
    });
});

module.exports = router;
