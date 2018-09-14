import React, { Component } from "react";
//responsible for creating routes and allowing us to move back and forth between routes
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
//provides app with a store that provides a state
import { Provider } from "react-redux";
import store from "./store/store";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import "react-notifications/lib/notifications.css";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import { NotificationContainer } from "react-notifications";
import "./App.css";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";

//check for token
if (localStorage.jwtToken) {
  //set the auth token header auth
  setAuthToken(localStorage.jwtToken);
  //decode the token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken);
  //now set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  //check for expired tokens
  const currentTime = Date.now() / 1000;
  console.log(decoded.exp);
  console.log(currentTime);

  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    store.dispatch(clearCurrentProfile());
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <NavBar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {/* switch allows for the redirect to actually happen */}
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-profile"
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-profile"
                  component={EditProfile}
                />
              </Switch>
            </div>
            <Footer />
            <NotificationContainer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
