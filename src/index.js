import React from "react";
import ReactDOM from "react-dom";


import "./index.css";

import App from "./App";
import ContextWrapper from "./Context/ContextWrapper";

import reportWebVitals from "./reportWebVitals";


ReactDOM.render(
  // <Provider store={store}>
  <ContextWrapper>
    <React.StrictMode>
      <App />
      {/* <HashRouter>
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
      </HashRouter> */}
    </React.StrictMode>
  </ContextWrapper>,
  // {/* </Provider> */}
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
