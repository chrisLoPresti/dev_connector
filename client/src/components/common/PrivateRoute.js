import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

//if we are authenticated we can proceed to the next route else redirect to login...
const PrivateRoute = ({ component: Component, auth, errors, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (auth.isAuthenticated) {
        return (
          <div>
            <Component {...props} />
          </div>
        );
      } else {
        return (
          <div>
            <Redirect to="/login" />;
          </div>
        );
      }
    }}
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps)(PrivateRoute);
