const express = require("express");
const cors = require("cors");
const client = require("./database");
const swaggerUi = require("swagger-ui-express");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/users"));
app.use("/login", require("./routes/login"));
app.use("/boards", require("./routes/boards"));
app.use("/pins", require("./routes/pins"));
app.use("/tags", require("./routes/tags"));
app.use("/pin_tags", require("./routes/pin_tags"));
app.use("/follows", require("./routes/follows"));
app.use("/messages", require("./routes/messages"));

app.use("/", swaggerUi.serve);
app.get("/", swaggerUi.setup(require("./swagger.json")));

app.get("/all", (req, res) => {
  client
    .query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
    )
    .then((result) => {
      let allData = {};

      result.rows.forEach((table, i) => {
        allData[table.table_name] = [];

        client.query(`SELECT * FROM ${table.table_name}`).then((data) => {
          allData[table.table_name] = data.rows;

          if (i === result.rows.length - 1) {
            res.send(allData);
          }
        });
      });
    });
});

app.listen(5000);
