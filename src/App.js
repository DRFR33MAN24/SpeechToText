// import logo from "./logo.svg";
// import "./App.css";
// import { withRouter } from "./withRouter";
// import { useNavigate, Outlet } from "react-router";
// import { Provider, connect } from "react-redux";

// import TitleBar from "./Components/TitleBar";
// import { Component } from "react";

// import PropTypes from "prop-types";
// import { loadUser } from "./actions/authAction";
// import { returnErrors, clearErrors } from "./actions/errorAction";
// import { LOGIN_FAIL, RESET_FAIL, AUTH_ERROR, CLEAR_ERRORS, NO_ERROR } from "./actions/types";
// class App extends Component {
//   static propTypes = {
//     isAuthenticated: PropTypes.bool,
//     isLoading: PropTypes.bool,
//     error: PropTypes.object.isRequired,
//     loadUser: PropTypes.func.isRequired,
//     clearErrors: PropTypes.func.isRequired,
//     returnErrors: PropTypes.func.isRequired,
//     user: PropTypes.object
//   };
//   componentWillMount() {
//     this.props.loadUser();
//     //console.log("AppWillMount")
//   }

//   componentDidUpdate(prevProps, prevState) {
//     const error = this.props.error;
//     console.log(error);
//     if (error !== prevProps.error) {

//       if (error.id === null || error.id === undefined) return;
//       else if (
//         error.id === AUTH_ERROR ||
//         error.id === LOGIN_FAIL ||
//         error.id === RESET_FAIL ||
//         error.id === CLEAR_ERRORS
//       ) {
//         this.props.navigate("/Login");
//       } else if (error.id === NO_ERROR) {
//         this.props.navigate("/Main");
//       }
//     }
//   }

//   render() {
//     return (
//       <div className="App ">

//         {/* <TitleBar /> */}

//       </div>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   isAuthenticated: state.auth.isAuthenticated,
//   isLoading: state.auth.isLoading,
//   error: state.error,
//   user: state.auth.user
// });

// export default withRouter(
//   connect(mapStateToProps, { loadUser, returnErrors, clearErrors })(App)
// );
import React from 'react';
import logo from "./logo.svg";
import "./App.css";

//import TitleBar from "./Components/TitleBar";

const App = () => {
  return (
    <div className='App'>
      Hello
    </div>
  )
}

export default App;
