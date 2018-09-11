const express = require("express");
const mongoose = require("mongoose");

//set up routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//variable to hold new express app
const app = express();
//databse config
const dataBase = require("./config/keys").mongoURI;
//conenct to mongoDB
mongoose
  .connect(dataBase)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello"));

// use routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}...`));
