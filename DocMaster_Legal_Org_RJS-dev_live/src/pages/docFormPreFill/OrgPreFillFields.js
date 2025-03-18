//docFormPreFill/OrgPreFillFields.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import { WsGetPreFillKeysByType } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ProcessPreFillField = lazy(
  () => import("../../components/DocFormPreFill/ProcessPreFillField"),
);

const OrgPreFillFields = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [preFillFields, setPreFillFields] = useState([]);

  useEffect(() => {
    getOrgAllDocForm();
  }, []);

  const getOrgAllDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    //[URL/orgId/isUserSpecific]
    //+ "/" + userData.org.id //Old Way

    axios
      .get(WsGetPreFillKeysByType + "/0", {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("GetPreFillKeysByType_responseData", responseData);
        if (responseData.resultCode === 1) {
          setPreFillFields(responseData.resultMessage);
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("GetPreFillKeysByType_error", error);
        setErrorMsg("Error while processing");
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Org Prefill Field(s)</h3>
            </div>

            {/* <div className="title_right">
                <div className="col-md-5 col-sm-5   form-group pull-right top_search">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for..."
                    />
                    <span className="input-group-btn">
                      <button className="btn btn-default" type="button">
                        Go!
                      </button>
                    </span>
                  </div>
                </div>
              </div> */}
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Org Prefill Fields(s)</h2>
                  {/* <ul className="nav navbar-right panel_toolbox">
                      <li><a className="collapse-link"><i className="fa fa-chevron-up"></i></a>
                      </li>
                      <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <a className="dropdown-item" href="#">Settings 1</a>
                            <a className="dropdown-item" href="#">Settings 2</a>
                          </div>
                      </li>
                      <li><a className="close-link"><i className="fa fa-close"></i></a>
                      </li>
                    </ul>*/}
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {preFillFields != undefined && preFillFields.length > 0 ? (
                    <>
                      <div className="row">
                        <div className="col-md-1 fw-bold">Sno</div>
                        <div className="col-md-3 fw-bold">Title</div>
                        <div className="col-md-3 fw-bold">Value</div>
                        <div className="col-md-3 fw-bold"></div>
                      </div>
                      {preFillFields.map((preFillField, index) => {
                        return (
                          <ProcessPreFillField
                            preFillField={preFillField}
                            org={userData.org}
                            orgUser={userData}
                            index={index}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <>No Data</>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- /page content --> */}
        <Footer />
      </div>
    </Suspense>
  );
};

export default OrgPreFillFields;
