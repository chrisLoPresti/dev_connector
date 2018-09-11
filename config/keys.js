const uuid = require("uuid");
module.exports = {
  //key to connect to mongoDB
  mongoURI: "mongodb://chris:Clopresti21@ds251632.mlab.com:51632/dev-connector",
  //secret or key for json web token
  secretOrKey: uuid()
};
