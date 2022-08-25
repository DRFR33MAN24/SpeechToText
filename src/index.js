import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
//import '../src/style.scss'
//import "./sb-admin-2.min.css";
//import $ from "jquery";
//import Popper from "popper.js";

//import "bootstrap/dist/js/bootstrap.bundle.min";

import "./index.css";

import App from "./App";
import LoginPage from "./Pages/LoginPage";
import MainPage from "./Pages/MainPage";
import SystemSettingsPage from "./Pages/SystemSettingsPage";
import EmployeesPage from "./Pages/EmployeesPage";
import ClientsPage from "./Pages/ClientsPage";
import ShippingsPage from "./Pages/ShippingsPage";
import reportWebVitals from "./reportWebVitals";
import { Routes, Route, HashRouter } from "react-router-dom";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <HashRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/Login" element={<LoginPage />} />

            <Route path="/Main" element={<MainPage />}>
              <Route
                path="/Main/systemSettings"
                element={<SystemSettingsPage />}
              />
              <Route path="/Main/employees" element={<EmployeesPage />} />
              <Route path="/Main/clients" element={<ClientsPage />} />
              <Route path="/Main/shippings" element={<ShippingsPage />} />
            </Route>
          </Route>
        </Routes>
      </HashRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
