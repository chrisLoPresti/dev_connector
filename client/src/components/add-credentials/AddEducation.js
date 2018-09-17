import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addEducation } from "../../actions/profileActions";
import { logoutUser } from "../../actions/authActions";

class AddEducation extends Component {
  constructor() {
    super();
    this.state = JSON.parse(localStorage.getItem("educationForm")) || {
      school: "",
      degree: "",
      fieldofstudy: "",
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
      () => localStorage.setItem("educationForm", JSON.stringify(this.state))
    );
  };

  onCheck = () => {
    this.setState(
      {
        current: !this.state.current,
        disabled: !this.state.disabled
      },
      () => localStorage.setItem("educationForm", JSON.stringify(this.state))
    );
  };

  onSubmit = event => {
    event.preventDefault();
    const {
      school,
      current,
      degree,
      fieldofstudy,
      from,
      to,
      description
    } = this.state;

    const expData = {
      school,
      degree,
      fieldofstudy,
      from,
      to: !current ? to : "",
      current,
      description
    };

    this.props.addEducation(expData, this.props.history);
    localStorage.removeItem("educationForm");
  };

  onClearForm = () => {
    this.setState(
      {
        school: "",
        degree: "",
        fieldofstudy: "",
        from: "",
        to: "",
        current: false,
        description: "",
        errors: {},
        disabled: false
      },
      () => localStorage.removeItem("educationForm")
    );
  };
  render() {
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
      errors,
      disabled
    } = this.state;
    return (
      <div className="section add-education">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <Link to="/dashboard" className="btn btn-light">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Your Education</h1>
              <p className="lead text-center">
                Add any school, bootcamp, etc. that you have attended
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
                  error={errors.school}
                  type="text"
                  placeholder="* Name of school"
                  name="school"
                  value={school}
                  onChange={this.onHandleChange}
                  required
                />
                <TextFieldGroup
                  error={errors.degree}
                  type="text"
                  placeholder="* Degree"
                  name="degree"
                  value={degree}
                  onChange={this.onHandleChange}
                  required
                />
                <TextFieldGroup
                  error={errors.fieldofstudy}
                  type="text"
                  placeholder="* Field of Study"
                  name="fieldofstudy"
                  value={fieldofstudy}
                  onChange={this.onHandleChange}
                  required
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
                    Current School
                  </label>
                </div>
                <TextAreaFieldGroup
                  error={errors.description}
                  type="text"
                  placeholder="Programm Description"
                  name="description"
                  value={description}
                  onChange={this.onHandleChange}
                  info="Tell us about the program that you were in"
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

AddEducation.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  addEducation: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { addEducation, logoutUser }
)(withRouter(AddEducation));
