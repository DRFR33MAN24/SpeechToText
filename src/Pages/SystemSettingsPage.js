import React, { Component } from "react";
import { Context } from './MainPage'
class SystemSettingsPage extends Component {
  state = { name: "الإعدادات" }
  static contextType = Context;
  componentWillMount() {
    this.context(this.state.name);
  }
  render() {
    return (
      <div className=" p-2">
        <div class="card text-right p-2 mb-2">
          <h1 class="h3 mb-1 text-gray-800">ادارة مبلغ خصم الغياب</h1>
        </div>

        <div className="card  text-middle p-2 mb-3   ">
          <div class="row  flex-row    ">
            <div class="col-6 d-flex   justify-content-end align-items-start    ">
              <p class="my-auto">ادخل المبلغ المراد خصمه في المربع ادناه.</p>
            </div>
            <div class="col-6  d-flex justify-content-start align-items-start ">
              <div class="input-group w-50 ">
                <input
                  type="text"
                  class="form-control "
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="card text-right p-2 mb-2">
          <h1 class="h3 mb-1 text-gray-800">ادارة مبلغ خصم الغياب</h1>
        </div>

        <div className="card  text-middle p-2    ">
          <div class="row  flex-row    ">
            <div class="col-6 d-flex   justify-content-end align-items-start    ">
              <p class="my-auto">ادخل المبلغ المراد خصمه في المربع ادناه.</p>
            </div>
            <div class="col-6  d-flex justify-content-start align-items-start ">
              <div class="input-group w-50 ">
                <input
                  type="text"
                  class="form-control "
                  aria-label="Amount (to the nearest dollar)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SystemSettingsPage;
