import React, { Component, Fragment } from "react";
import { withRouter } from "../withRouter";
import { Outlet } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../actions/authAction";
import { clearErrors, returnErrors } from "../actions/errorAction";

import loc from '../localization'
import FormatImg from "../util";
//import profileImg from "../Images/multitasking.svg";

const { ipcRenderer } = window.require("electron");
export const Context = React.createContext({});
class MainPage extends Component {
  state = { pageTitle: loc.mainPage };

  static propTypes = {
    isAuthenticated: PropTypes.bool,
    isLoading: PropTypes.bool,
    error: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired,
    user: PropTypes.object,
    profileImg: PropTypes.string
  };
  componentWillMount() {
    ipcRenderer.send("changeWindowSize", 1000, 600, true);
  }
  // LogOut = () => {

  // };
  ChangePageTitle = title => {
    this.setState({ pageTitle: title });
  };
  render() {
    const user = this.props.user;
    const img = this.props.profileImg;
    //console.log(img);
    if (user === null || img === null) return <div></div>;


    const managersSection = (
      <Fragment>
        <div class="sidebar-heading">{loc.managersSection}</div>

        <li class="nav-item">
          <a class="nav-link collapsed" href="#/Main/employees">
            <i class="fas fa-fw fa-suitcase"></i>
            <span>{loc.employees}</span>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#/Main/systemSettings">
            <i class="fas fa-fw fa-wrench"></i>
            <span>{loc.settings}</span>
          </a>
        </li>
        <hr class="sidebar-divider d-none d-md-block" />
      </Fragment>
    )
    return (
      <div>
        <div class="bg-gray-200 d-flex flex-row   ">
          {/* <div class="row w-100  d-flex flex-row "> */}
          {/* <div class="col-3  bg-dark"> */}

          <div class="d-flex flex-column w-100">
            <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
              <button
                id="sidebarToggleTop"
                class="btn btn-link d-md-none rounded-circle mr-3"
              >
                <i class="fa fa-bars"></i>
              </button>

              {/* <form class="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
                <div class="input-group">
                  <div class="input-group-append">
                    <button class="btn btn-primary" type="button">
                      <i class="fas fa-search fa-sm"></i>
                    </button>
                    <input
                      type="text"
                      class="form-control bg-light border-0 small"
                      placeholder="Search for..."
                      aria-label="Search"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
              </form> */}

              <ul class="navbar-nav mr-auto">
                {/* <li class="nav-item  mx-1">
                  <a class="nav-link " href="#">
                    <i class="fas fa-sign-out-alt fa-fw"></i>
                  </a>
                </li> */}
                {/* <li class="nav-item dropdown no-arrow d-sm-none">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#/Main"
                    id="searchDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-search fa-fw"></i>
                  </a>

                  <div
                    class="dropdown-menu dropdown-menu-left p-3 shadow animated--grow-in"
                    aria-labelledby="searchDropdown"
                  >
                    <form class="form-inline mr-auto w-100 navbar-search">
                      <div class="input-group">
                        <input
                          type="text"
                          class="form-control bg-light border-0 small"
                          placeholder="Search for..."
                          aria-label="Search"
                          aria-describedby="basic-addon2"
                        />
                        <div class="input-group-append">
                          <button class="btn btn-primary" type="button">
                            <i class="fas fa-search fa-sm"></i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </li> */}

                <li class="nav-item dropdown no-arrow mx-1">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#/Main"
                    id="alertsDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-bell fa-fw"></i>

                    <span class="badge badge-danger badge-counter">3+</span>
                  </a>

                  <div
                    class="dropdown-list dropdown-menu dropdown-menu-left shadow animated--grow-in"
                    aria-labelledby="alertsDropdown"
                  >
                    <h6 class="dropdown-header">Alerts Center</h6>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="mr-3">
                        <div class="icon-circle bg-primary">
                          <i class="fas fa-file-alt text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div class="small text-gray-500">December 12, 2019</div>
                        <span class="font-weight-bold">
                          A new monthly report is ready to download!
                        </span>
                      </div>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="mr-3">
                        <div class="icon-circle bg-success">
                          <i class="fas fa-donate text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div class="small text-gray-500">December 7, 2019</div>
                        $290.29 has been deposited into your account!
                      </div>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="mr-3">
                        <div class="icon-circle bg-warning">
                          <i class="fas fa-exclamation-triangle text-white"></i>
                        </div>
                      </div>
                      <div>
                        <div class="small text-gray-500">December 2, 2019</div>
                        Spending Alert: We've noticed unusually high spending
                        for your account.
                      </div>
                    </a>
                    <a
                      class="dropdown-item text-center small text-gray-500"
                      href="#"
                    >
                      Show All Alerts
                    </a>
                  </div>
                </li>

                <li class="nav-item dropdown no-arrow mx-1">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#/Main"
                    id="messagesDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fas fa-envelope fa-fw"></i>

                    <span class="badge badge-danger badge-counter">7</span>
                  </a>

                  <div
                    class="dropdown-list dropdown-menu dropdown-menu-left shadow animated--grow-in"
                    aria-labelledby="messagesDropdown"
                  >
                    <h6 class="dropdown-header">Message Center</h6>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="dropdown-list-image mr-3">
                        <img
                          class="rounded-circle"
                          src="img/undraw_profile_1.svg"
                          alt="..."
                        />
                        <div class="status-indicator bg-success"></div>
                      </div>
                      <div class="font-weight-bold">
                        <div class="text-truncate">
                          Hi there! I am wondering if you can help me with a
                          problem I've been having.
                        </div>
                        <div class="small text-gray-500">
                          Emily Fowler · 58m
                        </div>
                      </div>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="dropdown-list-image mr-3">
                        <img
                          class="rounded-circle"
                          src="img/undraw_profile_2.svg"
                          alt="..."
                        />
                        <div class="status-indicator"></div>
                      </div>
                      <div>
                        <div class="text-truncate">
                          I have the photos that you ordered last month, how
                          would you like them sent to you?
                        </div>
                        <div class="small text-gray-500">Jae Chun · 1d</div>
                      </div>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="dropdown-list-image mr-3">
                        <img
                          class="rounded-circle"
                          src="img/undraw_profile_3.svg"
                          alt="..."
                        />
                        <div class="status-indicator bg-warning"></div>
                      </div>
                      <div>
                        <div class="text-truncate">
                          Last month's report looks great, I am very happy with
                          the progress so far, keep up the good work!
                        </div>
                        <div class="small text-gray-500">
                          Morgan Alvarez · 2d
                        </div>
                      </div>
                    </a>
                    <a class="dropdown-item d-flex align-items-center" href="#">
                      <div class="dropdown-list-image mr-3">
                        <img
                          class="rounded-circle"
                          src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                          alt="..."
                        />
                        <div class="status-indicator bg-success"></div>
                      </div>
                      <div>
                        <div class="text-truncate">
                          Am I a good boy? The reason I ask is because someone
                          told me that people say this to all dogs, even if they
                          aren't good...
                        </div>
                        <div class="small text-gray-500">
                          Chicken the Dog · 2w
                        </div>
                      </div>
                    </a>
                    <a
                      class="dropdown-item text-center small text-gray-500"
                      href="#"
                    >
                      Read More Messages
                    </a>
                  </div>
                </li>

                {/* <div class="topbar-divider d-none d-sm-block"></div>

                <li class="nav-item dropdown no-arrow">
                  <a
                    class="nav-link dropdown-toggle"
                    href="#"
                    id="userDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span class="mr-2 d-none d-lg-inline text-gray-600 small">
                      Douglas McGee
                    </span>
                    <img
                      class="img-profile rounded-circle"
                      src="img/undraw_profile.svg"
                    />
                  </a>

                  <div
                    class="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                    aria-labelledby="userDropdown"
                  >
                    <a class="dropdown-item" href="#">
                      <i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                      Profile
                    </a>
                    <a class="dropdown-item" href="#">
                      <i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
                      Settings
                    </a>
                    <a class="dropdown-item" href="#">
                      <i class="fas fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
                      Activity Log
                    </a>
                    <div class="dropdown-divider"></div>
                    <a
                      class="dropdown-item"
                      href="#"
                      data-toggle="modal"
                      data-target="#logoutModal"
                    >
                      <i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                      Logout
                    </a>
                  </div>
                </li> */}
              </ul>
              <div>{this.state.pageTitle}</div>
            </nav>
            <div class="container justify-contnet-center w-100   " dir="rtl">

              <Context.Provider value={this.ChangePageTitle}>
                <Outlet />
              </Context.Provider>
            </div>
          </div>
          <ul
            class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion text-right  "
            id="accordionSidebar"
          >
            {/* <a
              class="sidebar-brand d-flex align-items-center justify-content-center"
              href="index.html"
            >
              <div class="sidebar-brand-icon rotate-n-15">
                <i class="fas fa-laugh-wink"></i>
              </div>
              <div class="sidebar-brand-text mx-3">
                SB Admin <sup>2</sup>
              </div>
            </a> */}
            <div class="container mb-3">
              <div class="row d-flex align-items-center justify-content-center pt-2 ">
                <img
                  src={img}
                  className="rounded-circle image-profile border bg-white"
                  width="64"
                  height="64"
                />
              </div>
              <div class="row text-light align-items-center justify-content-center mt-1">
                <a className='text-light mr-1 '><i class="fas fa-fw fa-list"></i></a>
                {user.isManager ? (
                  <span className="text-warning">{loc.manager}</span>
                ) : (
                  <span className="text-light">{loc.employee}</span>
                )}
                <span className="text-dark">&nbsp;/&nbsp; </span>
                <div className="text-light"> {user.name}</div>
              </div>
            </div>


            <hr class="sidebar-divider my-0" />

            <li class="nav-item active">
              <a class="nav-link" href="#/Main">
                <i class="fas fa-fw fa-home"></i>
                <span>{loc.mainPage}</span>
              </a>
            </li>

            <hr class="sidebar-divider" />

            <div class="sidebar-heading">{loc.EmployeesSection}</div>

            <li class="nav-item">
              <a class="nav-link collapsed" href="#/Main/clients">
                <i class="fas fa-fw fa-users"></i>
                <span>{loc.clients}</span>
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link collapsed" href="#/Main/shippings">
                <i class="fas fa-fw fa-shipping-fast"></i>
                <span>{loc.shippings}</span>
              </a>
            </li>

            <hr class="sidebar-divider" />
            {user.isManager ? managersSection : null}
            <li class="nav-item  mx-1">
              <a class="nav-link " href="#/userSettings" onClick={this.props.logout}>
                <i class="fas fa-wrench fa-fw"></i>
                <span>{loc.settings}</span>
              </a>
            </li>
            <li class="nav-item  mx-1">
              <a class="nav-link " href="#/Login" onClick={this.props.logout}>
                <i class="fas fa-sign-out-alt fa-fw"></i>
                <span>{loc.logout}</span>
              </a>
            </li>


            <div class="text-center d-none d-md-inline">
              <button
                class="rounded-circle border-0"
                id="sidebarToggle"
              ></button>
            </div>
          </ul>

          {/* </div> */}
          {/* <div class="col-9 w-100 bg-info"> */}
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      // </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  isLoading: state.auth.isLoading,
  error: state.error,
  user: state.auth.user,
  profileImg: state.auth.profileImg
});

// export default compose(withRouter, connect(mapStateToProps, { login, returnErrors, clearErrors })(
//   LoginPage));
export default withRouter(
  connect(mapStateToProps, { logout, returnErrors, clearErrors })(MainPage)
);
