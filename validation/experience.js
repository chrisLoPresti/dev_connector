const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  //making sure the information we have is a string, or an empty string to use isEmpty
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  //creating error object
  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company name is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From date is required";
  }
  if (!Validator.isEmpty(data.from) && !Validator.isEmpty(data.to)) {
    if (data.from > data.to) {
      errors.from = "From date is greater than To date";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
