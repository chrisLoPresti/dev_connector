import axios from "axios";

//if a token exist attach it to every request else delete it from every request
const setAuthToken = token => {
  if (token) {
    //apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    //delete auth header
    delete axios.defaults.headers.common["Authorization"];
  }
};
export default setAuthToken;
