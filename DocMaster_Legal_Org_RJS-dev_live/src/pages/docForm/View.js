//View.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

import {
  WSGetDocForm,
  WSPublishDocForm,
  WSApproveDocForm,
  WSCopyDocFormData,
  WsGetOrgDepartmentsByDocForm,
  WsDeleteOrgDocFormDepartmentMap,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";
import { toast } from "react-toastify";

const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);

const MapDocForm2Dep = lazy(() => import("../../components/MapDocForm2Dep"));
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const View = () => {
  let navigate = useNavigate();
  let location = useLocation();

  console.log("DocFormView_locationstate", location.state);
  const [docForm, setDocForm] = useState(location.state.docForm);

  const userData = userStore((state) => state.user);

  const [openAddDocForm2DepModal, setOpenAddDocForm2DepModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [docFormDepartments, setDocFormDepartments] = useState([]);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "depName",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];
  //WsGetOrgDepartmentsByDocForm
  /*        id:<org_forms.id>,
        language:{id:<doc_languages.id>,language:<doc_languages.language>},
        uid:<org_forms.form_uid>,
        nameTitle:<org_forms.name_title>,
category:{id:<`forms_category`.`id`>,category:<`forms_category`.`category`>},
        price:<org_forms.price>,
        isPublic:<org_forms.is_public>,
        isPublished:<org_forms.is_published>*/

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
          docForm.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          setDocForm(responseData.result_message);
          getOrgDocFormDepartmentMapping();
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

  const getOrgDocFormDepartmentMapping = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    //[url/userId/orgId/orgFormId]
    axios
      .get(
        WsGetOrgDepartmentsByDocForm + "/" + userData.org.id + "/" + docForm.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        // console.log("depmap_responseData_docForm.id", docForm.id);
        console.log("depmap_responseData", responseData);
        if (responseData.resultCode === 1) {
          setDocFormDepartments(
            processDataForDepMap(responseData.resultMessage),
          );
        } else {
          // alert(responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("depmap_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processDataForDepMap = (simpleDataArray) => {
    // let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      // console.log("processData_simpleData", simpleData);

      simpleData["sno"] = index + 1;
      simpleData["depName"] = simpleData.department.name;

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.docForm.d == 1 ? (
            <i
              title="Delete"
              data-tip="Delete"
              className="fa fa-trash"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => onOrgDocFormDepartmentDelete(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}
        </>
      );
      // blankData.push(simpleData);
    });

    // console.log("processData_blankData",blankData)
    console.log("processData_simpleDataArray", simpleDataArray);
    // return blankData;
    return simpleDataArray;
  };

  const publishAlert = (data, option) => {
    let caMessage = "";
    if (option == 1) {
      //Publish
      caMessage = "Are you sure to Publish '" + data.nameTitle + "'";
    } else {
      //UpPublish
      caMessage = "Are you sure to UnPublish '" + data.nameTitle + "'";
    }

    confirmAlert({
      title: "Confirm!",
      message: caMessage,
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceedToPubUnPubDocForm(data, option);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceedToPubUnPubDocForm = (docForm, option) => {
    console.log("proceedToPubUnPubDocForm_docForm", docForm);
    console.log("proceedToPubUnPubDocForm_option", option);

    toast.success("Wait ...", {
      autoClose: 50,
    });

    axios
      .post(
        WSPublishDocForm,
        JSON.stringify({
          adminUserId: userData.id,
          docFormId: docForm.id,
          option: option,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToPubUnPubDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          processDataAfterPubUnPub(docForm, option);
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("proceedToPubUnPubDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processDataAfterPubUnPub = (docForm, option) => {
    window.location.reload();
  };

  const delAlert = () => {
    alert("To be Done");
  };

  function openTabForPreviewTestRun() {
    // console.log("openTabForPreviewTestRun");
    //console.log("doing something");
    confirmAlert({
      title: "Test Run?",
      message: "Are you sure to proceed for test Run!",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            const win = window.open(
              "/docFormTestRun?formId=" + docForm.id,
              "_blank",
            );
            win.focus();
          },
        },
        {
          label: "No",
        },
      ],
    });
  }

  function goToDocFormFieldAndTemplate() {
    confirmAlert({
      title: "Create/Edit?",
      message:
        "Are you sure to proceed to create/Edit DocForm Template & Fields!",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            navigate("/docFormPutTemplateAndFields", {
              state: {
                docForm: docForm,
              },
            });
          },
        },
        {
          label: "No",
        },
      ],
    });
  }
  /*
  const approveThisDocForm = () => {
    confirmAlert({
      title: "Approve?",
      message: "Are you sure to proceed to Approve " + docForm.nameTitle + " !",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceedToApproveDocForm(1);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceedToApproveDocForm = (option) => {
    console.log("proceedToApproveDocForm_option", option);

    toast.success("Wait ...", {
      autoClose: 1000,
    });

    axios
      .post(
        WSApproveDocForm,
        JSON.stringify({
          adminUserId: userData.id,
          docFormId: docForm.id,
          option: option,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToApproveDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          window.location.reload();
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("proceedToApproveDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };
*/
  const goToDocFormEdit = () => {
    navigate("/docFormEdit", {
      state: { docForm: docForm },
    });
  };

  const onCopyofDocForm = () => {
    confirmAlert({
      title: "Confirm!",
      message: "Sure to Make copy of this form ",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            var docFormName = window.prompt(
              "Please enter New name for the DocForm",
              docForm.nameTitle + "-Copy",
            );
            if (docFormName != null) {
              if (docFormName.length > 60) {
                alert("Check entered name length");
              } else {
                proceed2MakeCopyOfTheDocForm(docFormName);
              }
            }
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceed2MakeCopyOfTheDocForm = (docFormNewName) => {
    /*[Raw-JSON]
orgId:text,
userId:text,
formId:text,
title:text (Optional) */

    // const formParams = JSON.stringify({
    //   orgId: userData.org.id,
    //   userId: userData.id,
    //   formId: docForm.id,
    //   title: docFormNewName,
    // });

    axios
      .post(
        WSCopyDocFormData,
        JSON.stringify({
          orgId: userData.org.id,
          userId: userData.id,
          formId: docForm.id,
          title: docFormNewName,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("CopyOfTheDocForm_responseData", responseData);
        if (responseData.result_code == 1) {
          toast.success("Copy of DocForm Created", {
            autoClose: 100,
          });
          navigate("/docFormShowAll");
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("CopyOfTheDocForm_error", error);
      });
  };

  const onMapDocFormReturn = (flag) => {
    if (flag) {
      getOrgDocFormDepartmentMapping();
    }
    setOpenAddDocForm2DepModal(false);
  };

  const onOrgDocFormDepartmentDelete = (record) => {
    confirmAlert({
      title: "Confirm!",
      message:
        "Sure to delete DocForm mapping with '" +
        record.department.name +
        "' department",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceedOrgDocFormDepartmentDelete(record.id);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceedOrgDocFormDepartmentDelete = (recordId) => {
    axios
      .post(
        WsDeleteOrgDocFormDepartmentMap,
        JSON.stringify({
          id: recordId,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("Delemap_responseData", responseData);
        if (responseData.resultCode == 1) {
          getOrgDocFormDepartmentMapping();
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("Delemap_error", error);
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
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>{docForm.nameTitle}</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  <ReactTooltip place="top" type="dark" effect="solid" />

                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  <div className="row">
                    <div className="col-2">
                      <p>
                        <strong>Publish/Unpublish</strong>
                      </p>
                      {/* <br /> */}
                      {userData.crudAccess?.docForm.u == 1 ? (
                        <>
                          {docForm.isPublished == 1 ? (
                            <button
                              type="button"
                              // data-tip="UnPublish"
                              title="UnPublish"
                              key={`unpublish${docForm.id}`}
                              // className="fa fa-upload btn btn-outline-danger btn-sm"
                              className="btn btn-outline-danger btn-sm"
                              // style={{ color: "red", cursor: "pointer" }}
                              onClick={() => publishAlert(docForm, 0)}
                              aria-hidden="true"
                            >
                              UnPublish
                            </button>
                          ) : (
                            <button
                              type="button"
                              // data-tip="Publish"
                              title="Publish"
                              key={`publish${docForm.id}`}
                              // className="fa fa-download btn btn-secondary bg-primary"
                              className="btn btn-sm btn-secondary bg-primary"
                              // style={{ color: "red", cursor: "pointer" }}
                              onClick={() => publishAlert(docForm, 1)}
                              aria-hidden="true"
                            >
                              Publish
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>

                    <div className="col-2">
                      <p>
                        <strong>Details</strong>
                      </p>
                      {/* <div className="row"> */}
                      {/* <div className="col-6"> */}
                      {/* <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={approveThisDocForm}
                          >
                            Approve
                          </button> */}
                      {/* </div> */}
                      {/* <div className="col-6"> */}
                      {!docForm.isPublished &&
                      userData.crudAccess?.docForm.u == 1 ? (
                        <button
                          type="button"
                          className="btn btn-sm outline-primary-button"
                          onClick={goToDocFormEdit}
                        >
                          Edit
                        </button>
                      ) : null}
                    </div>

                    {/* <div className="col-md-2">
                      <p>
                        <strong>Make Copy</strong>
                      </p>
                      {userData.crudAccess?.docForm.u == 1 ? (
                        <button
                          type="button"
                          className="btn btn-outline-info btn-sm"
                          onClick={onCopyofDocForm}
                        >
                          Make Copy
                        </button>
                      ) : null}
                    </div> */}

                    <div className="col-8">
                      <p>
                        <strong>Template</strong>
                      </p>
                      {userData.crudAccess?.docForm.r == 1 ? (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={openTabForPreviewTestRun}
                        >
                          {/* Preview/TestRun */}
                          Test Run
                        </button>
                      ) : null}
                      {/* {!docForm.isPublished &&
                      userData.crudAccess?.docForm.u == 1 ? (
                        <button
                          type="button"
                          className="btn btn-success btn-sm "
                          onClick={goToDocFormFieldAndTemplate}
                        >
                          Create / Edit Doc
                        </button>
                      ) : null} */}
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-4">
                      <strong>Name/Title</strong>
                    </div>
                    <div className="col-8">{docForm.nameTitle}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>UID</strong>
                    </div>
                    <div className="col-8">{docForm.uid}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Category</strong>
                    </div>
                    <div className="col-8">{docForm.category.category}</div>
                  </div>

                  {/* <div className="row">
                    <div className="col-4">
                      <strong>Price</strong>
                    </div>
                    <div className="col-8">
                      <b>&#8377;</b> {docForm.price}
                    </div>
                  </div> */}

                  <div className="row">
                    <div className="col-4">
                      <strong>IsPublished</strong>
                    </div>
                    <div className="col-8">
                      {docForm.isPublished == 1 ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>IsPublic</strong>
                    </div>
                    <div className="col-8">
                      {docForm.isPublic == 1 ? "Yes" : "No"}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>CreatedOn</strong>
                    </div>
                    <div className="col-8">{docForm.createdOn}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>UpdatedOn</strong>
                    </div>
                    <div className="col-8">{docForm.updatedOn}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>CreatedBy</strong>
                    </div>
                    <div className="col-8">{docForm.createdBy?.name}</div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <strong>UpdatedBy</strong>
                    </div>
                    <div className="col-8">{docForm.updatedBy?.name}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Approved By</strong>
                    </div>
                    <div className="col-8">{docForm.approvedBy?.name}</div>
                  </div>

                  <div className="row">
                    <div className="col-4">
                      <strong>Template Fields Approved By</strong>
                    </div>
                    <div className="col-8">
                      {docForm.templateFieldsApprovedBy?.name}
                    </div>
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
                  <hr />
                  <div className="row">
                    <div className="col-12">
                      <h4>
                        Department Mapping{" "}
                        <i
                          title="Map DocForm to Department"
                          // data-tip="Map DocForm to Department"
                          className="fa fa-plus"
                          style={{ color: "green", cursor: "pointer" }}
                          onClick={() => setOpenAddDocForm2DepModal(true)}
                          aria-hidden="true"
                        />
                      </h4>
                      {docFormDepartments != undefined &&
                      docFormDepartments.length > 0 ? (
                        <div className=" ">
                          <ReactTooltip
                            place="top"
                            type="dark"
                            effect="solid"
                          />
                          <AllFeatureDataTable
                            columns={dataTableColumns}
                            data={docFormDepartments}
                          />
                        </div>
                      ) : (
                        <>No Data</>
                      )}

                      <Modal
                        // transparent={false}
                        // ariaHideApp={false}
                        isOpen={openAddDocForm2DepModal}
                        onRequestClose={() => setOpenAddDocForm2DepModal(false)}
                        style={{
                          overlay: {
                            // border: "1px solid gray",
                            // width: "45vw",
                            width: "99vw",
                            height: "100vh",
                            // left: "27%",
                            left: 0,
                            top: "0%",
                            // background: "",
                            zIndex: "5",
                          },
                          content: {
                            left: "20%",
                            width: "69vw",
                            // background: "transparent",
                            // border: "none",
                            // boxShadow:"0 0 5px black"
                            zIndex: "4",
                          },
                        }}
                      >
                        <div className="row">
                          <div className="col-6">
                            <h5>
                              Assign/Map '{docForm.nameTitle}' to Organisation
                              Department
                            </h5>
                          </div>
                          <div className="col-6" style={{ textAlign: "end" }}>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => setOpenAddDocForm2DepModal(false)}
                              style={{ cursor: "pointer" }}
                            >
                              <i className="fa fa-times"></i>
                            </button>
                          </div>
                          <div className="col-12">
                            <MapDocForm2Dep
                              orgId={userData.org.id}
                              docFormId={docForm.id}
                              userId={userData.id}
                              onReturn={onMapDocFormReturn}
                              type={0}
                            />
                          </div>
                        </div>
                      </Modal>
                    </div>
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
