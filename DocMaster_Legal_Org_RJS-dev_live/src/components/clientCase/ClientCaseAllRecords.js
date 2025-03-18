import { useEffect, useState, Suspense, lazy } from "react";

import axios from "axios";
import ReactDOMServer from "react-dom/server";
import userStore from "../../zustand/userStore";
import {
  WsGetClientCaseFilledDocFormDraft,
  WsGetCaseEvents,
  WsGetCaseEventsNew,
  WsGetLegalResearchDocFormDraft,
  WsGetLegalResearchFinalDraft,
  WsGetClientCaseFilledDocFormsNew,
  WsGetClientCaseDocForms,
  WsGetClientCaseDocFormsNew,
  WsGetClientCaseFilledDocFormDraftNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const AllFeatureDataTable = lazy(() =>
  import("../../GuiComponents/AllFeatureDataTable.table")
);
const MergeClientCaseFilledDocForm = lazy(() =>
  import("./MergeClientCaseFilledDocFormV2")
);

const ClientCaseAllDocForms = (props) => {
  const userData = userStore((state) => state.user);
  const [filledDocForms, setFilledDocForms] = useState([]);
  const [dataError, setDataError] = useState();
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
    setDataError();
    axios
      .get(
        WsGetClientCaseFilledDocFormsNew +
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
        if (responseData.resultCode === 1) {
          // const data = responseData.resultMessage.filter((each) => {
          //   if (each.type === "drftng") {
          //     return each;
          //     // return each.draftData.isFilled == 1;
          //   } else {
          //     return each;
          //   }
          // });
          // setFilledDocForms(data);
          // getClientCaseOtherDocForms(data);
          setFilledDocForms(responseData.resultMessage);
          getClientCaseOtherDocForms(responseData.resultMessage);
          // setFilledDocForms(responseData.resultMessage);
        }
        setDataError(responseData.resultMessage);
        getClientCaseEvents();
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const getClientCaseOtherDocForms = async (data) => {
    await axios
      .get(
        // WsGetClientCaseDocForms +
        WsGetClientCaseDocFormsNew +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/" +
          "othr",
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          responseData.resultMessage = responseData.resultMessage.filter(
            (doc) => !data.some((item) => item.id === doc.id)
          );
          responseData.resultMessage.map((each) => (each.pending = 0));
          console.log(
            "responseData.resultMessage_149: ",
            responseData.resultMessage
          );
          // setFilledDocForms([...data, ...responseData.resultMessage]);
          setFilledDocForms((prev) => [...prev, ...responseData.resultMessage]);
        }
      })
      .catch((error) => {
        console.error("error", error);
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
      if (simpleData.type == "csrshfd") {
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
    setCaseEvents([]);
    axios
      .get(
        // WsGetCaseEvents +
        WsGetCaseEventsNew +
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
        if (responseData.resultCode === 1) {
          setCaseEvents(responseData.resultMessage);
        } else {
        }
        setDataError(responseData.resultMessage);
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const createFakeCaseEventDocFormDraft = (id, type) => {
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
      return {
        id: id,
        description: "Case Research Final Draft",
        formUid: "csrshfddf" + id,
        nameTitle: "Case Research Final Draft",
      };
    }
  };

  const processCaseFilledDocForms = (simpleDataArray) => {
    console.log("simpleDataArray: ", simpleDataArray);
    simpleDataArray.map((simpleData, index) => {
      simpleData["sno"] = index + 1;
      simpleData["typeTxt"] = "";
      if (simpleData.type == "othr") {
        simpleData["typeTxt"] = "Other";
      }
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
        simpleData["docform"] = createFakeCaseEventDocFormDraft(
          simpleData.id,
          "csrshfd"
        );
        simpleData["typeTxt"] = "Research Final Draft";
        simpleData["docFormTxt"] = "Case Research Final Draft";
      }

      simpleData["docFormTxt"] = simpleData?.docform?.nameTitle;

      // simpleData["actiontd"] = (
      //   <i
      //     className="fa fa-eye mx-2"
      //     title="View"
      //     style={{ color: "blue", cursor: "pointer" }}
      //     aria-hidden="true"
      //     onClick={() => viewFilledDocFormDraft(simpleData)}
      //   />
      // );
      simpleData["actiontd"] = (
        <>
          {simpleData.pending === 0 ? (
            <>Not Filled</>
          ) : (
            <i
              className="fa fa-eye mx-2"
              title="View"
              style={{ color: "blue", cursor: "pointer" }}
              aria-hidden="true"
              onClick={() => viewFilledDocFormDraft(simpleData)}
            />
          )}
        </>
      );
    });
    return simpleDataArray;
  };

  const viewFilledDocFormDraft = (simpleData) => {
    const tempFilledDocForm = { ...simpleData };
    console.log("tempFilledDocForm: ", tempFilledDocForm);
    delete tempFilledDocForm["actiontd"];
    if (tempFilledDocForm.type == "casevnt") {
      setCaseFilledDocForm(tempFilledDocForm);
      var tempHtml = createFakeCaseEventDocFormDraftHtml();
      if (tempHtml.length > 0) {
        setCaseFilledDocFormDraft({ htmlData: tempHtml });
      }
    } else if (tempFilledDocForm.type == "rsrchdf") {
      getLegalResearchDocFormFilledDraft(tempFilledDocForm);
    } else if (tempFilledDocForm.type == "csrshfd") {
      getLegalResearchFinalDraft(tempFilledDocForm);
    } else {
      getDocFormFilledDraft(tempFilledDocForm);
    }
  };

  const createFakeCaseEventDocFormDraftHtml = () => {
    let caseEventTableTrTh = [];
    caseEventTableTrTh.push(
      <tr>
        <th>S. No</th>
        <th>Event</th>
        <th>DateTime</th>
      </tr>
    );
    caseEvents.forEach((caseEventObj, index) => {
      caseEventTableTrTh.push(
        <tr>
          <td key={index + 1}>{index + 1}</td>
          <td>{caseEventObj.detail}</td>
          <td>{caseEventObj.dateTime}</td>
        </tr>
      );
    });
    return ReactDOMServer.renderToString(
      <table class="table">{caseEventTableTrTh}</table>
    );
  };

  const getLegalResearchDocFormFilledDraft = (filledDocForm) => {
    axios
      .get(
        WsGetLegalResearchDocFormDraft +
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
        if (responseData.resultCode === 1) {
          setCaseFilledDocForm(filledDocForm);
          setCaseFilledDocFormDraft(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const getLegalResearchFinalDraft = (filledDocForm) => {
    axios
      .get(
        WsGetLegalResearchFinalDraft +
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
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const getDocFormFilledDraft = (filledDocForm) => {
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
        if (responseData.resultCode === 1) {
          setCaseFilledDocForm(filledDocForm);
          setCaseFilledDocFormDraft(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="row">
        <div className="col-md-12">
          {showClientFilledDocFormMergeModal ? (
            <>
              <h6 style={{ textAlign: "right" }}>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => setShowClientFilledDocFormMergeModal(false)}
                >
                  <i className="fa fa-times" aria-hidden="true" /> Close
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
              <div
                className={
                  caseFilledDocFormDraft != undefined ? "col-md-6" : "col-md-12"
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
                    <h6>{caseFilledDocForm.label}</h6>
                  </div>
                  <div className="col-md-2 text-end">
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
                    key={`selectedDocFormDraftDataCcDiv` + caseFilledDocForm.id}
                    dangerouslySetInnerHTML={{
                      __html: caseFilledDocFormDraft.htmlData,
                    }}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Suspense>
  );
};

export default ClientCaseAllDocForms;
