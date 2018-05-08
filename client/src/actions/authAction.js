import { GET_ERRORS, SET_CURRENT_USER } from "./../constants/types";
import axios from "axios";
import jwt_decode from "jwt-decode";
import setAuthToken from "./../utils/setAuthToken";

export const createNewUser = (newUser, history) => dispatch => {
  axios
    .post("/api/users/register", newUser)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const login = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("JWT_TOKEN", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logout = () => dispatch => {
  localStorage.removeItem("JWT_TOKEN");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};
