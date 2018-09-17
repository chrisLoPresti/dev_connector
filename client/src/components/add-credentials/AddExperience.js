import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addExperience } from "../../actions/profileActions";
import { logoutUser } from "../../actions/authActions";

class AddExperience extends Component {
  constructor() {
    super();
    this.state = JSON.parse(localStorage.getItem("experienceForm")) || {
      company: "",
      title: "",
      location: "",
      from: "",
      to: "",
      current: false,
      description: "",
      errors: {},
      disabled: false
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
      () => localStorage.setItem("experienceForm", JSON.stringify(this.state))
    );
  };

  onCheck = () => {
    this.setState(
      {
        current: !this.state.current,
        disabled: !this.state.disabled
      },
      () => localStorage.setItem("experienceForm", JSON.stringify(this.state))
    );
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      company,
      current,
      title,
      location,
      from,
      to,
      description
    } = this.state;

    const expData = {
      company,
      title,
      location,
      from,
      to: !current ? to : "",
      current,
      description
    };

    this.props.addExperience(expData, this.props.history);
    localStorage.removeItem("experienceForm");
  };

  onClearForm = () => {
    this.setState(
      {
        company: "",
        title: "",
        location: "",
        from: "",
        to: "",
        current: false,
        description: "",
        errors: {},
        disabled: false
      },
      () => localStorage.removeItem("experienceForm")
    );
  };

  render() {
    const {
      company,
      title,
      location,
      from,
      to,
      current,
      description,
      errors,
      disabled
    } = this.state;
    return (
      <div className="section add-experience">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Your Experience</h1>
              <p className="lead text-center">
                Add any developer/programming positions that you have had in the
                past
              </p>
              <button
                className="btn btn-sm btn-info"
                style={{ float: "right", marginBottom: "20px" }}
                onClick={this.onClearForm}
              >
                Clear Form
              </button>
              <small className="d-block pb-3">* = required field</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  error={errors.title}
                  type="text"
                  placeholder="* Job Title"
                  name="title"
                  value={title}
                  onChange={this.onHandleChange}
                  required
                />
                <TextFieldGroup
                  error={errors.company}
                  type="text"
                  placeholder="* Company"
                  name="company"
                  value={company}
                  onChange={this.onHandleChange}
                  required
                />
                <TextFieldGroup
                  error={errors.location}
                  type="text"
                  placeholder="Location"
                  name="location"
                  value={location}
                  onChange={this.onHandleChange}
                />
                <h6>* From Date</h6>
                <TextFieldGroup
                  error={errors.from}
                  type="date"
                  placeholder="From"
                  name="from"
                  value={from}
                  onChange={this.onHandleChange}
                  required
                />
                <h6>* To Date</h6>
                <TextFieldGroup
                  error={errors.to}
                  type="date"
                  placeholder="To"
                  name="to"
                  value={to}
                  onChange={this.onHandleChange}
                  disabled={disabled ? "disabled" : ""}
                  required
                />
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="current"
                    value={current}
                    checked={current}
                    onClick={this.onCheck}
                    id="current"
                  />
                  <label htmlFor="current" className="form-check-label">
                    Current Job
                  </label>
                </div>
                <TextAreaFieldGroup
                  error={errors.description}
                  type="text"
                  placeholder="Job Description"
                  name="description"
                  value={description}
                  onChange={this.onHandleChange}
                  info="Some of your responsabilities, etc"
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddExperience.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  addExperience: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addExperience, logoutUser }
)(withRouter(AddExperience));
