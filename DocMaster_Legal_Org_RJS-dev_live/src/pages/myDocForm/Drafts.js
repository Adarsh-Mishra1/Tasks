//Drafts.js: Show User DocForm partially saved i.e. drafts
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { confirmAlert } from "react-confirm-alert"; // Import Dep
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import { toast } from "react-toastify";

import {
  WSGetMyFilledOrgDocForms,
  WSDeleteMyFilledOrgDocForm,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

import userStore from "../../zustand/userStore";

import AllFeatureDataTable from "../../GuiComponents/AllFeatureDataTable.table";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const Drafts = () => {
  let navigate = useNavigate();

  const userData = userStore((state) => state.user);

  const [errorMsg, setErrorMsg] = useState("");
  const [docForms, setDocForms] = useState([]);

  let { isDraft } = useParams();

  // console.log("show_draft_records", isDraft);

  const dataTableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "DraftTitle",
      accessor: "title",
    },
    {
      Header: "Documents",
      accessor: "docFormTitle",
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
    getDraftDocForm();
  }, []);

  const getDraftDocForm = () => {
    toast.success("Loading ...", {
      autoClose: 50,
    });

    axios
      .get(WSGetMyFilledOrgDocForms + "/" + userData.id + "/0", {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("getDraftDocForm_responseData", responseData);
        if (responseData.result_code === 1) {
          setDocForms(processData(responseData.result_message));
        } else {
          alert(responseData.result_message);
          setErrorMsg(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("getDraftDocForm_error", error);
        setErrorMsg("Error while processing");
      });
  };

  const processData = (simpleDataArray) => {
    // let blankData = [];

    simpleDataArray.map((simpleData, index) => {
      console.log("processData_simpleData", simpleData);

      simpleData["sno"] = index + 1;
      simpleData["docFormTitle"] = simpleData.docForm.nameTitle;

      simpleData["actiontd"] = (
        <>
          <i
            data-tip="Continue"
            title="Continue"
            key={`Continue${index}`}
            className="fa fa-arrow-right mx-2"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => go2ContinueDraftDocForm(simpleData)}
          ></i>
          <i
            title="Delete"
            data-tip="Delete"
            key={`deleteDraft${index}`}
            className="fa fa-trash mx-2"
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => deleteThisDraftRecord(simpleData)}
            aria-hidden="true"
          ></i>
        </>
      );
      // blankData.push(simpleData);
    });
    // return blankData;
    return simpleDataArray;
  };

  const go2ContinueDraftDocForm = (draftData) => {
    delete draftData["actiontd"]; //DevNote:Needed

    draftData.docForm["formId"] = draftData.docForm.id;
    draftData.docForm["formNameTitle"] = draftData.docForm.nameTitle;

    navigate("/orgDocFormFill", {
      state: {
        docForm: draftData.docForm,
        draftDataRecId: draftData.recId,
        from: "draft",
      },
    });
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
    toast.success("Deleting ...", {
      autoClose: 50,
    });

    console.log(
      "proceedToDeleteDraftRecord_WSDeleteMyFilledOrgDocForm",
      WSDeleteMyFilledOrgDocForm + "/" + userData.id + "/" + recId,
    );
    axios
      .get(WSDeleteMyFilledOrgDocForm + "/" + userData.id + "/" + recId, {
        headers: apiKeyHeader(),
      })
      .then((response) => {
        const responseData = response.data;
        console.log("proceedToDeleteDraftRecord_responseData", responseData);
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

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        <div className="right_col" role="main">
          <div className="page-title">
            <div className="title_left">
              <h3>Org DocForms Draft(s)</h3>
            </div>
          </div>

          <div className="clearfix"></div>

          <div className="row">
            <div className="col-md-12 col-sm-12  ">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Organisation My DocForm Draft(s)</h2>
                  <div className="clearfix"></div>
                </div>
                <div className="x_content">
                  {errorMsg ? (
                    <div>
                      <b>{errorMsg}</b>
                    </div>
                  ) : null}

                  {docForms != undefined && docForms.length > 0 ? (
                    <div className="table-responsive">
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

export default Drafts;
