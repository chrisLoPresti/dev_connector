const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load Post model
const Posts = require("../../models/Posts");
//load Profile model
const Proflie = require("../../models/Profile");

//load validation
const validatePostInput = require("../../validation/post");

// set up post/get/delete etc. calls

// @route  GET api/posts/test
// @desc   Tests post route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route  Get api/posts
// @desc   Get post
// @access Public
router.get("/", (req, res) => {
  const errors = {};
  Posts.find()
    //sort all posts by date decending order
    .sort({ date: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      errors.posts = "There are no posts found";
      res.status(404).json(errors);
    });
});

// @route  Get api/posts/:id
// @desc   Get post
// @access Public
router.get("/:id", (req, res) => {
  const errors = {};
  Posts.findById(req.params.id)
    .then(post => {
      res.json(post);
    })
    .catch(err => {
      errors.post = "There are no posts with that id";
      res.status(404).json(errors);
    });
});

// @route  DELETE api/posts/:id
// @desc   Get post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Posts.findById(req.params.id)
        .then(post => {
          //check to make sure the post owner is the one deleting
          if (post.user.toString() !== req.user.id) {
            //401 is an unauthorized status
            return res
              .status(401)
              .json({ notauthorized: "User not authorized" });
          }
          //cleared to delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Posts({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route  POST api/posts/like/:id
// @desc   Like a post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Posts.findById(req.params.id)
        .then(post => {
          //if this user has already liked this post
          if (
            post.likes.likes.filter(
              like => like.user.toString() === req.user.id
            ).length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this post" });
          }
          //else add user id to likes array
          post.likes.likes.unshift({ user: req.user.id });
          post.likes.ammount = post.likes.likes.length;
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route  DELETE api/posts/unlike/:id
// @desc   Unlike a post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Posts.findById(req.params.id)
        .then(post => {
          //if this user has already liked this post
          if (
            post.likes.likes.filter(
              like => like.user.toString() === req.user.id
            ).length === 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "You have not liked this post yet" });
          }
          //remove the user from the likes array
          const removeIndex = post.likes.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);
          //now splice it out
          post.likes.likes.splice(removeIndex, 1);
          post.likes.ammount = post.likes.likes.length;
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found" }));
    });
  }
);

// @route  POST api/posts/comment/:id
// @desc   Add comment to a post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Posts.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        //add to comments array
        post.comments.comments.unshift(newComment);
        post.comments.ammount = post.comments.comments.length;
        post.save().then(res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Remove a comment from a post
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Posts.findById(req.params.id)
      .then(post => {
        //first check to see if the comment exists
        if (
          post.comments.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          //comment doest exist
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        //comment does exist
        const removeIndex = post.comments.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);
        //splice it out
        post.comments.comments.splice(removeIndex, 1);
        post.comments.ammount = post.comments.comments.length;
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "No post found" }));
  }
);

module.exports = router;
