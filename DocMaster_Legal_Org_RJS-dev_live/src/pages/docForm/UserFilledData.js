//UserFilledData
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WSGetOrgDocFormFilled,
  WSGetOrgUserCrudAccess,
  WSDeleteFilledOrgDocForm,
  WSDeleteMyFilledOrgDocForm,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const UserFilledData = () => {
  let navigate = useNavigate();
  let location = useLocation();
  console.log("UserFilledData_locationstate", location.state);
  const userData = userStore((state) => state.user);
  const docForm = location.state.docForm;
  const showSubmitted = location.state.showSubmitted;
  const [errorMsg, setErrorMsg] = useState("");
  const [docFormUserFilled, setDocFormUserFilled] = useState([]);
  let [userSystemAccess, setUserSystemAccess] = useState({
    c: 1,
    r: 0,
    u: 0,
    d: 0,
  });

  //   const [showRecords, setShowRecords] = useState(false);
  /*{
    recId: <recId>,
    title:<`org_docform_user_data`.`title`>,
    dateTime:<dateTime>,
    userData:{id:<`users`.`id`>,
    name:<`users`.`name`>,
    mobileNo:<`users`.`mobileNo`>,
    emailId:<`users`.`emailId`>}
    */
  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Title",
      accessor: "title",
    },
    {
      Header: "User",
      accessor: "userTxt",
    },
    {
      Header: "DateTime",
      accessor: "dateTime",
    },
    {
      Header: "Actions",
      accessor: "actiontd",
    },
  ];

  useEffect(() => {
    fetchCombinedData();
  }, []);

  function fetchCombinedData() {
    toast.success("Loading User Data Please Wait ...", {
      autoClose: 500,
    });

    //[url/userId/orgId/docFormId]
    const requestOrgUserCrudAccess = axios.get(
      WSGetOrgUserCrudAccess +
        "/" +
        userData.id +
        "/" +
        userData.org.id +
        "/" +
        docForm.id,
      {
        headers: apiKeyHeader(),
      },
    );

    // console.log("UserFilledData_WSGetOrgUserCrudAccess_params","/" + userData.id + "/" + userData.org.id + "/" + docForm.id);
    // [url/orgFormId/submitted]
    const requestOrgDocFormFilled = axios.get(
      WSGetOrgDocFormFilled + "/" + docForm.id + "/" + showSubmitted,
      {
        headers: apiKeyHeader(),
      },
    );

    axios
      .all([requestOrgUserCrudAccess, requestOrgDocFormFilled])
      .then(
        axios.spread((...responses) => {
          console.log("UserFilledData_fetchCombinedData_", responses);
          const responseOrgUserCrudAccess = responses[0];
          const responseOrgDocFormFilled = responses[1];

          const responseOrgUserCrudAccessData = responseOrgUserCrudAccess.data;
          if (responseOrgUserCrudAccessData.resultCode === 1) {
            userSystemAccess = responseOrgUserCrudAccessData.resultMessage;
            setUserSystemAccess(responseOrgUserCrudAccessData.resultMessage);
            console.log(
              "UserFilledData_fetchCombinedData_responseOrgUserCrudAccessData",
              responseOrgUserCrudAccessData,
            );
          }

          const responseOrgDocFormFilledData = responseOrgDocFormFilled.data;
          if (responseOrgDocFormFilledData.result_code === 1) {
            setDocFormUserFilled(
              processData(responseOrgDocFormFilledData.result_message),
            );
          }
        }),
      )
      .catch((errors) => {
        // react on errors.
        console.error("UserFilledData_fetchCombinedData_errors", errors);
      });
  }

  const processData = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      // console.log("processData_simpleData", simpleData);
      // console.log("processData_simpleData_userSystemAccess", userSystemAccess);
      simpleData["sno"] = index + 1;
      simpleData["userTxt"] =
        simpleData.userData.name + " (" + simpleData.userData.mobileNo + ")";

      if (showSubmitted == 1) {
        simpleData["actiontd"] = (
          <>
            {userSystemAccess?.r == 1 ? (
              <i
                data-tip="View"
                title="View"
                key={`view${index}`}
                className="fa fa-eye "
                style={{ color: "blue", cursor: "pointer", marginRight: 10 }}
                aria-hidden="true"
                onClick={() => go2ViewDocFormFilledData(simpleData)}
              ></i>
            ) : null}

            {/* {userSystemAccess?.u == 1 ? (
              <i
                title="Edit"
                data-tip="Edit"
                className="fa fa-pencil mr-3"
                style={{ color: "green", cursor: "pointer" }}
                //   onClick={() => goToSetShowDocFormUserAccess(simpleData)}
                aria-hidden="true"
              ></i>
            ) : null} */}

            {userSystemAccess?.d == 1 ? (
              <i
                title="Delete"
                data-tip="Delete"
                className="fa fa-trash"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => deleteMarkThisRecord(simpleData)}
                aria-hidden="true"
              ></i>
            ) : null}
          </>
        );
      } else {
        simpleData["actiontd"] = (
          <>
            {/*DevNote[Remark]: If User Have Update Access*/}
            {userSystemAccess?.u == 1 ? (
              <i
                title="Edit"
                data-tip="Edit"
                className="fa fa-arrow-right"
                style={{ color: "blue", cursor: "pointer", marginRight: 10 }}
                onClick={() => processContinueDraftDocForm(simpleData)}
                aria-hidden="true"
              ></i>
            ) : null}
            {/*DevNote[Remark]: If User Have Delete Access*/}
            {userSystemAccess?.d == 1 ? (
              <i
                title="Delete"
                data-tip="Delete"
                className="fa fa-trash"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => processdeleteThisDraftRecord(simpleData)}
                aria-hidden="true"
              ></i>
            ) : null}
          </>
        );
      }
      // blankData.push(simpleData);
    });
    // return blankData;
    return simpleDataArray;
  };

  const processContinueDraftDocForm = (draftData) => {
    // alert("ToDo");
    // console.log("UserActionToContinue_draftData",draftData)
    // console.log("UserActionToContinue_docForm",docForm);
    /*DevNote: OnClick firs check USER CRUD access as per USer 
      if it has previliages go2ContinueDraftDocForm
    */
    go2ContinueDraftDocForm(draftData);
  };

  const go2ContinueDraftDocForm = (draftData) => {
    // console.log("go2ContinueDraftDocForm_draftData",draftData);
    delete draftData["actiontd"]; //DevNote:Needed
    draftData["docForm"] = docForm;
    draftData.docForm["formId"] = docForm.id;
    draftData.docForm["formNameTitle"] = docForm.nameTitle;
    // console.log("go2ContinueDraftDocForm_draftData",draftData);
    // console.log("go2ContinueDraftDocForm_docForm",docForm);
    navigate("/orgDocFormFill", {
      state: {
        docForm: draftData.docForm,
        draftDataRecId: draftData.recId,
        from: "showAllFilledBy",
        submittedBy: draftData.userData,
      },
    });
  };

  const processdeleteThisDraftRecord = (draftData) => {
    // alert("ToDo");
    /*DevNote: OnClick firs check USER CRUD access as per USer 
      if it has previliages deleteThisDraftRecord
    */
    deleteThisDraftRecord(draftData);
  };

  const deleteThisDraftRecord = (draftData) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this draft record",
      buttons: [
        {
          label: "Yes",
          onClick: () => proceedToDeleteDraftRecord(draftData.recId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const proceedToDeleteDraftRecord = (recId) => {
    //DevNote[Remark]: Marking Draft Data Delete
    toast.success("Deleting ...", {
      autoClose: 50,
    });

    // console.log(
    //   "proceedToDeleteDraftRecord_WSDeleteMyFilledOrgDocForm",
    //   WSDeleteFilledOrgDocForm + "/" + userData.id + "/" + recId
    // );

    axios
      .get(WSDeleteFilledOrgDocForm + "/" + userData.id + "/" + recId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        // console.log("proceedToDeleteDraftRecord_responseData", responseData);
        if (responseData.result_code === 1) {
          window.location.reload();
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("proceedToDeleteDraftRecord_error", error);
        setErrorMsg("Error while processing to delete");
      });
  };

  const go2ViewDocFormFilledData = (filledRecData) => {
    delete filledRecData["actiontd"]; //DevNote:Needed
    navigate("/docFormViewUserFilled", {
      state: {
        filledRecData: filledRecData,
        docForm: docForm,
      },
    });
  };

  const deleteMarkThisRecord = (draftData) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure to delete this draft record",
      buttons: [
        {
          label: "Yes",
          onClick: () => proceedToMarkDeleteRecord(draftData.recId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const proceedToMarkDeleteRecord = (recId) => {
    toast.success("Deleting ...", {
      autoClose: 50,
    });

    console.log(
      "proceedToMarkDeleteRecord_WS",
      WSDeleteFilledOrgDocForm + "/" + userData.id + "/" + recId,
    );
    axios
      .get(WSDeleteFilledOrgDocForm + "/" + userData.id + "/" + recId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToMarkDeleteRecord_responseData", responseData);
        if (responseData.result_code === 1) {
          window.location.reload();
        } else {
          alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("proceedToMarkDeleteRecord_error", error);
        setErrorMsg("Error while processing to delete");
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
              <h3>
                User {showSubmitted == 1 ? "Submitted" : "Draft Data"} DocForm
                Records
              </h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>for "{docForm.nameTitle}"</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}
                  {docFormUserFilled != undefined &&
                  docFormUserFilled.length > 0 ? (
                    <div className=" ">
                      <ReactTooltip place="top" type="dark" effect="solid" />
                      <AllFeatureDataTable
                        columns={dataTableColumns}
                        data={docFormUserFilled}
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
export default UserFilledData;
