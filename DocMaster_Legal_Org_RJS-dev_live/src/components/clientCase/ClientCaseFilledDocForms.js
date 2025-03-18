//ClientCaseDocForms.js
import { useEffect, useState, Suspense, lazy, useRef } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import ReactSelect from "react-select";
// import Modal from "react-modal";
// import ReactToPrint from "react-to-print";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import userStore from "../../zustand/userStore";
import {
  WsGetClientCaseFilledDocFormDraftNew,
  WsGetLegalResearchDocFormDraftNew,
  WsGetLegalResearchFinalDraftNew,
  WsGetClientCaseFilledDocFormsNew,
  WsGetCaseEventsNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);
const MergeClientCaseFilledDocForm = lazy(() =>
  import("./MergeClientCaseFilledDocFormV2")
);

const ClientCaseFilledDocForms = (props) => {
  // const componentRef = useRef();
  const userData = userStore((state) => state.user);

  const [filledDocForms, setFilledDocForms] = useState([]);

  const [dataError, setDataError] = useState();
  // const [caseEvent, setCaseEvent] = useState();

  const [caseEvents, setCaseEvents] = useState([]);

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

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      console.log("---------useEffect-----------props.changeCount");
      getClientCaseFilledDocForms();
    }
  }, [props.changeCount]);

  const getClientCaseFilledDocForms = () => {
    console.log("getClientCaseFilledDocForms_responseData", "Called");
    setDataError();
    // const localAPI =
    //   "http://164.52.210.124:4001/dm_leorg_test/getClientCaseFilledDocForms";
    // const localAPI =
    //   "http://localhost:8080/dm_leorg/getClientCaseFilledDocForms";
    // WsGetClientCaseFilledDocFormsNew

    axios
      .get(
        WsGetClientCaseFilledDocFormsNew +
          // WsGetClientCaseFilledDocForms +,
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("getClientCaseFilledDocForms_responseData", responseData);
        if (responseData.resultCode === 1) {
          const data = responseData.resultMessage.filter((each) => {
            if (each.type === "drftng") {
              return each.draftData.isFilled == 1;
            } else {
              return each.type !== "othr";
            }
          });
          setFilledDocForms(data);
          // setFilledDocForms(responseData.resultMessage);
        } else {
          // alert(" Client Case DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
        setDataError(responseData.resultMessage);
        //call to get CaseEvents here
        getClientCaseEvents();
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  useEffect(() => {
    if (filledDocForms.length > 0 && caseEvents.length > 0) {
      setCaseFilledDocForms(
        processCaseFilledDocFormsForDropDown([
          ...filledDocForms,
          createFakeCaseEventDocFormDraft(null, "event"),
        ])
      );
      setTableData(
        processCaseFilledDocForms([
          ...filledDocForms,
          createFakeCaseEventDocFormDraft(null, "event"),
        ])
      );
    } else if (filledDocForms.length > 0) {
      setCaseFilledDocForms(
        processCaseFilledDocFormsForDropDown(filledDocForms)
      );
      setTableData(processCaseFilledDocForms(filledDocForms));
    } else if (caseEvents?.length > 0) {
      setCaseFilledDocForms(
        processCaseFilledDocFormsForDropDown([
          ...filledDocForms,
          createFakeCaseEventDocFormDraft(null, "event"),
        ])
      );
      setTableData(
        processCaseFilledDocForms([
          ...filledDocForms,
          createFakeCaseEventDocFormDraft(null, "event"),
        ])
      );
    }
  }, [filledDocForms, caseEvents]);

  const processCaseFilledDocFormsForDropDown = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["value"] = simpleData.id;
      // simpleData["label"] = simpleData?.docform?.nameTitle;

      if (simpleData.type == "csrshfd") {
        // console.log("createFakeCaseEventDocFormDraft_",createFakeCaseEventDocFormDraft(simpleData.id,"csrshfd"))
        simpleData["docform"] = createFakeCaseEventDocFormDraft(
          simpleData.id,
          "csrshfd"
        );
        simpleData["label"] = "Research Final Draft";
      }

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
      if (simpleData.type == "casevnt") {
        simpleData["label"] =
          simpleData.docform.nameTitle + ", Type: CaseEvents";
      }
      if (simpleData.type == "rsrchdf") {
        simpleData["label"] =
          simpleData.docform.nameTitle + ", Type: Case Research(s)";
      }
    });
    return simpleDataArray;
  };

  const getClientCaseEvents = () => {
    setDataError();
    // /{caseId}/{orgId}/{userId}
    setCaseEvents([]);
    axios
      .get(
        WsGetCaseEventsNew +
          // WsGetCaseEvents +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCaseEvents(responseData.resultMessage);
          // createFakeCaseEventDocFormDraft()
        } else {
        }
        setDataError(responseData.resultMessage);
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const createFakeCaseEventDocFormDraft = (id, type) => {
    // var tempJsonObj = {
    //   sno: 0,
    //   id: 0,
    //   type: "casevnt",
    //   docform: {
    //     id: 0,
    //     description: "Case Events",
    //     formUid: "csevntdf00",
    //     nameTitle: "Case Events",
    //   },
    //   value: 0,
    //   label: "Case Events",
    //   docFormTxt: "Case Events",
    //   typeTxt: "Case Events",
    // };
    if (id == null) {
      return {
        sno: 0,
        id: 0,
        type: "casevnt",
        docform: {
          id: 0,
          description: "Case Events",
          formUid: "csevntdf00",
          nameTitle: "Case Events",
        },
        value: 0,
        label: "Case Events",
        docFormTxt: "Case Events",
        typeTxt: "Case Events",
      };
    }

    if (type == "csrshfd") {
      // return {
      //   id: id,
      //   type: "csrshfd",
      //   docform: {
      //     id: id,
      //     description: "Case Research Final Draft",
      //     formUid: "csrshfddf"+id,
      //     nameTitle: "Case Research Final Draft",
      //   },
      //   label: "Case Research Final Draft",
      //   docFormTxt: "Case Research Final Draft",
      //   typeTxt: "Case Research Final Draft",
      // };

      return {
        id: id,
        description: "Case Research Final Draft",
        formUid: "csrshfddf" + id,
        nameTitle: "Case Research Final Draft",
      };
    }
    // return tempJsonObj;
  };

  const processCaseFilledDocForms = (simpleDataArray) => {
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
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

      if (simpleData.type == "casevnt") {
        simpleData["typeTxt"] = "Case Events";
      }
      if (simpleData.type == "rsrchdf") {
        simpleData["typeTxt"] = "Case Research(s)";
      }

      if (simpleData.type == "csrshfd") {
        // console.log("createFakeCaseEventDocFormDraft_",createFakeCaseEventDocFormDraft(simpleData.id,"csrshfd"))
        simpleData["docform"] = createFakeCaseEventDocFormDraft(
          simpleData.id,
          "csrshfd"
        );
        simpleData["typeTxt"] = "Research Final Draft";
        simpleData["docFormTxt"] = "Case Research Final Draft";
      }

      simpleData["docFormTxt"] = simpleData?.docform?.nameTitle;

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
    if (tempFilledDocForm.type == "casevnt") {
      setCaseFilledDocForm(tempFilledDocForm);
      var tempHtml = createFakeCaseEventDocFormDraftHtml();
      if (tempHtml.length > 0) {
        setCaseFilledDocFormDraft({ htmlData: tempHtml });
      }
    } else if (tempFilledDocForm.type == "rsrchdf") {
      // alert("ToDo")
      getLegalResearchDocFormFilledDraft(tempFilledDocForm);
    } else if (tempFilledDocForm.type == "csrshfd") {
      // alert("ToDo")
      getLegalResearchFinalDraft(tempFilledDocForm);
    } else {
      getDocFormFilledDraft(tempFilledDocForm);
    }
  };

  const createFakeCaseEventDocFormDraftHtml = () => {
    // var tempHtmlData="";
    let caseEventTableTrTh = [];
    caseEventTableTrTh.push(
      <tr>
        <th>S. No</th>
        <th>Event</th>
        <th>DateTime</th>
      </tr>
    );
    caseEvents.forEach((caseEventObj, index) => {
      console.log(
        "createFakeCaseEventDocFormDraftHtml_caseEventObj",
        caseEventObj
      );
      // tempHtmlData=tempHtmlData+caseEventObj.detail+"<br>"
      caseEventTableTrTh.push(
        <tr>
          <td key={index + 1}>{index + 1}</td>
          <td>{caseEventObj.detail}</td>
          <td>{caseEventObj.dateTime}</td>
        </tr>
      );
    });
    // return tempHtmlData;
    // console.log("createFakeCaseEventDocFormDraftHtml_caseEventObj", (<table class="table">{caseEventTableTrTh}</table>));
    // console.log("createFakeCaseEventDocFormDraftHtml_caseEventObj", ReactDOMServer.renderToString(
    //   <table class="table">{caseEventTableTrTh}</table>
    // ));
    return ReactDOMServer.renderToString(
      <table class="table">{caseEventTableTrTh}</table>
    );
  };

  const getLegalResearchDocFormFilledDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}//{orgId}/{userId}
    axios
      .get(
        WsGetLegalResearchDocFormDraftNew +
          // WsGetLegalResearchDocFormDraft +
          "/" +
          filledDocForm.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log(
          "getLegalResearchDocFormFilledDraft_responseData",
          responseData
        );
        if (responseData.resultCode === 1) {
          setCaseFilledDocForm(filledDocForm);
          setCaseFilledDocFormDraft(responseData.resultMessage);
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

  const getLegalResearchFinalDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}//{orgId}/{userId}
    axios
      .get(
        WsGetLegalResearchFinalDraftNew +
          // WsGetLegalResearchFinalDraft +
          "/" +
          filledDocForm.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log(
          "getLegalResearchDocFormFilledDraft_responseData",
          responseData
        );
        if (responseData.resultCode === 1) {
          setCaseFilledDocForm(filledDocForm);
          setCaseFilledDocFormDraft(responseData.resultMessage);
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

  const getDocFormFilledDraft = (filledDocForm) => {
    // console.log("getClientCaseFilledDocForms_responseData", "Called");
    // setDataError();
    ///{id}/{caseId}/{orgId}/{userId}
    axios
      .get(
        // WsGetClientCaseFilledDocFormDraft +
        WsGetClientCaseFilledDocFormDraftNew +
          "/" +
          filledDocForm.id +
          "/" +
          props?.clientCase?.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id,
        {
          headers: apiKeyHeader(),
        }
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
          <div className="row">
          {showClientFilledDocFormMergeModal ? (
            <>
              <h6 style={{ textAlign: "right" }}>
                <button className="btn btn-sm btn-outline-danger"
                  onClick={() => setShowClientFilledDocFormMergeModal(false)}
                >
                  <i className="fa fa-times" aria-hidden="true" /> 
                </button>
              </h6>
              <MergeClientCaseFilledDocForm
                filledDocForms={caseFilledDocForms}
                clientCase={props.clientCase}
                caseevent2html={createFakeCaseEventDocFormDraftHtml()}
              />
            </>
          ) : (
            <>
              {/* <h6>Tools</h6> */}
              <div
                className={
                  caseFilledDocFormDraft != undefined ? "col-12 col-md-6" : "col-md-12"
                }
              >
                {tableData && tableData.length > 0 ? (
                  <div className="table-responsive">
                    <h6 style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        className="btn btn-info"
                        onClick={() =>
                          setShowClientFilledDocFormMergeModal(true)
                        }
                      >
                        <i className="fa fa-compress" aria-hidden="true" />{" "}
                        Merge
                        {/* Filled DocForm */}
                      </button>
                    </h6>
                    <AllFeatureDataTable
                      columns={tableColumns}
                      data={tableData}
                    />
                  </div>
                ) : (
                  <div>No Data Found</div>
                )}
              </div>
              {caseFilledDocFormDraft != undefined ? (
                <div className="col-md-6">
                  <div className="col-md-10">
                    <h6>
                      {/* Preview of ' */}
                      {caseFilledDocForm.label}
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
                    style={{
                      color: "black",
                    }}
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

          {/* <h6>Tools</h6>*/}
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
