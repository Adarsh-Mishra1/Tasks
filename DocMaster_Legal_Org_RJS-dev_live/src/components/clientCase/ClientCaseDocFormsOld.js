//ClientCaseDocForms.js
import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ReactSelect from "react-select";
import Modal from "react-modal";

import ReactToPrint from "react-to-print";
import axios from "axios";

import userStore from "../../zustand/userStore";
import {
  WsGetClientCaseDocForms,
  WsPutClientCaseDocFormMap,
  WsGetLegalGeneralDocForm,
  WsRemoveClientCaseDocFormMap,
  WsGetDocFormTemplateAndInputFields,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const DocFormCoreRun = lazy(() => import("../Core/DocFormCoreRun"));

const ClientCaseDocForms = (props) => {
  const componentRef = useRef();
  const userData = userStore((state) => state.user);

  const [genLegalDocForms, setGenLegalDocForms] = useState();
  const [genLegalDocFormError, setGenLegalDocFormError] = useState();
  const [caseDocForms, setCaseDocForms] = useState([]);
  const [showGenLegalDocFormModal, setShowGenLegalDocFormModal] =
    useState(false);

  const [caseDocForm2Fill, setCaseDocForm2Fill] = useState();
  const [caseDocForm2View, setCaseDocForm2View] = useState();
  const [showCore, setShowCore] = useState(false);

  const [dataError, setDataError] = useState();

  let formsFieldsDataDefault = {
    buttonBackgroundColor: "#0000ff",
    formBorderColorOnFocus: "#0000ff",
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault,
  );
  let [docFormTemplateData, setDocFormTemplateData] = useState("<p></p>");

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getClientCaseDocForms();
      getLegalGeneralDocForm();
    } else {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    if (caseDocForms.length <= 0 && props.hideOtherTabs != undefined) {
      props.hideOtherTabs(true);
    } else {
      if (props.hideOtherTabs != undefined) {
        props.hideOtherTabs(false);
      }
    }
  }, [caseDocForms]);

  const getClientCaseDocForms = () => {
    setDataError();
    axios
      .get(
        WsGetClientCaseDocForms +
          "/" +
          props.clientCase.id +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/" +
          props.type,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setCaseDocForms(processCaseDocForms(responseData.resultMessage));
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
  const processCaseDocForms = (simpleDataArray) => {
    // let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      if (
        simpleData.draftData != null &&
        simpleData.draftData?.inputData?.length > 5
      ) {
        simpleData["draftData"]["inputData"] = JSON.parse(
          simpleData.draftData.inputData,
        );
      }
    });
    return simpleDataArray;
  };

  const getLegalGeneralDocForm = () => {
    setGenLegalDocFormError();
    //setGenLegalDocForms
    axios
      .get(
        WsGetLegalGeneralDocForm +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/" +
          props.type,
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setGenLegalDocForms(
            processGetLegalGeneralDocFormData(responseData.resultMessage),
          );
        } else {
          // alert(" Legal DocForms: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
          setGenLegalDocFormError(
            " Legal DocForms: " + responseData.resultMessage,
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processGetLegalGeneralDocFormData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      // let tempVar=simpleData.user;
      simpleData = simpleData.docform;
      //   tempVar["label"]=simpleData.name;
      //   tempVar["value"]=simpleData.id;
      simpleData["label"] = simpleData.nameTitle;
      simpleData["value"] = simpleData.id;
      //   console.error("_simpleData", simpleData);
      //   simpleData=tempVar
      //   console.error("_simpleData_tempVar", tempVar);
      tempArrayVar.push(simpleData);
    });
    // //console.log("_simpleDataArray", simpleDataArray);
    // //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  const addSelectedGenLegalDocFormToCase = (docForm) => {
    console.log(
      "addSelectedGenLegalDocFormToCase_params",
      JSON.stringify({
        caseId: props.clientCase.id,
        docFormId: docForm.id,
        userId: userData.id,
        type: props.type,
      }),
    );
    axios
      .post(
        WsPutClientCaseDocFormMap,
        JSON.stringify({
          caseId: props.clientCase.id,
          docFormId: docForm.id,
          userId: userData.id,
          type: props.type,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode >= 1) {
          setCaseDocForms([]);
          getClientCaseDocForms();
        } else {
          alert(" " + responseData.resultMessage);
        }
        setShowGenLegalDocFormModal(false);
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const removeCaseDocform = (caseDocForm) => {
    console.error("caseDocForm", caseDocForm);
    if (
      window.confirm(
        "Sure to remove DocForm '" +
          caseDocForm.docform.nameTitle +
          "' from Case",
      ) == true
    ) {
      proceedRemoveCaseDocform(caseDocForm);
    }
  };

  const proceedRemoveCaseDocform = (caseDocForm) => {
    axios
      .post(
        WsRemoveClientCaseDocFormMap,
        JSON.stringify({
          id: caseDocForm.id,
          userId: userData.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          //   setCaseDocForms([]);
          //   getClientCaseDocForms();
          removeFromResearchDocFormsArray(caseDocForm);
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const removeFromResearchDocFormsArray = (caseDocFormVar) => {
    setCaseDocForms(
      caseDocForms.filter((caseDocForm) => {
        return caseDocForm.id !== caseDocFormVar.id;
      }),
    );
  };

  useEffect(() => {
    if (caseDocForm2Fill != undefined) {
      getDocFormTemplateAndInputFields(caseDocForm2Fill?.docform);
    }
  }, [caseDocForm2Fill]);

  const getDocFormTemplateAndInputFields = (docForm) => {
    //console.log("docmasterRawWebService " + WSDocFormsReadAll);
    //   console.log("fetchUploadedDataAsPerCategory_formParams " + JSON.stringify({
    //     adminUserId: userData.id,
    //     templateLanguage: 1,
    //     formId: docForm.id,
    //   }));

    axios
      .post(
        WsGetDocFormTemplateAndInputFields,
        JSON.stringify({
          adminUserId: userData.id,
          templateLanguage: 1,
          formId: docForm.id,
        }),
        {
          headers: apiKeyHeader(),
        },
      )
      .then((response) => {
        // console.log("template_n_input_response", response.data);
        const responseData = response.data;
        if (responseData.result_code === 1) {
          //setFormsFieldsData,setDocFormTemplateData
          // console.log("template_n_input", responseData.result_message);
          setFormsFieldsData(responseData.forms_fields);
          setDocFormTemplateData(responseData.forms_templates);
          setShowCore(true);
        } else {
          alert("DocForm Template: " + responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onReturnDraftRecord = (caseDocFormDraft) => {
    // console.log("onReturnDraftRecord_caseDocFormDraft", caseDocFormDraft);
    /*    
    setSelectedGenLegalDocForms([...selectedGenLegalDocForms, docForm]);
    */
    let remainingCaseDocForms = caseDocForms.filter((caseDocForm) => {
      return caseDocForm.id !== caseDocForm2Fill.id;
    });
    let caseDocForm2FillTemp = caseDocForm2Fill;
    caseDocForm2FillTemp["draftData"] = caseDocFormDraft;
    setCaseDocForms([...remainingCaseDocForms, caseDocForm2FillTemp]);
    setCaseDocForm2Fill();
    setShowCore(false);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      {caseDocForm2Fill != undefined ? (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-between my-2">
            <h5>Fill/Edit{' '}{caseDocForm2Fill.docform.nameTitle}{' '}</h5>
              <button className="btn btn-sm btn-outline-danger" onClick={() => {
                setCaseDocForm2Fill();
                setShowCore(false);
              }}><i
                className="fa fa-times"
                title="Close"
                 
                aria-hidden="true"
                
              />
            </button>
          </div>

          <div className="col-12">
            {showCore ? (
              <>
                <DocFormCoreRun
                  docForm={caseDocForm2Fill.docform}
                  formsTemplate={docFormTemplateData}
                  formsFieldsData={formsFieldsDataThis}
                  userPrefilledFields={[]}
                  inputFieldsChangeCount={0}
                  filledDocForm={undefined}
                  userData={userData}
                  draft={caseDocForm2Fill.draftData}
                  submittedBy={userData}
                  oldFilledData={null}
                  //   docFormPreFills={docFormPreFills}
                  docFormPreFills={null}
                  toMerge={true}
                  onReturnDraftRecord={onReturnDraftRecord}
                  // onReturnDraftRecord={null}
                  isClientDocForm={true}
                  clientCase={props.clientCase}
                  clientFormType={props.type}
                  // clientFormType={"clntinfo"}
                />
                <hr />
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <>
          {caseDocForm2View != undefined ? (
            <div className="row">
              <div className="col-6" style={{ textAlign: "start" }}>
                {caseDocForm2View.draftData.title}
              </div>
              <div className="col-3" style={{ textAlign: "start" }}>
                <button
                  className="no_print btn btn-outline-primary mb-3"
                  onClick={() => {
                    setCaseDocForm2Fill(caseDocForm2View);
                    setCaseDocForm2View();
                  }}
                >
                  <i
                    // style={{ color: "blue", cursor: "pointer" }}
                    className="fa fa-edit"
                    aria-hidden="true"
                  >
                    {" "}
                    Edit
                  </i>
                </button>

                <ReactToPrint
                  documentTitle="LeOrgDocMaster_Print"
                  pageStyle={
                    "@media print { body { -webkit-print-color-adjust: exact; } @page { size: " +
                    formsFieldsDataThis.pageType +
                    "; margin: " +
                    Number(formsFieldsDataThis.printMarginTop) * 0.3937 +
                    "in " +
                    Number(formsFieldsDataThis.printMarginRight) * 0.3937 +
                    "in " +
                    Number(formsFieldsDataThis.printMarginBottom) * 0.3937 +
                    "in " +
                    Number(formsFieldsDataThis.printMarginLeft) * 0.3937 +
                    "in!important }}"
                  }
                  trigger={() => {
                    // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                    // to the root node of the returned component as it will be overwritten.
                    return (
                      <button className="no_print btn btn-outline-primary mb-3">
                        <i
                          // style={{ fontSize: 20 }}
                          className="fa fa-print"
                          aria-hidden="true"
                        ></i>{" "}
                        Print
                      </button>
                    );
                  }}
                  content={() => componentRef.current}
                />
              </div>
              <div className="col-3" style={{ textAlign: "end" }}>
                <button className="btn btn-outline-danger">
                <i
                  className="fa fa-times-circle mx-2"
                  title="Close"
                   
                  aria-hidden="true"
                  onClick={() => {
                    setCaseDocForm2Fill();
                    setCaseDocForm2View();
                    setShowCore(false);
                  }}
                />
                </button>
              </div>

              <div
                id="contentToPrint"
                ref={componentRef}
                key={`ccDivDrftDtView` + props.clientCase.id}
                dangerouslySetInnerHTML={{
                  __html: caseDocForm2View.draftData?.htmlData,
                }}
              />
            </div>
          ) : (
            <>
              <h4>
                {caseDocForms.length > 0 && props.type == "clntinfo" ? null : (
                  <>
                    Client Case {props.type == "clntinfo" ? "Info" : null}
                    {props.type == "landj" ? "Limitation & Jurisdiction" : null}
                    {props.type == "drftng" ? "Drafting" : null}
                    {props.type == "clientCaseOtherDF"
                      ? "External Record(s)"
                      : null}{" "}
                    DocForms{" "}
                    <i
                      className="fa fa-plus mx-2"
                      title="Add"
                      style={{ color: "grey", cursor: "pointer" }}
                      aria-hidden="true"
                      onClick={() => setShowGenLegalDocFormModal(true)}
                    />
                  </>
                )}
              </h4>
              <Modal
                transparent={false}
                ariaHideApp={false}
                isOpen={showGenLegalDocFormModal}
                style={{
                  overlay: {
                    width: "100vw",
                    top: "0%",
                    zIndex: 9999,
                  },
                  content: {
                    left: "4%",
                    width: "90vw",
                  },
                }}
              >
                <button
                  className="btn btn-danger"
                  style={{ position: "absolute", top: 5, right: 5 }}
                  onClick={() => {
                    setShowGenLegalDocFormModal(false);
                  }}
                >
                  Close
                </button>
                <br />
                <div>
                  <h6>
                    Select Document for Client case{" "}
                    {props.type == "clntinfo"
                      ? "Info"
                      : "Limitation & Jurisdiction"}{" "}
                  </h6>
                  <ReactSelect
                    options={genLegalDocForms}
                    onChange={(selectedOption) => {
                      //   console.log("handleUsersReactSelectChanges", selectedOption);
                      addSelectedGenLegalDocFormToCase(selectedOption);
                    }}
                    // ref={docFormRef}
                    isMulti={false}
                    //   defaultValue={{}}
                  />
                  {genLegalDocFormError != undefined ? (
                    <i>{genLegalDocFormError}</i>
                  ) : null}
                </div>
              </Modal>
              {caseDocForms && caseDocForms.length > 0 ? (
                <div className="table-responsive table-container"> 
                <table className="table">
                  <thead>
                    <tr>
                      <th>S. No</th>
                      <th>DocForm</th>
                      <th>Draft</th>
                      <th>Action(s)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseDocForms != undefined &&
                      caseDocForms.map((caseDocForm, index) => {
                        return (
                          <tr key={caseDocForm.id + "caseDocForms"}>
                            <td>{index + 1}</td>
                            <td>{caseDocForm.docform.nameTitle}</td>
                            <td>
                              {caseDocForm?.draftData != null
                                ? caseDocForm.draftData.title
                                : "N/A"}
                            </td>
                            <td>
                              <i
                                className="fa fa-trash mx-2"
                                title="Remove this"
                                style={{ color: "red", cursor: "pointer" }}
                                aria-hidden="true"
                                onClick={() => removeCaseDocform(caseDocForm)}
                              />
                              <i
                                className="fa fa-pencil mx-2"
                                title="Edit"
                                style={{ color: "#1c46f2", cursor: "pointer" }}
                                aria-hidden="true"
                                onClick={() => setCaseDocForm2Fill(caseDocForm)}
                              />

                              {caseDocForm?.draftData != null ? (
                                <i
                                  className="fa fa-eye mx-2"
                                  title="View"
                                  style={{ color: "grey", cursor: "pointer" }}
                                  aria-hidden="true"
                                  onClick={() =>
                                    setCaseDocForm2View(caseDocForm)
                                  }
                                />
                              ) : null}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
                </div>
              ) : (
                <>{dataError != undefined ? <i>{dataError}</i> : null}</>
              )}
            </>
          )}
        </>
      )}
    </Suspense>
  );
};

export default ClientCaseDocForms;
