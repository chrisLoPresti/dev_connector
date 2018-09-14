import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }
  //using an arrow function allows us to maintain the state, so we dont need to bind the function in the constructor or when its called
  onHandleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    event.preventDefault();
    const { name, email, password, password2 } = this.state;
    const newUser = {
      name,
      email,
      password,
      password2
    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { name, email, password, password2, errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">Sign Up</h1>
              <p className="lead text-center">
                Create your DevConnector account
              </p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  error={errors.name}
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={this.onHandleChange}
                  required
                />
                <TextFieldGroup
                  error={errors.email}
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={email}
                  onChange={this.onHandleChange}
                  info="
                  This site uses Gravatar so if you want a profile image, use a
                  Gravatar email"
                  required
                />
                <TextFieldGroup
                  error={errors.password}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={this.onHandleChange}
                  required
                />
                <TextFieldGroup
                  error={errors.password2}
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={this.onHandleChange}
                  required
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

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
