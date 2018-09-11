const mongoose = require("mongoose");
//accessing schema from mongoose
const Schema = mongoose.Schema;

// create schema for a user
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export this model with the variable name User using the above schema
// module.exports = <Variable Name> = mongoose.model("<Collection Name>", <above schema>);
module.exports = User = mongoose.model("users", UserSchema);
