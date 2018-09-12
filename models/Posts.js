const mongoose = require("mongoose");
const Schema = mongoose.schema;

//create schema
const PostSchema = new Schema({
  user: {
    type: Schema.types.ObjectId,
    ref: "users"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.types.ObjectId,
        ref: "users"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.types.ObjectId,
        ref: "users"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

//export this model with the variable name User using the above schema
// module.exports = <Variable Name> = mongoose.model("<Collection Name>", <above schema>);
module.exports = Post = mongoose.model("post", PostSchema);
