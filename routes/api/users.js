const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// load user model
const User = require("../../models/User");

// set up post/get/delete etc. calls

// @route  GET api/users/test
// @desc   Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route  GET api/users/register
// @desc   Register a user
// @access Public
router.post("/register", (req, res) => {
  //make sure the information is valid
  const { errors, isValid } = validateRegisterInput(req.body);
  //if not valid input send the errors object
  if (!isValid) {
    return res.status(400).json(errors);
  }
  // first check to see if there is a user with the same email
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        errors.email = "Email already exists";
        // if we found a user, return an error and message saying email already exists
        return res.status(400).json(errors);
      } else {
        // else lets create a new user
        const avatar = gravatar.url(req.body.email, {
          s: "200", // size
          r: "pg", // rating
          d: "mm" // default 404 will return a default image part of gravatar
        });
        // create new user instance
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });
        // encrpyt the users password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            // if there was an error, throw it
            if (err) {
              console.log(err);
            }
            // change the users password to the hashed password
            newUser.password = hash;
            // save the new user to the DB. save will write to mongoDB
            newUser
              .save()
              .then(user => {
                res.json(user);
              })
              .catch(err => {
                console.log(err);
              });
          });
        });
      }
    })
    .catch(err => console.log(err));
});

// @route  GET api/users/login
// @desc   Login a user / return JWT token
// @access Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // find the user by email
  User.findOne({ email }).then(user => {
    //make sure login credentials are valid strings
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // if no user found return an error
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    // if user found check password
    bcrypt.compare(password, user.password).then(isMatch => {
      // if there is a match return a token
      if (isMatch) {
        // create payload for the token
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        // sign the token
        // JWT.sign(payload, secret, expiretime, function)
        JWT.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600000 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        // if no match return error
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route  GET api/users/current
// @desc   Return current user
// @access Private
router.get(
  "/current",
  // authenticate using jwt
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      id: req.user.id,
      name: req.user.name,
      enail: req.user.email,
      avatar: req.user.date,
      avatar: req.user.avatar
    });
  }
);

module.exports = router;
