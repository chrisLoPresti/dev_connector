const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//load profile model
const Profile = require("../../models/Profile");
const User = require("../../models/User");
//load input validation
const validProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// set up post/get/delete etc. calls

// @route  GET api/profile/test
// @desc   Tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route  GET api/profile
// @desc   Get current users profile
// @access Private
router.get(
  "/",
  // authenticate using jwt
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    //find a user by id using the users collection
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public
router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "There are no profiles";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    });
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public
router.get("/handle/:handle", (req, res) => {
  const errors = {};
  //grab the handle from the URL using params
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    });
});

// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public
router.get("/user/:user_id", (req, res) => {
  const errors = {};
  //grab the handle from the URL using params
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(erros);
      }
      res.json(profile);
    })
    .catch(err => {
      errors.noprofile = "There is no profile for this user";
      res.status(404).json(errors);
    });
});

// @route  POST api/profile
// @desc   Create or edit user profile
// @access Private
router.post(
  "/",
  // authenticate using jwt
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //first lets validate profile input
    const { errors, isValid } = validProfileInput(req.body);
    if (!isValid) {
      //return errors with 400 status
      return res.status(400).json(errors);
    }
    //get fields and build a profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    //set their default email to be their login email
    profileFields.email = req.body.email ? req.body.email : req.user.email;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //skills - split into an array because it arrives as CSV's
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //initialize social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create

        //first check if handle is already in use
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          //if someone is using that handle return an error
          errors.handle = "Thant handle already exists";
          if (profile) {
            res.status(400).json(errors);
          }
          //now save the new profile and return it
          new Profile(profileFields)
            .save()
            .then(savedProfile => res.json(savedProfile));
        });
      }
    });
  }
);

// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private
//authenticate with jwt
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //first lets validate profile input
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      //return errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.currenty,
        description: req.body.description
      };
      //add to experience array - unshift adds to the front, push adds to the end
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route  POST api/profile/education
// @desc   Add  education to profile
// @access Private
//authenticate with jwt
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //first lets validate profile input
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      //return errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.currenty,
        description: req.body.description
      };
      //add to education array - unshift adds to the front, push adds to the end
      profile.education.unshift(newEdu);
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete experience from profile
// @access Private
//authenticate with jwt
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //splice out of array
      profile.experience.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route  DELETE api/profile/education/:edu_id
// @desc   Delete education from profile
// @access Private
//authenticate with jwt
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      //splice out of array
      profile.education.splice(removeIndex, 1);
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route  POST api/profile/experience/:exp_id
// @desc   Post call to update existing experience from profile
// @access Private
//authenticate with jwt
router.post(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //first lets validate profile input
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) {
      //return errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.currenty,
        description: req.body.description
      };
      //get remove index
      const updateIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      //update the experience
      profile.experience[updateIndex] = newExp;
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route  POST api/profile/education/:edu_id
// @desc   Post call to update existing education from profile
// @access Private
//authenticate with jwt
router.post(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //first lets validate profile input
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) {
      //return errors with 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.currenty,
        description: req.body.description
      };
      //get remove index
      const updateIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      //update the experience
      profile.education[updateIndex] = newEdu;
      profile
        .save()
        .then(profile => res.json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route  DELETE api/profile
// @desc   Delete user and profile
// @access Private
//authenticate with jwt
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
