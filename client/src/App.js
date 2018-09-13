import React, { Component } from "react";
//responsible for creating routes and allowing us to move back and forth between routes
import { BrowserRouter as Router, Route } from "react-router-dom";
//provides app with a store that provides a state
import { Provider } from "react-redux";
import store from "./store/store";
import NavBar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import "./App.css";

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
