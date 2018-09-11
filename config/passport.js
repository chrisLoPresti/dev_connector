const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

//build our options
const options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

//export our passport
module.exports = passport => {
  passport.use(
    //use a jwt strategy with our above options, the payload we have from users.js and done function
    //find the user by the id from the payload, and if they exist send a done function
    //done(err, object)
    //if found a user , no error so send done(null, user)
    //if not found, no need for an error, send done(null, false) because no user is found
    new JWTStrategy(options, (jwt_payload, done) => {
      User.findById(jwt_payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch(err => console.log(err));
    })
  );
};
