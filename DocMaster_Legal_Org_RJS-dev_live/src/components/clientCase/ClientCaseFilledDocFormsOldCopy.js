//ClientCaseDocForms.js
import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReactSelect from "react-select";
import Modal from "react-modal";

import ReactToPrint from "react-to-print";
import axios from "axios";

import userStore from "../../zustand/userStore";
import {
  WsGetClientCaseFilledDocForms,
  WsGetClientCaseFilledDocFormDraft,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(
  () => import("../../GuiComponents/AllFeatureDataTable.table"),
);
const MergeClientCaseFilledDocForm = lazy(
  () => import("./MergeClientCaseFilledDocFormV2"),
);

const ClientCaseFilledDocForms = (props) => {
  const componentRef = useRef();
  const userData = userStore((state) => state.user);

  const [dataError, setDataError] = useState();

  const tableColumns = [
    {
      Header: "S. No",
      accessor: "sno",
    },
    {
      Header: "Documents",
      accessor: "docFormTxt",
    },
    {
      Header: "Type",
      accessor: "typeTxt",
    },
    {
      Header: "Action(s)",
      accessor: "actiontd",
    },
  ];

  const [tableData, setTableData] = useState();
  const [caseFilledDocForms, setCaseFilledDocForms] = useState([]);
  const [caseFilledDocForm, setCaseFilledDocForm] = useState();
  const [caseFilledDocFormDraft, setCaseFilledDocFormDraft] = useState();

  const [
    showClientFilledDocFormMergeModal,
    setShowClientFilledDocFormMergeModal,
  ] = useState(false);

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getClientCaseFilledDocForms();
    } else {
      window.location.href = "/";
    }
  }, []);

  const getClientCaseFilledDocForms = () => {
    console.log("getClientCaseFilledDocForms_responseData", "Called");
    setDataError();
    axios
      .get(
        WsGetClientCaseFilledDocForms +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getClientCaseFilledDocForms_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCaseFilledDocForms(
            processCaseFilledDocFormsForDropDown(responseData.resultMessage),
          );
          setTableData(processCaseFilledDocForms(responseData.resultMessage));
        } else {
          //   alert(" Client Case DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
        setDataError(responseData.resultMessage);
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };
  const processCaseFilledDocFormsForDropDown = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["value"] = simpleData.id;
      simpleData["label"] = simpleData.docform.nameTitle;
      if (simpleData.type == "clntinfo") {
        simpleData["label"] =
          simpleData.docform.nameTitle + ", Type: Case information";
      }
      if (simpleData.type == "landj") {
        simpleData["label"] =
          simpleData.docform.nameTitle + ", Type: Limitation & Jurisdiction";
      }
      if (simpleData.type == "drftng") {
        simpleData["label"] = simpleData.docform.nameTitle + ", Type: Drafting";
      }
      if (simpleData.type == "clientCaseOtherDF") {
        simpleData["label"] =
          simpleData.docform.nameTitle + ", Type: External Record(s)";
      }
    });
    return simpleDataArray;
  };

  const processCaseFilledDocForms = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["docFormTxt"] = simpleData.docform.nameTitle;
      simpleData["typeTxt"] = "";
      if (simpleData.type == "clntinfo") {
        simpleData["typeTxt"] = "Case information";
      }
      if (simpleData.type == "landj") {
        simpleData["typeTxt"] = "Limitation & Jurisdiction";
      }
      if (simpleData.type == "drftng") {
        simpleData["typeTxt"] = "Drafting";
      }
      if (simpleData.type == "clientCaseOtherDF") {
        simpleData["typeTxt"] = "External Record(s)";
      }

      simpleData["actiontd"] = (
        <>
          <i
            className="fa fa-eye mx-2"
            title="View"
            style={{ color: "blue", cursor: "pointer" }}
            aria-hidden="true"
            onClick={() => viewFilledDocFormDraft(simpleData)}
          />
        </>
      );
    });
    return simpleDataArray;
  };

  const viewFilledDocFormDraft = (simpleData) => {
    const tempFilledDocForm = { ...simpleData };
    delete tempFilledDocForm["actiontd"];
    getDocFormFilledDraft(tempFilledDocForm);
  };

  const getDocFormFilledDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}/{caseId}/{orgId}/{userId}
    axios
      .get(
        WsGetClientCaseFilledDocFormDraft +
          "/" +
          filledDocForm.id +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getDocFormFilledDraft_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCaseFilledDocForm(filledDocForm);
          setCaseFilledDocFormDraft(responseData.resultMessage);
          // const [caseFilledDocForm, setCaseFilledDocForm] = useState();
          // const [caseFilledDocFormDraft, setCaseFilledDocFormDraft] = useState();

          // setSelectedDocFormDrafData(responseData.resultMessage);/
        } else {
          //   alert(" Client Case DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
        // setDataError(responseData.resultMessage);
        // setSelectedDocForm();
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="row">
        <div className="col-md-12">
          {showClientFilledDocFormMergeModal ? (
            <>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => setShowClientFilledDocFormMergeModal(false)}
              >
                <i className="fa fa-times" aria-hidden="true" /> Merge Filled
                Close Merge
              </button>
              <MergeClientCaseFilledDocForm
                filledDocForms={caseFilledDocForms}
                clientCase={props.clientCase}
              />
            </>
          ) : (
            <>
              <h6>Tools</h6>
              <button
                type="button"
                className="btn btn-info"
                onClick={() => setShowClientFilledDocFormMergeModal(true)}
              >
                <i className="fa fa-compress" aria-hidden="true" /> Merge Filled
                DocForm
              </button>
              <div
                className={
                  caseFilledDocFormDraft != undefined ? "col-md-6" : "col-md-12"
                }
              >
                {tableData && tableData.length > 0 ? (
                  <div className="table-responsive">
                    <h6>Filled Documents</h6>
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                  </div>
                ) : null}
              </div>
              {caseFilledDocFormDraft != undefined ? (
                <div className="col-md-6">
                  <div className="col-md-10">
                    <h6>
                      Preview of Selected DocForm Draft '
                      {caseFilledDocForm.label}'
                    </h6>
                  </div>
                  <div className="col-md-2" style={{ textAlign: "right" }}>
                    <button className="btn btn-sm btn-outline-danger">
                    <i
                      className="fa fa-times"
                      aria-hidden="true"
                       
                      onClick={() => {
                        setCaseFilledDocForm();
                        setCaseFilledDocFormDraft();
                      }}
                    />
                    </button>
                  </div>
                  <br />
                  <div
                    className="col-md-12"
                    id="selectedDocFormDraftDataPrevei"
                    //   ref={componentRef}
                    key={`selectedDocFormDraftDataCcDiv` + caseFilledDocForm.id}
                    dangerouslySetInnerHTML={{
                      __html: caseFilledDocFormDraft.htmlData,
                    }}
                  />
                </div>
              ) : null}
            </>
          )}

          {/* <Modal
            transparent={false}
            ariaHideApp={false}
            isOpen={false}
            style={{
              overlay: {
                width: "100vw",
                top: "0%",
                zIndex: 9999,
              },
              content: {
                left: "5%",
                width: "90vw",
              },
            }}
          >
            <button
              className="btn btn-danger"
              style={{ position: "absolute", top: 5, right: 5 }}
              onClick={() => {
                setShowClientFilledDocFormMergeModal(false);
              }}
            >
              Close
            </button>
            <br />
            <div>
              <MergeClientCaseFilledDocForm
                filledDocForms={caseFilledDocForms}
                clientCase={props.clientCase}
              />
            </div>
          </Modal> */}
          {/* <button
            type="button"
            className="btn btn-info"
            onClick={() => setShowClientFilledDocFormMergeModal(true)}
          >
            <i className="fa fa-compress" aria-hidden="true" /> Merge Filled
            DocForm
          </button> */}
        </div>
        {/* <div
          className={
            caseFilledDocFormDraft != undefined ? "col-md-6" : "col-md-12"
          }
        >
          {tableData && tableData.length > 0 ? (
            <div className="table-responsive">
              <h6>Filled DocForm(s)</h6>
              <AllFeatureDataTable columns={tableColumns} data={tableData} />
            </div>
          ) : null}
        </div> */}
        {/* {caseFilledDocFormDraft != undefined ? (
          <div className="col-md-6">
            <div className="col-md-10">
              <h6>
                Preview of Selected DocForm Draft '{caseFilledDocForm.label}'
              </h6>
            </div>
            <div className="col-md-2" style={{ textAlign: "right" }}>
              <i
                className="fa fa-close"
                aria-hidden="true"
                style={{ color: "red", cursor: "pointer" }}
                onClick={() => {
                  setCaseFilledDocForm();
                  setCaseFilledDocFormDraft();
                }}
              />
            </div>
            <br />
            <div
              className="col-md-12"
              id="selectedDocFormDraftDataPrevei"
              //   ref={componentRef}
              key={`selectedDocFormDraftDataCcDiv` + caseFilledDocForm.id}
              dangerouslySetInnerHTML={{
                __html: caseFilledDocFormDraft.htmlData,
              }}
            />
          </div>
        ) : null} */}
      </div>
    </Suspense>
  );
};

export default ClientCaseFilledDocForms;
