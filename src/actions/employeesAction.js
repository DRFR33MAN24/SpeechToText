import axios from "axios";
import {
  AUTH_ERROR,
  EMPLOYEE_ADDED,
  EMPLOYEES_LOADED,
  EMPLOYEES_LOADING,
  EMPLOYEE_IMG_LOADING,
  EMPLOYEE_IMG_LOADED,
  NO_ERROR
} from "./types";
import { tokenConfig } from "./authAction";
import { returnErrors } from "./errorAction";
const proxy = "http://localhost:5000";
// Check token & load user
export const getEmployees = () => (dispatch, getState) => {
  console.log("getEmployees called");

  dispatch({ type: EMPLOYEES_LOADING });

  axios
    .post(`${proxy}/api/employees`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: EMPLOYEES_LOADED,
        payload: res.data
      });
    })

    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, AUTH_ERROR)
      );
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const getEmployeeImg = ({ phone }) => (dispatch, getState) => {
  console.log("getEmployeeImg called");
  const headers = tokenConfig(getState).headers;
  headers.phone = phone;
  dispatch({ type: EMPLOYEE_IMG_LOADING });
  axios
    .get(`${proxy}/api/employees/getImg`, {
      responseType: "arraybuffer",
      headers: headers
    })
    .then(r => {
      let prefix = "data:" + r.headers["content-type"] + ";base64,";
      let data = Buffer.from(r.data, "binary").toString("base64");
      //dispatch({ type: NO_ERROR });

      dispatch({
        type: EMPLOYEE_IMG_LOADED,
        payload: prefix + data
      });
    })

    .catch(err => {
      console.log(err);
      dispatch(
        returnErrors(err.response.data, err.response.status, AUTH_ERROR)
      );
      dispatch({
        type: AUTH_ERROR
      });
    });
};

export const addEmployee = ({ name, phone, password, nationality, type }) => (
  dispatch,
  getState
) => {
  console.log("addEmployee called");

  dispatch({ type: EMPLOYEES_LOADING });
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Request body
  const body = JSON.stringify({ name, phone, password, nationality, type });
  axios
    .post(`${proxy}/api/employees/add`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: EMPLOYEE_ADDED,
        payload: res.data
      });
    })
    .then(res => {
      dispatch(getEmployees());
    })
    .catch(err => {
      dispatch(
        returnErrors(err.response.data, err.response.status, AUTH_ERROR)
      );
      dispatch({
        type: AUTH_ERROR
      });
    });
};
