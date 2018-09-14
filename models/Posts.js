const mongoose = require("mongoose");
//accessing schema from mongoose
const Schema = mongoose.Schema;

//create schema
const PostSchema = new Schema({
  user: {
    //associate the user by their id
    type: Schema.Types.ObjectId,
    //referencing the users collection
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
  likes: {
    ammount: {
      type: Number,
      default: 0
    },
    likes: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "users"
        }
      }
    ]
  },
  comments: {
    ammount: {
      type: Number,
      default: 0
    },
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
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
    ]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

//export this model with the variable name User using the above schema
// module.exports = <Variable Name> = mongoose.model("<Collection Name>", <above schema>);
module.exports = Posts = mongoose.model("posts", PostSchema);
