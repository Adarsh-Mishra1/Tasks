//View.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
// import { confirmAlert } from "react-confirm-alert"; // Import Dep
// import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import { WSGetDocForm } from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import { toast } from "react-toastify";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const View = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("DocFormView_locationstate", location.state);
  const [docForm, setDocForm] = useState(location.state.docForm);

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    getOrgDocForm();
  }, []);

  const getOrgDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    //[url/userId/orgId/orgFormId]
    axios
      .get(
        WSGetDocForm +
          "/" +
          userData.id +
          "/" +
          userData.org.id +
          "/" +
          docForm.formId,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          setDocForm(responseData.result_message);
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const goToFillOrgDocForm = () => {
    docForm["formId"] = docForm.id;
    navigate("/orgDocFormFill", {
      state: {
        docForm: docForm,
      },
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
              <h3>DocForm</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>{docForm.nameTitle}</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <ReactTooltip place="top" type="dark" effect="solid" />

                  {errorMsg ? (
                    <>
                      <b>{errorMsg}</b>
                    </>
                  ) : null}

                  <div className="row">
                    <div className="col-6">
                      {docForm.isPublished == 1 ? (
                        <button
                          type="button"
                          data-tip="Fill DocForm"
                          title="Fill DocForm"
                          key={`fillDocForm${docForm.id}`}
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => goToFillOrgDocForm()}
                          aria-hidden="true"
                        >
                          Fill It
                        </button>
                      ) : null}
                    </div>
                    <div className="col-6"></div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-4">
                      <strong>Name/Title</strong>
                    </div>
                    <div className="col-8">{docForm.formNameTitle}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>UID</strong>
                    </div>
                    <div className="col-8">{docForm.formUid}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Short name</strong>
                    </div>
                    <div className="col-8">{docForm.shortName}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Agency name</strong>
                    </div>
                    <div className="col-8">{docForm.agencyName}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Purpose</strong>
                    </div>
                    <div className="col-8">{docForm.purpose}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Category</strong>
                    </div>
                    <div className="col-8">{docForm.category?.category}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Nature </strong>
                    </div>
                    <div className="col-8">{docForm.nature?.nature}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Class</strong>
                    </div>
                    <div className="col-8">{docForm.formClass?.title}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Addl Info </strong>
                    </div>
                    <div className="col-8">{docForm.addlInfo}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Keywords</strong>
                    </div>
                    <div className="col-8">{docForm.keywords}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Keyphrases</strong>
                    </div>
                    <div className="col-8">{docForm.keyphrases}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Glossary</strong>
                    </div>
                    <div className="col-8">{docForm.glossary}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Gist</strong>
                    </div>
                    <div className="col-8">{docForm.gist}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Additional Categories</strong>
                    </div>
                    <div className="col-8">
                      {(() => {
                        if (
                          docForm.addlCategories != undefined &&
                          Array.isArray(docForm.addlCategories)
                        ) {
                          return (
                            <>
                              {docForm.addlCategories.map((addlCategory) => (
                                <span
                                  className="addnlCategory"
                                  key={addlCategory.id}
                                >
                                  {addlCategory.category},&nbsp;
                                </span>
                              ))}
                            </>
                          );
                        }
                      })()}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Langauge</strong>
                    </div>
                    <div className="col-8">{docForm?.language?.language}</div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <strong>Description</strong>
                    </div>
                    <div
                      className="col-12"
                      dangerouslySetInnerHTML={{
                        __html: docForm.description,
                      }}
                    />
                  </div>
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

export default View;
