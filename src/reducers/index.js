import { combineReducers } from "redux";

import errorReducer from "./errorReducer";
import authReducer from "./authReducer";
import employeesReducer from "./employeesReducer";


export default combineReducers({

    error: errorReducer,
    auth: authReducer,
    employees: employeesReducer
});
