const express = require("express");
const cors = require("cors");
const app = express();

const follows = require("./routes/follows");
const users = require("./routes/users");
const boards = require("./routes/boards");
const pins = require("./routes/pins");
const pin_tags = require("./routes/pin_tags");
const tags = require("./routes/tags");
const messages = require("./routes/messages");

app.use(cors());
app.use(express.json());
app.use("/follows", follows);
app.use("/users", users);
app.use("/boards", boards);
app.use("/pins", pins);
app.use("/pin_tags", pin_tags);
app.use("/tags", tags);
app.use("/messages", messages);

app.get("/", (req, res) => {
  res.send(`
  <div style="text-align: center; margin-top: 100px;">
    <h1>Backend is running</h1>
  </div>
  `);
});

app.listen(5000);
