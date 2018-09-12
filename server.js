// 'manager' of the server
const express = require("express");
// allows us to connect to mongoDB
const mongoose = require("mongoose");
// allows us to parse requests as json
const bodyParser = require("body-parser");
// used for authentication
const passport = require("passport");

//set up routes
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

//variable to hold new express app
const app = express();

// body parser middleware for parsing requests as json
// tells the system whether you want to use a simple algorithm for shallow parsing (i.e. false) or complex algorithm for deep parsing that can deal with nested objects (i.e. true
app.use(bodyParser.urlencoded({ extended: false }));
// lets the 'manager' know we want json to be used
app.use(bodyParser.json());

//databse config
const dataBase = require("./config/keys").mongoURI;

//conenct to mongoDB
mongoose
  .connect(
    dataBase,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

//passport middleware - used for authentication
app.use(passport.initialize());
// app.use(passport.session());

//passport config
require("./config/passport")(passport);

//use routes => incoming requests will be appropraitely routed
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

//use the env. server port or localhost:5000
const port = process.env.PORT || 5000;

//listen on the port for incoming requests
app.listen(port, () => console.log(`Server running on port ${port}...`));
