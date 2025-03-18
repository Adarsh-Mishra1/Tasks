//PutTemplateAndFields
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import userStore from "../../zustand/userStore";

const DesignDevelopDocForms = lazy(
  () => import("../../components/DocForm/DesignDevelopDocForms"),
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const PutTemplateAndFields = () => {
  const userData = userStore((state) => state.user);
  // let navigate = useNavigate();
  let location = useLocation();

  console.log("PutTemplateAndFields_locationstate", location.state);
  const [docForm, setDocForm] = useState(location.state.docForm);
  const [errorMsg, setErrorMsg] = useState("");

  const formsFieldsDataDefault = {
    printMarginLeft: 2,
    printMarginRight: 2,
    printMarginTop: 2,
    printMarginBottom: 2,
    pageType: "a4",
    errorTextColor: "pink",
    formFields: {},
  };

  const sampleHTMLDataForEditor = ""; //For testing Only

  useEffect(() => {
    // fetchFieldsAndTemplate();
  }, []);

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              {/* <h3>Template &amp; Fields</h3> */}
              <h3>Create Template &amp; Fields</h3>
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
                
                <div className="x_content">
                  {userData.crudAccess?.docForm.u == 1 ? (
                    <DesignDevelopDocForms
                      key="mainformDDDF"
                      formType="mainform"
                      formId={docForm.id}
                      templateLanguage={docForm.language.id}
                      documentFormFieldsData={formsFieldsDataDefault}
                      documentFormTemplateData={sampleHTMLDataForEditor}
                      formFieldkey={null}
                      onConditionalFormCreate={null}
                      docForm={docForm}
                    />
                  ) : (
                    <>You have no access to perform this action</>
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

export default PutTemplateAndFields;
