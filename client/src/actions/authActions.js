import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { NotificationManager } from "react-notifications";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_PROFILE,
  GET_PROFILES,
  GET_POST,
  GET_POSTS
} from "../actions/types";
import { clearCurrentProfile } from "./profileActions";

//validaet user
export const validateUser = () => dispatch => {
  if (localStorage.jwtToken) {
    //decode the token and get user info and expiration
    const decoded = jwt_decode(localStorage.jwtToken);
    if (!axios.defaults.headers.common["Authorization"]) {
      //set the auth token header auth
      setAuthToken(localStorage.jwtToken);
      //now set user and isAuthenticated
      dispatch(setCurrentUser(decoded));
    }

    //check for expired tokens
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      dispatch(logoutUser());
      dispatch(clearCurrentProfile());
    }
  }
};

// register user
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => {
      history.push("/login");
      NotificationManager.success(
        "You may now log in",
        "Registered Successfully",
        3000
      );
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

//login get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //save to local storage
      const { token } = res.data;
      //set token to local storage
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      //decode the token so we can get user data
      const decoded = jwt_decode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
      dispatch({
        type: GET_ERRORS,
        payload: {}
      });
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//logout user
export const logoutUser = () => dispatch => {
  //first remove the token from local storage
  localStorage.removeItem("jwtToken");
  //remove the auth header for future requests
  setAuthToken(false);
  //set the current user to an empty object and isAuthenticated to false
  dispatch(setCurrentUser({}));
  dispatch({
    type: GET_ERRORS,
    payload: {}
  });
  dispatch({
    type: GET_PROFILE,
    payload: {}
  });
  dispatch({
    type: GET_PROFILES,
    payload: {}
  });
  dispatch({
    type: GET_POST,
    payload: {}
  });
  dispatch({
    type: GET_POSTS,
    payload: {}
  });
};
