const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  let errors = {};

  //making sure the required information we have is a string, or an empty string to use isEmpty
  data.text = !isEmpty(data.text) ? data.text : "";

  //creating error object
  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }
  if (!Validator.isLength(data.text, { min: 2, max: 300 })) {
    errors.text = "Post must be between 2 and 300 character";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
