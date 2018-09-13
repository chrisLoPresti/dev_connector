import axios from "axios";
import { NotificationManager } from "react-notifications";

import { GET_ERRORS } from "./types";

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
