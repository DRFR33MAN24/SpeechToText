import {
  EMPLOYEES_LOADING,
  EMPLOYEES_LOADED,
  EMPLOYEE_IMG_LOADED,
  EMPLOYEE_IMG_LOADING
} from "../actions/types";

const initialState = {
  employees: [],
  employeeImg: []
};
export default function (state = initialState, action) {
  switch (action.type) {
    case EMPLOYEES_LOADED:
      return {
        ...state,
        employees: action.payload
      };
    case EMPLOYEES_LOADING:
      return {
        ...state
      };

    case EMPLOYEE_IMG_LOADED:
      return {
        ...state,
        employeeImg: [...state.employeeImg, action.payload]
      };
    case EMPLOYEE_IMG_LOADING:
      return {
        ...state
      };

    default:
      return state;
  }
}
