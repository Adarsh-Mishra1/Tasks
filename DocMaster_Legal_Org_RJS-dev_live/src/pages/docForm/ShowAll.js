//ShowAll.js
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WSGetAllDocForm,
  WSPublishDocForm,
  WsGetOrgDocFormsByDepartment,
  WsDeleteDocForm,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

const MapDocForm2Dep = lazy(() => import("../../components/MapDocForm2Dep"));
const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const ShowAll = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [docForms, setDocForms] = useState([]);
  const [openAddDocForm2DepModal, setOpenAddDocForm2DepModal] = useState(false);
  let department = location?.state?.department;
  console.log("_location?.state", location?.state);
  console.log("_department", department);
  /*        id:<org_forms.id>,
        language:{id:<doc_languages.id>,language:<doc_languages.language>},
        uid:<org_forms.form_uid>,
        nameTitle:<org_forms.name_title>,
category:{id:<`forms_category`.`id`>,category:<`forms_category`.`category`>},
        price:<org_forms.price>,
        isPublic:<org_forms.is_public>,
        isPublished:<org_forms.is_published>*/
  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Name",
      accessor: "nameTitle",
    },
    {
      Header: "IsPublished",
      accessor: "isPublishedTxt",
    },
    {
      Header: "Category",
      accessor: "categoryTxt",
    },
    // {
    //   Header: "Language",
    //   accessor: "languageTxt",
    // },
    // {
    //   Header: "IsPublic",
    //   accessor: "isPublicTxt",
    // },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    if (department != null && department != undefined && department?.id > 0) {
      getOrgDepartmentAllDocForm();
    } else {
      getOrgAllDocForm();
    }
  }, []);

  const getOrgAllDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WSGetAllDocForm + "/" + userData.id + "/" + userData.org.id, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgAllDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          setDocForms(processData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getOrgAllDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    // let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["categoryTxt"] = simpleData.category?.category;
      // simpleData["languageTxt"] = simpleData.language.language;

      simpleData["isPublishedTxt"] = "No";
      // simpleData["isPublicTxt"] = "No";

      let publishUnpublishBtn = <></>;

      if (userData.crudAccess?.docForm.u == 1) {
        publishUnpublishBtn = (
          <i
            data-tip="Publish"
            title="Publish"
            key={`publish${index}`}
            className="fa fa-upload"
            style={{ color: "black", cursor: "pointer", marginRight: 10 }}
            onClick={() => publishAlert(simpleData, 1)}
            aria-hidden="true"
          ></i>
        );

        if (simpleData.isPublished == 1) {
          simpleData["isPublishedTxt"] = "Yes";
          publishUnpublishBtn = (
            <i
              data-tip="UnPublish"
              title="UnPublish"
              key={`unpublish${index}`}
              className="fa fa-download"
              style={{ color: "red", cursor: "pointer", marginRight: 10 }}
              onClick={() => publishAlert(simpleData, 0)}
              aria-hidden="true"
            ></i>
          );
        }
      }

      if (simpleData.isPublic == 1) {
        simpleData["isPublicTxt"] = "Yes";
      }

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              data-tip="View"
              title="View"
              key={`view${index}`}
              className="fa fa-eye"
              style={{ color: "blue", cursor: "pointer", marginRight: 10 }}
              aria-hidden="true"
              onClick={() => go2ViewDocForm(simpleData)}
            ></i>
          ) : null}

          {publishUnpublishBtn}

          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title="Filled Form Data"
              data-tip="Filled Form Data"
              className="fa fa-database"
              style={{ color: "green", cursor: "pointer", marginRight: 10 }}
              onClick={() => goToShowDocFormUserFillData(simpleData, 1)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title="Draft Form Data"
              data-tip="Draft Form Data"
              className="fa fa-database"
              style={{ color: "red", cursor: "pointer", marginRight: 10 }}
              onClick={() => goToShowDocFormUserFillData(simpleData, 0)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.docForm.u == 1 ? (
            <i
              title="Form User Access"
              data-tip="Form User Access"
              className="fa fa-user mr-2"
              style={{ color: "green", cursor: "pointer", marginRight: 12 }}
              onClick={() => goToSetShowDocFormUserAccess(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.docForm.d == 1 ? (
            <i
              title="Delete"
              data-tip="Delete"
              className="fa fa-trash mr-2"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => delAlert(simpleData)}
              aria-hidden="true"
            />
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

  const getOrgDepartmentAllDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(
        WsGetOrgDocFormsByDepartment +
          "/" +
          userData.org.id +
          "/" +
          department.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getOrgDepDocForms_responseData", responseData);
        if (responseData.resultCode === 1) {
          setErrorMsg("");
          setDocForms(processOrgDepData(responseData.resultMessage));
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("getOrgDepDocForms_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processOrgDepData = (simpleDataArray) => {
    let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      simpleData = simpleData.orgDocForm;

      console.log("simpleData", simpleData);
      simpleData["sno"] = index + 1;
      simpleData["category"] = simpleData?.categoryCode;
      simpleData["categoryTxt"] = simpleData.category?.category;
      // simpleData["languageTxt"] = simpleData.language.language;

      simpleData["isPublishedTxt"] = "No";
      // simpleData["isPublicTxt"] = "No";

      let publishUnpublishBtn = <></>;

      if (userData.crudAccess?.docForm.u == 1) {
        publishUnpublishBtn = (
          <i
            data-tip="Publish"
            title="Publish"
            key={`publish${index}`}
            className="fa fa-upload mr-3"
            style={{ color: "black", cursor: "pointer", marginRight: 10 }}
            onClick={() => publishAlert(simpleData, 1)}
            aria-hidden="true"
          ></i>
        );

        if (simpleData.isPublished == 1) {
          simpleData["isPublishedTxt"] = "Yes";
          publishUnpublishBtn = (
            <i
              data-tip="UnPublish"
              title="UnPublish"
              key={`unpublish${index}`}
              className="fa fa-download mr-3"
              style={{ color: "red", cursor: "pointer", marginRight: 10 }}
              onClick={() => publishAlert(simpleData, 0)}
              aria-hidden="true"
            ></i>
          );
        }
      }

      if (simpleData.isPublic == 1) {
        simpleData["isPublicTxt"] = "Yes";
      }

      simpleData["actiontd"] = (
        <>
          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              data-tip="View"
              title="View"
              key={`view${index}`}
              className="fa fa-eye"
              style={{ color: "blue", cursor: "pointer", marginRight: 10 }}
              aria-hidden="true"
              onClick={() => go2ViewDocForm(simpleData)}
            ></i>
          ) : null}

          {publishUnpublishBtn}

          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title="Filled Form Data"
              data-tip="Filled Form Data"
              className="fa fa-database mr-3"
              style={{ color: "green", cursor: "pointer", marginRight: 10 }}
              onClick={() => goToShowDocFormUserFillData(simpleData, 1)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.docForm.r == 1 ? (
            <i
              title="Draft Form Data"
              data-tip="Draft Form Data"
              className="fa fa-database mr-3"
              style={{ color: "red", cursor: "pointer", marginRight: 10 }}
              onClick={() => goToShowDocFormUserFillData(simpleData, 0)}
              aria-hidden="true"
            ></i>
          ) : null}

          {userData.crudAccess?.docForm.u == 1 ? (
            <i
              title="Form User Access"
              data-tip="Form User Access"
              className="fa fa-user mr-3"
              style={{ color: "green", cursor: "pointer" }}
              onClick={() => goToSetShowDocFormUserAccess(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null}

          {/* {userData.crudAccess?.department.d == 1 ? (
            <i
              title="Delete"
              data-tip="Delete"
              className="fa fa-trash"
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => delDepAlert(simpleData)}
              aria-hidden="true"
            ></i>
          ) : null} */}
        </>
      );
      blankData.push(simpleData);
    });

    // console.log("processData_blankData",blankData)
    // console.log("processData_simpleDataArray",simpleDataArray)
    // return blankData;
    return blankData;
  };

  const go2ViewDocForm = (docForm) => {
    delete docForm["actiontd"]; //DevNote:Needed
    // console.log("go2ViewDocForm_docForm",docForm)
    navigate("/docFormView", {
      state: {
        docForm: docForm,
      },
    });
  };

  const goToShowDocFormUserFillData = (docForm, showSubmitted) => {
    delete docForm["actiontd"]; //DevNote:Needed
    navigate("/docFormUserFilledData", {
      state: {
        docForm: docForm,
        showSubmitted: showSubmitted,
      },
    });
  };

  const goToSetShowDocFormUserAccess = (docForm) => {
    delete docForm["actiontd"]; //DevNote:Needed
    navigate("/docFormUserAccess", {
      state: {
        docForm: docForm,
      },
    });
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

  const delAlert = (docForm) => {
    // alert("To be Done");
    confirmAlert({
      title: "Confirm!",
      message: "Are you sure to Delete '" + docForm.nameTitle + "'",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            proceed2DeleteDocForm(docForm);
          },
        },
        {
          label: "No",
        },
      ],
    });
  };

  const proceed2DeleteDocForm = (docForm) => {
    toast.success("Deleting ...", {
      autoClose: 50,
    });

    axios
      .post(
        WsDeleteDocForm,
        JSON.stringify({
          adminId: userData.id,
          id: docForm.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToPubUnPubDocForm_responseData", responseData);
        if (responseData.resultCode === 1) {
          window.location.reload();
        } else {
          alert(responseData.resultMessage);
          setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("proceedToPubUnPubDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const onMapDocFormReturn = (flag) => {
    if (flag) {
      getOrgDepartmentAllDocForm();
    }
    setOpenAddDocForm2DepModal(false);
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
              <h3>
                {department?.id > 0
                  ? department.name + " Documents"
                  : "List of Documents"}
              </h3>
              {department?.id > 0 ? (
                <h3>
                  Department: {department.name}{" "}
                  <i
                    title="Add User to Department"
                    // data-tip="Add User to Department"
                    className="fa fa-plus"
                    style={{ color: "green", cursor: "pointer" }}
                    onClick={() => setOpenAddDocForm2DepModal(true)}
                    aria-hidden="true"
                  />
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
                          Assign/Map docForm to '{department.name}' Department
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
                          userId={userData.id}
                          department={department}
                          onReturn={onMapDocFormReturn}
                          type={1}
                        />
                      </div>
                    </div>
                  </Modal>
                </h3>
              ) : null}
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
                  <h2>List of documents that have been created </h2>
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
                  {errorMsg.length > 1 ? <b>{errorMsg}</b> : null}

                  {docForms != undefined && docForms.length > 0 ? (
                    <div className=" ">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={docForms}
                      />
                    </div>
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

export default ShowAll;
