import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import InputGroup from "../common/InputGroup";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { createProfile, getCurrentProfile } from "../../actions/profileActions";
import PropTypes from "prop-types";
import isEmpty from "../../utils/isEmpty";
import { validateUser } from "../../actions/authActions";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
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

  componentDidMount() {
    this.props.validateUser();
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;
      //turn skills array back to CSV's
      const skillsCSV = profile.skills.join(",");
      //if profile field doesnt exist , make empty string
      profile.company = !isEmpty(profile.company) ? profile.company : "";
      profile.website = !isEmpty(profile.website) ? profile.website : "";
      profile.location = !isEmpty(profile.location) ? profile.location : "";
      profile.githubusername = !isEmpty(profile.githubusername)
        ? profile.githubusername
        : "";
      profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.twitter = !isEmpty(profile.social.twitter)
        ? profile.social.twitter
        : "";
      profile.facebook = !isEmpty(profile.social.facebook)
        ? profile.social.facebook
        : "";
      profile.linkedin = !isEmpty(profile.social.linkedin)
        ? profile.social.linkedin
        : "";
      profile.youtube = !isEmpty(profile.social.youtube)
        ? profile.social.youtube
        : "";
      profile.instagram = !isEmpty(profile.social.instagram)
        ? profile.social.instagram
        : "";
      // set component field state
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        githubusername: profile.githubusername,
        bio: profile.bio,
        linkedin: profile.linkedin,
        twitter: profile.twitter,
        facebook: profile.facebook,
        instagram: profile.instagram,
        youtube: profile.youtube
      });
    }
  }
  // addhttp = url => {
  //   const regEx = /^(f|ht)tps?:\/\//;
  //   if (!regEx.test(url)) {
  //     url = "http://" + url;
  //   }
  //   return url;
  // };
  //using an arrow function allows us to maintain the state, so we dont need to bind the function in the constructor or when its called
  onHandleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handeToggleSocialMedia = () => {
    this.setState(prevState => ({
      displaySocialInputs: !prevState.displaySocialInputs
    }));
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
    const newProfile = {
      displaySocialInputs,
      handle,
      company,
      website: website,
      location,
      status,
      skills,
      githubusername,
      bio,
      facebook: facebook,
      twitter: twitter,
      linkedin: linkedin,
      youtube: youtube,
      instagram: instagram
    };
    this.props.createProfile(newProfile, this.props.history);
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
              <h1 className="display-4 text-center">Edit Profile</h1>
              <p className="lead text-center">
                Let's get some information to make your profile stand out
              </p>
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
                      type="text"
                      placeholder="Twitter Profile URL"
                      name="twitter"
                      value={twitter}
                      onChange={this.onHandleChange}
                      icon="fab fa-twitter"
                    />
                    <InputGroup
                      error={errors.facebook}
                      type="text"
                      placeholder="Facebook Profile URL"
                      name="facebook"
                      value={facebook}
                      onChange={this.onHandleChange}
                      icon="fab fa-facebook"
                    />
                    <InputGroup
                      error={errors.linkedin}
                      type="text"
                      placeholder="Linkedin Profile URL"
                      name="linkedin"
                      value={linkedin}
                      onChange={this.onHandleChange}
                      icon="fab fa-linkedin"
                    />
                    <InputGroup
                      error={errors.youtube}
                      type="text"
                      placeholder="YouTube Channel URL"
                      name="youtube"
                      value={youtube}
                      onChange={this.onHandleChange}
                      icon="fab fa-youtube"
                    />
                    <InputGroup
                      error={errors.instagram}
                      type="text"
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

EditProfile.proptypes = {
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired,
  validateUser: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { createProfile, getCurrentProfile, validateUser }
)(withRouter(EditProfile));
