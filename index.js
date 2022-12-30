const express = require("express");

const app = express();

const allData = require("./routes/allData");
const users = require("./routes/users");
const boards = require("./routes/boards");
const pins = require("./routes/pins");
const tags = require("./routes/tags");
const pinTags = require("./routes/pinTags");
const follows = require("./routes/follows");
const messages = require("./routes/messages");

app.use("/allData", allData);
app.use("/users", users);
app.use("/boards", boards);
app.use("/pins", pins);
app.use("/tags", tags);
app.use("/pinTags", pinTags);
app.use("/follows", follows);
app.use("/messages", messages);

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the backend 😊</h1>

    <p>Here are the available routes:</p>
  
    <li>
        <a href="/allData">/allData</a>
    </li>
    <li>
        <a href="/users">/users</a>
    </li>
    <li>
        <a href="/boards">/boards</a>
    </li>
    <li>
        <a href="/pins">/pins</a>
    </li>
    <li>
        <a href="/tags">/tags</a>
    </li>
    <li>
        <a href="/pinTags">/pinTags</a>
    </li>
    <li>
        <a href="/follows">/follows</a>
    </li>
    <li>
        <a href="/messages">/messages</a>
    </li>
  `);
});

app.listen(5000);
