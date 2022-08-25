import React, { Component } from "react";
import { withRouter } from "../withRouter";
import emplogo from "../Images/multitasking.svg";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { login } from "../actions/authAction";
import { clearErrors, returnErrors } from "../actions/errorAction";


const { ipcRenderer } = window.require("electron");
class LoginPage extends Component {
  state = {
    phone: "",
    email: "",
    password: "",
    msg: "",
    token: ""
  };
  static propTypes = {
    isAuthenticated: PropTypes.bool,
    isLoading: PropTypes.bool,
    error: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired,
    user: PropTypes.object
  };
  componentWillMount() {
    ipcRenderer.send("changeWindowSize", 400, 600, false);
  }
  componentDidUpdate(prevProps, prevState) {
    //const isAuthenticated = this.props.isAuthenticated;
    const error = this.props.error;
    // console.log("isAuthenticated:", isAuthenticated);
    //console.log(error);
    if (error !== prevProps.error) {
      // console.log("error")
      // Check for register error
      if (error.id === "LOGIN_FAIL") {
        this.setState({ msg: error.msg.msg });
      } else {
        this.setState({ msg: null });
      }



      // If authenticated close modal
      // If authenicated go to dashboard
    }
  }
  // OnClick = () => {
  //   ipcRenderer.send("changeWindowSize", 1000, 600, true);
  //   this.props.navigate("/Main");
  // };
  handlePassword = (event) => {
    this.setState({ password: event.target.value })
  }
  handlePhone = (event) => {
    this.setState({ phone: event.target.value })
  }
  onSubmit = e => {
    e.preventDefault();
    //console.log('submit');
    const { phone, password } = this.state;

    const user = {
      phone: phone,
      password: password
    };
    console.log(user);
    // Attempt to login
    this.props.login(user);
    //this.props.returnErrors();
  };

  render() {
    return (
      <div>
        <div class="container bg-white login-form text-right " dir="rtl">
          <div className="title-offset"></div>
          <div class="card border-0">
            <form className="mb-5 mt-5 py-2 " onSubmit={this.onSubmit}>
              {this.state.msg ? (
                <div class="alert alert-danger" role="alert">
                  {this.state.msg}
                </div>
              ) : null}
              <div class="form-group py-1">
                <label for="exampleInputEmail1">رقم الهاتف</label>
                <input
                  type="phone"
                  class="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="ادخل رقم الهاتف"
                  onChange={this.handlePhone}

                />
              </div>
              <div class="form-group py-1">
                <label for="exampleInputPassword1">كلمة المرور</label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="كلمة المرور"
                  onChange={this.handlePassword}
                />
              </div>
              <div class="form-check  ">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                />
                <label class="form-check-label px-4 " for="exampleCheck1">
                  <div className="">تذكرني!</div>
                </label>
              </div>
              <button type="submit" class="btn btn-primary mt-2">
                تسجيل الدخول
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  error: state.error,
  user: state.auth.user
});

// export default compose(withRouter, connect(mapStateToProps, { login, returnErrors, clearErrors })(
//   LoginPage));
export default withRouter(
  connect(mapStateToProps, { login, returnErrors, clearErrors })(LoginPage)
);
