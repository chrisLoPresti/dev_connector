import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { createProfile } from "../../actions/profileActions";
import PropTypes from "prop-types";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(localStorage.getItem("profileForm")) || {
      displaySocialInputs: false,
      handle: "",
      company: "",
      website: "",
      location: "",
      status: "",
      skills: "",
      githubusername: "",
      bio: "",
      twitter: "",
      facebook: "",
      linkedin: "",
      youtube: "",
      instagram: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  //using an arrow function allows us to maintain the state, so we dont need to bind the function in the constructor or when its called
  onHandleChange = event => {
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      () => localStorage.setItem("profileForm", JSON.stringify(this.state))
    );
  };

  handeToggleSocialMedia = () => {
    this.setState(prevState => ({
      displaySocialInputs: !prevState.displaySocialInputs
    }));
  };

  addhttp = url => {
    const regEx = /^(f|ht)tps?:\/\//;
    if (!regEx.test(url)) {
      url = "http://" + url;
    }
    return url;
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      displaySocialInputs,
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram
    } = this.state;

    const newwebsite = this.addhttp(website);
    const newfacebook = this.addhttp(facebook);
    const newtwitter = this.addhttp(twitter);
    const newyoutube = this.addhttp(youtube);
    const newinstagram = this.addhttp(instagram);
    const newlinkedin = this.addhttp(linkedin);

    const newProfile = {
      displaySocialInputs,
      handle,
      company,
      website: newwebsite,
      location,
      status,
      skills,
      githubusername,
      bio,
      facebook: newfacebook,
      twitter: newtwitter,
      linkedin: newlinkedin,
      youtube: newyoutube,
      instagram: newinstagram
    };
    this.props.createProfile(newProfile, this.props.history);
    localStorage.removeItem("profileForm");
  };

  onClearForm = () => {
    this.setState(
      {
        displaySocialInputs: false,
        handle: "",
        company: "",
        website: "",
        location: "",
        status: "",
        skills: "",
        githubusername: "",
        bio: "",
        twitter: "",
        facebook: "",
        linkedin: "",
        youtube: "",
        instagram: "",
        errors: {}
      },
      () => localStorage.removeItem("profileForm")
    );
  };

  render() {
    const {
      displaySocialInputs,
      handle,
      company,
      website,
      location,
      status,
      skills,
      githubusername,
      bio,
      twitter,
      facebook,
      linkedin,
      youtube,
      instagram,
      errors
    } = this.state;

    const options = [
      {
        label: "* Select Professional Status",
        value: 0
      },
      {
        label: "Developer",
        value: "Developer"
      },
      {
        label: "Junior Developer",
        value: "Junior Developer"
      },
      {
        label: "Senior Developer",
        value: "Senior Developer"
      },
      {
        label: "Manager",
        value: "Manager"
      },
      {
        label: "Student or Learning",
        value: "Student or Learning"
      },
      {
        label: "Instructor or Teacher",
        value: "Instructor or Teacher"
      },
      {
        label: "Inter",
        value: "Inter"
      },
      {
        label: "Other",
        value: "Other"
      }
    ];
    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Create Your Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
              <button
                className="btn btn-sm btn-info"
                style={{ float: "right", marginBottom: "20px" }}
                onClick={this.onClearForm}
              >
                Clear Form
              </button>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.handleSubmit}>
                <TextFieldGroup
                  error={errors.handle}
                  type="text"
                  placeholder="* Profile Handle"
                  name="handle"
                  value={handle}
                  onChange={this.onHandleChange}
                  info="A unique handle for your profile URL. Your full name, company name, nickname, etc (This CAN'T be changed later)"
                  required
                />
                <SelectListGroup
                  error={errors.status}
                  options={options}
                  placeholder="Status"
                  name="status"
                  value={status}
                  onChange={this.onHandleChange}
                  info="Give us an idea of where you are at in your career"
                  required
                />
                <TextFieldGroup
                  error={errors.company}
                  type="text"
                  placeholder="Company"
                  name="company"
                  value={company}
                  onChange={this.onHandleChange}
                  info="Could be your own company or one you work for"
                />
                <TextFieldGroup
                  error={errors.website}
                  type="text"
                  placeholder="Website"
                  name="website"
                  value={website}
                  onChange={this.onHandleChange}
                  info="Could be your own or a company website"
                />
                <TextFieldGroup
                  error={errors.location}
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={location}
                  onChange={this.onHandleChange}
                  info="City & state suggested (eg. Miami, FL)"
                />
                <TextFieldGroup
                  error={errors.skills}
                  type="text"
                  placeholder="* Skills"
                  name="skills"
                  value={skills}
                  onChange={this.onHandleChange}
                  info="Please use comma separated values (eg.
                    HTML,CSS,JavaScript,PHP)"
                />
                <TextFieldGroup
                  error={errors.githubusername}
                  type="text"
                  placeholder="Github Username"
                  name="githubusername"
                  value={githubusername}
                  onChange={this.onHandleChange}
                  info="If you want your latest repos and a Github link, include
                  your username"
                />
                <TextAreaFieldGroup
                  error={errors.bio}
                  type="text"
                  placeholder="A short bio about yourself"
                  name="bio"
                  value={bio}
                  onChange={this.onHandleChange}
                  info=" Tell us a little about yourself"
                />
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={this.handeToggleSocialMedia}
                  >
                    Add Social Network Links
                  </button>
                  <span className="text-muted"> Optional</span>
                </div>
                {displaySocialInputs && (
                  <div>
                    <InputGroup
                      error={errors.twitter}
                      type="url"
                      placeholder="Twitter Profile URL"
                      name="twitter"
                      value={twitter}
                      onChange={this.onHandleChange}
                      icon="fab fa-twitter"
                    />
                    <InputGroup
                      error={errors.facebook}
                      type="url"
                      placeholder="Facebook Profile URL"
                      name="facebook"
                      value={facebook}
                      onChange={this.onHandleChange}
                      icon="fab fa-facebook"
                    />
                    <InputGroup
                      error={errors.linkedin}
                      type="url"
                      placeholder="Linkedin Profile URL"
                      name="linkedin"
                      value={linkedin}
                      onChange={this.onHandleChange}
                      icon="fab fa-linkedin"
                    />
                    <InputGroup
                      error={errors.youtube}
                      type="url"
                      placeholder="YouTube Channel URL"
                      name="youtube"
                      value={youtube}
                      onChange={this.onHandleChange}
                      icon="fab fa-youtube"
                    />
                    <InputGroup
                      error={errors.instagram}
                      type="url"
                      placeholder="Instagram Page URL"
                      name="instagram"
                      value={instagram}
                      onChange={this.onHandleChange}
                      icon="fab fa-instagram"
                    />
                  </div>
                )}
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.proptypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile }
)(withRouter(CreateProfile));
