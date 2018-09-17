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
import {
  setCurrentUser,
  logoutUser,
  validateUser
} from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import { NotificationContainer } from "react-notifications";
import "./App.css";
import PrivateRoute from "./components/common/PrivateRoute";
import CreateProfile from "./components/create-profile/CreateProfile";
import EditProfile from "./components/edit-profile/EditProfile";
import AddEducation from "./components/add-credentials/AddEducation";
import AddExperience from "./components/add-credentials/AddExperience";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import NotFound from "./components/not-found/NotFound";

//check for tokens
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
  //redunt perhaps, makes a simple get call to the api.
  //if we get a message back it means we are authenticated
  //if we get unauthorized we log the user out
  store.dispatch(validateUser());
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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:handle" component={Profile} />
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
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-education"
                  component={AddEducation}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-experience"
                  component={AddExperience}
                />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/feed" component={Posts} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>
              <Route path="/not-found" exact component={NotFound} />
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
