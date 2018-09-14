import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { NotificationManager } from "react-notifications";
import { GET_ERRORS, SET_CURRENT_USER } from "../actions/types";

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
      dispatch(removeErrors());
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
  dispatch(removeErrors());
};

export const removeErrors = () => {
  return {
    type: GET_ERRORS,
    payload: {}
  };
};
