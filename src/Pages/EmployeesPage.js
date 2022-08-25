import React, { Component } from "react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone from "react-dropzone-uploader";
import { Layout, Preview } from "../Components/CustomDropZone";
import Img from "../Components/Img";
import { Context } from "./MainPage";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../actions/authAction";
import { clearErrors, returnErrors } from "../actions/errorAction";
import { getEmployees, addEmployee } from "../actions/employeesAction";
import loc from "../localization";
import TableFilter from "react-table-filter";
import "react-table-filter/lib/styles.css";
import { getFormattedDate } from "../util";

class EmployeesPage extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state.emplyees = this.props.employees;
  // }
  state = {
    name: loc.employees,
    employeeName: "",
    employeeType: "",
    employeeNationality: "",
    employeePhone: "",
    employeePassword: "",
    empIDReady: false,
    employees: [],
    collapseForm: false,
    cancelImgUploadCount: 0
  };
  static propTypes = {
    isAuthenticated: PropTypes.bool,

    error: PropTypes.object.isRequired,
    getEmployees: PropTypes.func.isRequired,
    addEmployee: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    returnErrors: PropTypes.func.isRequired,
    employees: PropTypes.object
  };
  static contextType = Context;
  componentWillMount() {
    this.context(this.state.name);
    this.props.getEmployees();
  }
  componentDidMount() {
    // pass user id to filter employees by permissions imposed on the given user.
  }
  // UNSAFE_componentWillReceiveProps() {
  //   this.setState({ employees: this.props.employees })

  // }
  componentDidUpdate(prevProps, prevState) {
    const employees = this.props.employees;

    if (employees !== prevProps.employees) {
      this.setState({ employees: employees });
    }
  }
  // specify upload params and url for your files
  getUploadParams = ({ file, meta }) => {
    // const body = new FormData()
    // body.append('fileField', file)
    return {
      url: "http://localhost:5000/api/auth/idUpload",
      headers: { "x-auth-token": localStorage.token }
    };
  };

  // called every time a file's `status` changes
  handleChangeStatus = ({ meta, file }, status) => {
    console.log(status, meta, file);
    if (status === "done") {
      this.setState({ empIDReady: true });
    }
  };

  // receives array of files that are done uploading when submit button is clicked
  // handleSubmit = (files, allFiles) => {
  //   console.log(files.map(f => f.meta));
  //   allFiles.forEach(f => f.remove());
  // };
  handleInputChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  };
  isFormEmpty = () => {
    const formData = this.state;
    //console.log(formData);

    if (
      formData.employeeName.length !== 0 &&
      formData.employeePhone.length !== 0 &&
      formData.employeeType.length !== 0 &&
      formData.employeeNationality.length !== 0 &&
      formData.employeePassword.length !== 0 &&
      formData.empIDReady !== false
    ) {
      return false;
    } else {
      return true;
    }
  };
  handleSubmit(event) {
    event.preventDefault();
  }
  addEmployee = () => {
    let e = this.state;
    this.props.addEmployee({
      name: e.employeeName,
      phone: e.employeePhone,
      password: e.employeePassword,
      type: e.employeeType,
      nationality: e.employeeNationality
    });
  };
  clearForm = () => {
    this.setState({
      collapseForm: false,
      cancelImgUploadCount: this.state.cancelImgUploadCount + 1
    });
    this.setState({
      employeeName: "",
      employeeNationality: "",
      employeeType: "",
      employeePhone: "",
      employeePassword: "",
      empIDReady: false
    });
  };
  _filterUpdated = (newData, filtersObject) => {
    this.setState({
      employees: newData
    });
  };
  render() {
    //console.log(this.state.employees.length);
    if (this.state.employees.length === 0) return <div></div>;
    const tableContent = this.state.employees.map((item, index) => {
      return (
        <tr key={"row_" + index}>
          <td className="cell">{item.id}</td>
          <td className="cell">
            <Img imgIndex={item.id} phone={item.phone} />
          </td>
          <td className="cell">{item.name}</td>
          <td className="cell">{item.phone}</td>
          <td className="cell">{getFormattedDate(item.register_date)}</td>
          <td className="cell">
            <button className="btn btn-link">
              <i class="fas fa-ellipsis-h fa-sm fa-fw"></i>
            </button>
          </td>
        </tr>
      );
    });
    return (
      <div className="  p-2">
        <div className="card ">
          <button
            class="btn btn-link bg-gradient-success text-gray-800"
            type="button"
            onClick={() => {
              console.log("collapse", this.state.collapseForm);
              this.setState({ collapseForm: !this.state.collapseForm });
            }}
          >
            <div class="text-right  mt-2 h4 text-gray-800">
              {loc.addEmployee}
              <span>
                <i class="fas fa-plus fa-sm fa-fw"></i>
              </span>
            </div>
          </button>
          <div
            class={
              "collapse" + (this.state.collapseForm === false ? " " : " show")
            }
            id="collapseExample"
          >
            <form className="m-2 text-right">
              <div class="form-group">
                <label for="EmployeeName">{loc.EmployeeName}</label>
                <input
                  name="employeeName"
                  value={this.state.employeeName}
                  onChange={this.handleInputChange}
                  type="text"
                  class="form-control "
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>
              <div class="form-group">
                <label for="employeePhone">{loc.phoneNumber}</label>
                <input
                  name="employeePhone"
                  value={this.state.employeePhone}
                  onChange={this.handleInputChange}
                  type="text"
                  class="form-control "
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>
              <div class="form-group">
                <label for="employeePassword">{loc.password}</label>
                <input
                  name="employeePassword"
                  value={this.state.employeePassword}
                  onChange={this.handleInputChange}
                  type="password"
                  class="form-control "
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>
              <div class="form-group">
                <label for="employeeNationality">{loc.nationality}</label>
                <select
                  name="employeeNationality"
                  id="inputState"
                  class="form-control w-75"
                  value={this.state.employeeNationality}
                  onChange={this.handleInputChange}
                >
                  <option selected>{loc.choose}</option>
                  <option value="SY">{loc.syrian}</option>
                  <option value="US">{loc.american}</option>
                </select>
              </div>
              <div class="form-group-inline">
                <label for="employeeID">{loc.personalId}</label>

                <div class="d-flex justify-content-start">
                  <Dropzone
                    key={this.state.cancelImgUploadCount}
                    styles={{
                      dropzone: {
                        position: "relative",

                        width: "100px",
                        height: "100px",
                        minHeight: "100px",

                        justifyContent: "center"
                      },
                      input: {
                        position: "static",

                        top: 0,
                        left: 0
                      }
                    }}
                    maxFiles={1}
                    multiple={false}
                    canCancel={false}
                    getUploadParams={this.getUploadParams}
                    onChangeStatus={this.handleChangeStatus}
                    onSubmit={this.handleSubmit}
                    LayoutComponent={Layout}
                    PreviewComponent={Preview}
                    inputWithFilesContent={null}
                    inputContent={
                      <div>
                        {/* {loc.dragUploadFile} */}
                        <i class="fas fa-plus fa-sm fa-fw"></i>
                      </div>
                    }
                    accept="image/*,audio/*,video/*"
                  />
                </div>
                <label for="employeeContract">{loc.jobContract}</label>
                <div class="d-flex justify-content-start">
                  <Dropzone
                    key={this.state.cancelImgUploadCount}
                    styles={{
                      dropzone: {
                        position: "relative",

                        width: "100px",
                        height: "100px",
                        minHeight: "100px",

                        justifyContent: "center"
                      },
                      input: {
                        position: "static",

                        top: 0,
                        left: 0
                      }
                    }}
                    maxFiles={1}
                    multiple={false}
                    canCancel={false}
                    getUploadParams={this.getUploadParams}
                    onChangeStatus={this.handleChangeStatus}
                    onSubmit={this.handleSubmit}
                    LayoutComponent={Layout}
                    PreviewComponent={Preview}
                    inputWithFilesContent={null}
                    inputContent={
                      <div>
                        {/* {loc.dragUploadFile} */}
                        <i class="fas fa-plus fa-sm fa-fw"></i>
                      </div>
                    }
                    accept="image/*,audio/*,video/*"
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="employeeID">{loc.employeeType}</label>

                <select
                  name="employeeType"
                  id="inputState"
                  class="form-control w-75"
                  value={this.state.employeeType}
                  onChange={this.handleInputChange}
                >
                  <option selected value="">
                    {loc.choose}
                  </option>
                  <option value="manager">{loc.manager}</option>
                  <option value="employee">{loc.employee}</option>
                </select>
              </div>

              <div class="form-group d-flex justify-content-center ">
                <button
                  type="button"
                  disabled={this.isFormEmpty()}
                  className="btn bg-gradient-success text-gray-800 mx-1"
                  onClick={this.addEmployee}
                >
                  {loc.save}
                </button>
                <button
                  type="button"
                  className="btn bg-gradient-success text-gray-800 mx-1"
                  onClick={this.clearForm}
                >
                  {loc.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div class="card">
          <table className="table">
            <thead>
              <TableFilter
                rows={this.state.employees}
                onFilterUpdate={this._filterUpdated}
              >
                <th key="id" filterkey="id">
                  {loc.id}
                </th>
                <th key="profileImg" filterkey="profileImg">
                  {loc.personalId}
                </th>
                <th key="name" filterkey="name" showsearch={"true"}>
                  {loc.EmployeeName}
                </th>

                <th key="phone" filterkey="phone">
                  {loc.phoneNumber}
                </th>
                <th key="register_date" filterkey="register_date">
                  {loc.registerDate}
                </th>
                <th>{loc.settings}</th>
              </TableFilter>
            </thead>
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  error: state.error,
  isAuthenticated: state.auth.isAuthenticated,
  employees: state.employees.employees
});

// export default compose(withRouter, connect(mapStateToProps, { login, returnErrors, clearErrors })(
//   LoginPage));
export default connect(mapStateToProps, {
  logout,
  returnErrors,
  clearErrors,
  getEmployees,
  addEmployee
})(EmployeesPage);
