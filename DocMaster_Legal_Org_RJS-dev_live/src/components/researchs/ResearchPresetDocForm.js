//ResearchPresetDocForm.js
import { useEffect, useState, useRef, Suspense, lazy } from "react";
import axios from "axios";
import ReactToPrint from "react-to-print";
import ReactSelect from "react-select";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Modal from "react-modal";

import userStore from "../../zustand/userStore";
import {
  WsGetResearchSubjectPresetDocform,
  WsGetLegalResearchSubjectPresetDocform,
  WsGetDocFormTemplateAndInputFields,
  WsGetOrgUserPreFillField,
  WsPutResearchSubjectPresetDocform,
  WsPutLegalResearchSubjectPresetDocform,
  WsRemoveResearchSubjectPresetDocform,
  WsRemoveLegalResearchSubjectPresetDocform,
  WsGetResearchDocFormsAssignedToUser,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";

const DocFormCoreRun = lazy(() =>
  import("../../components/Core/DocFormCoreRun")
);
const FillNewDocFormToMerge = lazy(() =>
  import("../../components/researchs/FillNewDocFormToMerge")
);
const AssignQuestion2User = lazy(() => import("./AssignQuestion2User"));

const ResearchPresetDocForm = (props) => {
  const componentRef = useRef();
  const userData = userStore((state) => state.user);
  const [researchPresetDocForms, setResearchPresetDocForms] = useState([]);

  const [docFormAssignModalIsOpen, setDocFormAssignModalIsOpen] =
    useState(false);

  const [researchSelectedPresetDocForm, setResearchSelectedPresetDocForm] =
    useState();
  const [showCore, setShowCore] = useState(false);

  let formsFieldsDataDefault = {
    buttonBackgroundColor: "#0000ff",
    formBorderColorOnFocus: "#0000ff",
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault
  );
  let [docFormTemplateData, setDocFormTemplateData] = useState("<p></p>");
  const [docFormPreFills, setDocFormPreFills] = useState([]);
  const [docFormDraftToMerge, setDocFormDraftToMerge] = useState([]);
  const [finalDraftToReturn, setFinalDraftToReturn] = useState();
  const [showResearchPresetDocFormModal, setShowResearchPresetDocFormModal] =
    useState(false);

  useEffect(() => {
    getResearchSubjectPresetDocform(0, null);
  }, []);

  const getResearchSubjectPresetDocform = (
    callType,
    researchPresetDocFormId
  ) => {
    //WsGetResearchSubjectPresetDocform
    axios
      .get(
        (props.isAssigned2user == true
          ? WsGetResearchDocFormsAssignedToUser
          : WsGetLegalResearchSubjectPresetDocform) +
          "/" +
          props.researchSubject?.id +
          "/" +
          props.user.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("responseData_PresetDocs", responseData);
        if (responseData.resultCode == 1) {
          if (props.toShow) {
            setResearchPresetDocForms(responseData.resultMessage);
          } else {
            setResearchPresetDocForms(
              processArrayItems(
                responseData.resultMessage,
                researchPresetDocFormId
              )
            );
          }
        } else {
          // alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const processArrayItems = (itemArray, researchPresetDocFormId) => {
    let tempResearchPresetDocForm = null;
    itemArray.map((item, index) => {
      //" DocForm:" +
      item["docForm"]["formId"] = item.docForm.id;
      item["docForm"]["category"] = item.docForm?.categoryCode;
      item["docForm"]["categoryTxt"] = item.docForm.category?.category;
      item["label"] =
        item.docForm.nameTitle +
        " " +
        (item.draftData != null ? " Draft:" + item.draftData.title : "");
      item["value"] = item.id;
      if (item.draftData != null && item.draftData.inputData.length > 5) {
        item["draftData"]["inputData"] = JSON.parse(item.draftData.inputData);
      }
      console.log("processitemData_", item);
      if (
        researchPresetDocFormId != null &&
        researchPresetDocFormId == item.id
      ) {
        tempResearchPresetDocForm = item;
      }
    });

    if (tempResearchPresetDocForm != null) {
      setResearchSelectedPresetDocForm(tempResearchPresetDocForm);
    }
    return itemArray;
  };

  const resetNewDocFormFill = () => {
    setResearchSelectedPresetDocForm();
    setFormsFieldsData(formsFieldsDataDefault);
    setDocFormTemplateData("<p></p>");
    setShowCore(false);
  };

  const resetNewDocFormFillPart = () => {
    setFormsFieldsData(formsFieldsDataDefault);
    setDocFormTemplateData("<p></p>");
    setShowCore(false);
  };

  useEffect(() => {
    if (
      researchSelectedPresetDocForm != undefined &&
      researchSelectedPresetDocForm?.id > 0
    ) {
      if (researchSelectedPresetDocForm.draftData != null) {
        //ToDo:Get/Show Template
      } else {
        resetNewDocFormFillPart();
        getDocFormFieldAndTemplate(researchSelectedPresetDocForm.docForm);
      }
    }
  }, [researchSelectedPresetDocForm]);

  const getDocFormFieldAndTemplate = (docForm) => {
    fetchDocFormTemplateAndInputFields(docForm);
  };

  const fetchDocFormTemplateAndInputFields = (docForm) => {
    // toast.success("Loading Please Wait...", { autoClose: 50 });

    //Wrong WS Call
    // let requestTemplateAndFormFields = axios.get(
    //   WSGetDocFormFieldsTemplate + "/" + props.user.id + "/" + docForm.id,
    //   {
    //     headers: apiKeyHeader(),
    //   },
    // );

    let requestTemplateAndFormFields = axios.post(
      WsGetDocFormTemplateAndInputFields,
      JSON.stringify({
        adminUserId: props.user.id,
        templateLanguage: 1,
        formId: docForm.id,
      }),
      {
        headers: apiKeyHeader(),
      }
    );

    //WsGetDocFormTemplateAndInputFields

    /*axios
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
      });*/

    let requestOrgUserPreFillField = axios.get(
      WsGetOrgUserPreFillField + "/" + props.user.org.id + "/" + props.user.id,
      {
        headers: apiKeyHeader(),
      }
    );

    let webServiceCalls = [
      requestTemplateAndFormFields,
      requestOrgUserPreFillField,
    ];

    axios
      .all(webServiceCalls)
      .then(
        axios.spread((...responses) => {
          console.log("FormFieldTemplate_responses", responses);
          let showCoreCount = 0;
          if (responses[0] != undefined && responses[0] != null) {
            const responseTemplateAndFormFields = responses[0].data;

            console.log(
              "FormFieldTemplate_responseTemplateAndFormFields",
              responseTemplateAndFormFields
            );

            if (responseTemplateAndFormFields.result_code == 1) {
              // console.log(
              //   "FormFieldTemplate_responseTemplateAndFormFields.result_message?.fields",
              //   responseTemplateAndFormFields.result_message?.fields,
              // );
              // console.log(
              //   "FormFieldTemplate_responseTemplateAndFormFields.result_message?.template",
              //   responseTemplateAndFormFields.result_message?.template,
              // );
              // setFormsFieldsData(
              //   responseTemplateAndFormFields.result_message?.fields,
              // );
              // setDocFormTemplateData(
              //   responseTemplateAndFormFields.result_message?.template,
              // );

              //setFormsFieldsData(responseData.forms_fields);
              // setDocFormTemplateData(responseData.forms_templates);

              console.log(
                "FormFieldTemplate_responseTemplateAndFormFields.result_message?.fields",
                responseTemplateAndFormFields.forms_fields
              );

              console.log(
                "FormFieldTemplate_responseTemplateAndFormFields.result_message?.template",
                responseTemplateAndFormFields.forms_templates
              );

              setFormsFieldsData(responseTemplateAndFormFields.forms_fields);

              setDocFormTemplateData(
                responseTemplateAndFormFields.forms_templates
              );

              showCoreCount = showCoreCount + 1;
            } else {
              alert("No Template & Input Data found", { autoClose: 50 });
            }
          }

          //PreFill
          if (responses[1] != undefined && responses[1] != null) {
            const responseOrgUserPreFillData = responses[1].data;

            console.log(
              "responseOrgUserPreFillData_",
              responseOrgUserPreFillData
            );

            if (responseOrgUserPreFillData.resultCode == 1) {
              setDocFormPreFills(responseOrgUserPreFillData.resultMessage);
              // console.log(
              //   "responseOrgPreFillFieldData_responseDraftData",
              //   "setDocFormPreFills(responseOrgPreFillFieldData.resultMessage)"
              // );
            }
          }

          if (showCoreCount > 0) {
            setShowCore(true);
          }
        })
      )
      .catch((error) => {
        console.error("FormFieldTemplate_error", error);
      });
  };

  const onReturnDraftRecord = (draftRecord) => {
    console.log("onReturnDraftRecord_draftRecord", draftRecord);
    // if (props.onReturn != undefined) {
    addToResearchPresetDocformDraft(
      researchSelectedPresetDocForm,
      draftRecord,
      props.researchSubject.id,
      null
    );
    // }
    resetNewDocFormFill();
  };

  const addToResearchPresetDocformDraft = (
    researchPresetDocForm,
    docFormDraft,
    researchSubjectId,
    docForm
  ) => {
    console.log(
      "onReturnDraftRecord_addToResearchPresetDocformDraft",
      JSON.stringify({
        id: researchPresetDocForm != null ? researchPresetDocForm.id : null,
        subjectId: researchSubjectId,
        docformId:
          researchPresetDocForm != null
            ? researchPresetDocForm.docForm.id
            : docForm.id,
        draftDataId: docFormDraft != null ? docFormDraft.id : null,
        userId: props.user.id,
      })
    );
    //Old: WsPutResearchSubjectPresetDocform
    axios
      .post(
        WsPutLegalResearchSubjectPresetDocform,
        JSON.stringify({
          id: researchPresetDocForm != null ? researchPresetDocForm.id : null,
          subjectId: researchSubjectId,
          docformId:
            researchPresetDocForm != null
              ? researchPresetDocForm.docForm.id
              : docForm.id,
          draftDataId: docFormDraft != null ? docFormDraft.id : null,
          userId: props.user.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (props.toMerge == 1) {
            // add2ResearchPresetDocFormsAndSetDefault(researchPresetDocForm,docFormDraft);
            if (researchPresetDocForm != null) {
              getResearchSubjectPresetDocform(1, researchPresetDocForm.id);
            } else {
              getResearchSubjectPresetDocform(0, null);
            }
          } else {
            props.onContentReturn("");
          }
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const removeResearchSubjectPresetDocform = (researchPresetDocForm) => {
    console.log(
      "removeResearchSubjectPresetDocform_researchPresetDocForm",
      researchPresetDocForm
    );
    if (
      window.confirm(
        "Sure to remove DocForm '" +
          researchPresetDocForm.docForm.nameTitle +
          "' from Research"
      ) == true
    ) {
      processRemoveResearchSubjectPresetDocform(researchPresetDocForm);
    }
  };
  const processRemoveResearchSubjectPresetDocform = (researchPresetDocForm) => {
    //Old:WsRemoveResearchSubjectPresetDocform
    axios
      .post(
        WsRemoveLegalResearchSubjectPresetDocform,
        JSON.stringify({
          id: researchPresetDocForm.id,
          userId: props.user.id,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          if (props.toMerge == 1) {
            getResearchSubjectPresetDocform(0, null);
          } else {
            props.onContentReturn("");
          }
        } else {
          alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const add2ResearchPresetDocFormsAndSetDefault = (
    researchPresetDocForm,
    docFormDraft
  ) => {
    /*setResearchPresetDocForms(
          processArrayItems(responseData.resultMessage)
        );*/
    // setResearchSelectedPresetDocForm(selectedOption);

    //remove From ResearchPresetDocForms using researchPresetDocForm.id
    const dataNotRemoved = researchPresetDocForms.filter((el) => {
      return el.key !== researchPresetDocForm.id;
    });

    //setting draftData for Selected array item of
    researchPresetDocForm["draftData"] = docFormDraft;

    dataNotRemoved.push(researchPresetDocForm);
    setResearchPresetDocForms(processArrayItems(dataNotRemoved));
    setResearchSelectedPresetDocForm(researchPresetDocForm);
  };

  const addSelectedIntoDraftArrays = (keyId, template) => {
    console.log("addSelectedIntoDraftArrays", keyId, template);
    if (props.toMerge == 1) {
      if (checkDataExistInDraftArray(keyId, docFormDraftToMerge) == false) {
        let temp = [...docFormDraftToMerge]; //[...docFormDraftToMerge];
        console.log("addSelectedIntoDraftArrays_temp_before", temp);
        temp.push({ key: keyId, template: template });
        // checkDataExistInDraftArray(keyId,docFormDraftToMerge);
        console.log("addSelectedIntoDraftArrays_temp_after", temp);
        setDocFormDraftToMerge(temp);
        // setSelectOrgDocFormUserDraft();
        // setOrgDocFormUserDraftData();
      } else {
        alert("Already Added for Merge");
      }
    } else {
      // let temp = [];
      // console.log("addSelectedIntoDraftArrays_temp_before", temp);
      // temp.push({ key: keyId, template: template });
      // // checkDataExistInDraftArray(keyId,docFormDraftToMerge);
      // console.log("addSelectedIntoDraftArrays_temp_after", temp);
      // setDocFormDraftToMerge(temp);
      // setSelectOrgDocFormUserDraft();
      // setOrgDocFormUserDraftData();
      // addToResearchDocformdraftWatchlist(keyId,props.researchSubject.id)
    }
  };

  const checkDataExistInDraftArray = (keyId, draftArray) => {
    return draftArray.some((draft) => {
      return draft.key == keyId;
    });
  };

  const removeSelectedIntoDraftArrays = (keyId, index) => {
    // console.log("removeSelectedIntoDraftArrays", keyIdId);
    // // delete docFormDraftToMerge[keyIdId];
    // delete docFormDraftToMerge[""+keyIdId];
    // // let temp={...docFormDraftToMerge};
    // // console.log("removeSelectedIntoDraftArrays_temp_before", temp);
    // setDocFormDraftToMerge([ ...docFormDraftToMerge ]);
    var setValue = docFormDraftToMerge;
    const dataRemoved = setValue.filter((el) => {
      return el.key !== keyId;
    });
    setDocFormDraftToMerge(dataRemoved);
  };

  useEffect(() => {
    if (docFormDraftToMerge != undefined) {
      console.log("useEffect_docFormDraftToMerge", docFormDraftToMerge);
      // getOrgDocFormFilled(selectOrgDocFormUserDraft.id);
      concatAllIntoOneDraft();
    }
  }, [docFormDraftToMerge]);

  const concatAllIntoOneDraft = () => {
    // finalDraftContent;
    let finalDraftContentTemp = props.finalDraftContent;
    console.log(
      "concatAllIntoOneDraft_finalDraftContentTemp",
      finalDraftContentTemp
    );
    // Object.entries(docFormDraftToMerge).map(([key, val]) => {
    //     finalDraftContentTemp=finalDraftContentTemp+"<br/>"+val;
    //   })
    // return finalDraftContentTemp;
    docFormDraftToMerge.map((item) => {
      // finalDraftContentTemp = finalDraftContentTemp + "<br/>" + item.template;
      if (finalDraftContentTemp.length <= 1) {
        finalDraftContentTemp = item.template;
      } else {
        finalDraftContentTemp =
          finalDraftContentTemp +
          "<p style='page-break-before: always'></p>" +
          item.template;
        //<br/>
      }
    });
    setFinalDraftToReturn(finalDraftContentTemp);
  };

  const processReturnedDocForm = (docForm) => {
    console.log("processReturnedDocForm_docForm", docForm);
    console.log(
      "processReturnedDocForm_researchPresetDocForms",
      researchPresetDocForms
    );
    if (
      checkDataExistInResearchDocFormsArray(
        docForm.id,
        researchPresetDocForms
      ) == false
    ) {
      // researchDocForms.push(docForm);
      // setResearchDocForms([...researchPresetDocForms,docForm]);
      setShowResearchPresetDocFormModal(false);
      addToResearchPresetDocformDraft(
        null,
        null,
        props.researchSubject.id,
        docForm
      );
    } else {
      alert("Already Exist in Array");
    }
  };

  const checkDataExistInResearchDocFormsArray = (docFormId, docFormArray) => {
    return docFormArray.some((docFormObj) => {
      return docFormObj.docForm.id == docFormId;
    });
  };

  // const assignUser2DocFormFromResearch = (researchPresetDocForm) => {};

  const onSuccesAssigned2User = (flag) => {
    if (flag) {
      // window.location.reload();
      getResearchSubjectPresetDocform(0, null);
      setDocFormAssignModalIsOpen(false);
    }
  };

  return (
    <>
      {/* {researchPresetDocForms.length ? ( */}
      <>
        <hr />
        {/* <h6>
          Supporting Doc(s)&nbsp;
          {props.isAssigned2user == false ? (
            <i
              style={{ fontSize: 20, cursor: "pointer" }}
              className="fa fa-plus"
              aria-hidden="true"
              title="Add"
              onClick={() => setShowResearchPresetDocFormModal(true)}
            ></i>
          ) : null}
        </h6> */}
        <Modal
          transparent={false}
          ariaHideApp={false}
          isOpen={showResearchPresetDocFormModal}
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
              setShowResearchPresetDocFormModal(false);
            }}
          >
            Close
          </button>
          <br />
          <div>
            <FillNewDocFormToMerge
              user={props.user}
              onReturn={processReturnedDocForm}
              type={1}
            />
          </div>
        </Modal>
      </>
      {/* ) : null} */}
      {props.toShow ? (
        <>
          List of Doc(s)
          <br />
          <br />
          {researchPresetDocForms.length > 0 ? (
            <>
              {researchPresetDocForms.map((researchDocForm, index) => {
                return (
                  <p>
                    {index + 1}. {researchDocForm.docForm.nameTitle}
                  </p>
                );
              })}
            </>
          ) : null}
        </>
      ) : (
        <>
          {researchPresetDocForms.length > 0 &&
            researchPresetDocForms.map((researchPresetDocForm) => {
              return (
                <button
                  onClick={() => {
                    setResearchSelectedPresetDocForm(researchPresetDocForm);
                    setShowCore(false);
                  }}
                  className={
                    researchSelectedPresetDocForm?.id ===
                    researchPresetDocForm.id
                      ? "btn tabButton btn-warning"
                      : "btn tabButton btn-light"
                  }
                >
                  {/* {researchSelectedPresetDocForm?.id==researchPresetDocForm.id?<b>{researchPresetDocForm.label}</b>:<>{researchPresetDocForm.label}</>} */}
                  {researchPresetDocForm.draftData != null ? (
                    <b style={{ color: "green" }}>
                      {researchPresetDocForm.label}
                    </b>
                  ) : (
                    <span style={{ color: "red" }}>
                      {researchPresetDocForm.label}
                    </span>
                  )}
                </button>
              );
            })}
          {props?.isModal == false &&
          researchPresetDocForms.length > 0 &&
          researchSelectedPresetDocForm != undefined ? (
            <button
              onClick={() => {
                setResearchSelectedPresetDocForm();
                setShowCore(false);
              }}
              className="btn tabButton btn-danger"
            >
              Minimise
            </button>
          ) : null}
          <hr style={{ marginTop: 0 }} />
          {researchSelectedPresetDocForm != undefined ? (
            <div className="row">
              <div className="col-md-12">
                {researchSelectedPresetDocForm.assignTo == null ? (
                  <>
                    <Modal
                      transparent={false}
                      ariaHideApp={false}
                      isOpen={docFormAssignModalIsOpen}
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
                     <div className="w-100 text-end mb-3">
                      <button
                          className="btn btn-danger"
                          onClick={() => {
                            setDocFormAssignModalIsOpen(false);
                            // setQuestionForUserAssign();
                          }}
                        >
                          Close
                        </button>
                     </div>
                      <AssignQuestion2User
                        subject={props.researchSubject}
                        docForm={researchSelectedPresetDocForm}
                        user={props.user}
                        onSuccesReturn={onSuccesAssigned2User}
                        type={2}
                      />
                      
                    </Modal>

                    <button
                      type="button"
                      className="btn btn-light"
                      title="Assign User"
                      onClick={() => setDocFormAssignModalIsOpen(true)}
                    >
                      <i
                        className="fa fa-plus"
                        aria-hidden="true"
                        style={{ color: "green" }}
                      />
                      <i
                        className="fa fa-user"
                        aria-hidden="true"
                        style={{ color: "green" }}
                      />{" "}
                      Assign docform to a user
                    </button>
                  </>
                ) : (
                  <i>
                    *Assigned to {researchSelectedPresetDocForm.assignTo.name}
                    &nbsp;
                  </i>
                )}

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  title="Remove"
                  onClick={() =>
                    // removeDocFormFromResearch(researchSelectedPresetDocForm)
                    removeResearchSubjectPresetDocform(
                      researchSelectedPresetDocForm
                    )
                  }
                >

                  <i
                    className="fa fa-times"
                    aria-hidden="true"
                    
                  ></i>{" "}
                  Remove docform from Research
                </button>
              </div>

              {/* <div className="col-md-6">
                  <b>{researchSelectedPresetDocForm.docForm.nameTitle}</b>
                </div>
                <div className="col-md-6">
                  <button
                    onClick={() => {
                      resetNewDocFormFill();
                    }}
                    className="btn btn-outline-info"
                  >
                    Select another DocForm
                  </button>
                </div> */}
              <div className="col-md-12">
                {researchSelectedPresetDocForm.draftData != null ? (
                  <>
                    {showCore ? (
                      <>
                        <DocFormCoreRun
                          docForm={researchSelectedPresetDocForm.docForm}
                          formsTemplate={docFormTemplateData}
                          formsFieldsData={formsFieldsDataThis}
                          userPrefilledFields={[]}
                          inputFieldsChangeCount={0}
                          filledDocForm={undefined}
                          userData={props.user}
                          draft={researchSelectedPresetDocForm.draftData}
                          submittedBy={props.user}
                          oldFilledData={null}
                          docFormPreFills={docFormPreFills}
                          toMerge={true}
                          onReturnDraftRecord={onReturnDraftRecord}
                          isClientDocForm={true}
                          clientFormType={"rsrch"}
                        />
                        <hr />
                      </>
                    ) : (
                      <>
                        {/* <ReactToPrint
                    documentTitle="DocMaster_TestRun_Print"
                    pageStyle={
                      "@media print { body { -webkit-print-color-adjust: exact; } @page { size: " +
                      "A4; margin: " +
                      Number(1) * 0.3937 +
                      "in " +
                      Number(1) * 0.3937 +
                      "in " +
                      Number(1) * 0.3937 +
                      "in " +
                      Number(1) * 0.3937 +
                      "in!important }}"
                    }
                    trigger={() => {
                      // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
                      // to the root node of the returned component as it will be overwritten.
                      return (
                        <button className="no_print btn btn-outline-primary mb-3">
                          <i
                            style={{ fontSize: 20 }}
                            className="fa fa-print"
                            aria-hidden="true"
                          ></i>{" "}
                          Print
                        </button>
                      );
                    }}
                    content={() => componentRef.current}
                  /> */}
                        <i
                          style={{ color: "blue", cursor: "pointer" }}
                          className="fa fa-edit"
                          aria-hidden="true"
                          onClick={() =>
                            fetchDocFormTemplateAndInputFields(
                              researchSelectedPresetDocForm.docForm
                            )
                          }
                        >
                          Edit
                        </i>
                        <br />

                        <div
                          id="contentToPrint"
                          ref={componentRef}
                          key={`ccDiv` + props.researchSubject.id}
                          dangerouslySetInnerHTML={{
                            __html:
                              researchSelectedPresetDocForm.draftData.htmlData,
                          }}
                        />
                        <hr />
                        {props.toMerge == 1 ? (
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => {
                              addSelectedIntoDraftArrays(
                                researchSelectedPresetDocForm.draftData?.id,
                                researchSelectedPresetDocForm.draftData.htmlData
                              );
                              resetNewDocFormFill();
                            }}
                          >
                            Add This to merge
                          </button>
                        ) : null}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {showCore ? (
                      <>
                        <DocFormCoreRun
                          docForm={researchSelectedPresetDocForm.docForm}
                          formsTemplate={docFormTemplateData}
                          formsFieldsData={formsFieldsDataThis}
                          userPrefilledFields={[]}
                          inputFieldsChangeCount={0}
                          filledDocForm={undefined}
                          userData={props.user}
                          draft={{}}
                          submittedBy={props.user}
                          oldFilledData={null}
                          docFormPreFills={docFormPreFills}
                          toMerge={true}
                          onReturnDraftRecord={onReturnDraftRecord}
                          isClientDocForm={true}
                          clientFormType={"rsrch"}
                        />
                        <hr />
                      </>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* <ReactSelect
                options={researchPresetDocForms}
                onChange={(selectedOption) => {
                  console.log("handleUsersReactSelectChanges", selectedOption);
                  setResearchSelectedPresetDocForm(selectedOption);
                  //   if(props.type==0){
                  //     setResearchSelectedPresetDocForm(selectedOption);
                  //   }else{
                  //     props.onReturn(selectedOption);
                  //   }
                }}
                // ref={docFormRef}
                isMulti={false}
                //   defaultValue={{}}
              /> */}
              {/* {researchPresetDocForms.length>0 && researchPresetDocForms.map((researchPresetDocForm)=>{
                return <button onClick={()=>{setResearchSelectedPresetDocForm(researchPresetDocForm)}} className="btn tabButton">{researchPresetDocForm.label}</button>
              })} */}
            </>
          )}
          {props.toMerge == 1 ? (
            <div className="col-md-12">
              <hr />
              {docFormDraftToMerge != undefined ? (
                <div className="row">
                  <div className="col-md-6">
                    {docFormDraftToMerge.length > 0 &&
                      docFormDraftToMerge.map((item, index) => {
                        // console.log("item", item);
                        return (
                          <>
                            <div
                              id={"orgDocFormUserDraftDataHtmlData" + item.key}
                              key={
                                `orgDocFormUserDraftDataHtmlData` +
                                "selectOrgDocFormUserDraft?.id" +
                                item.key
                              }
                              dangerouslySetInnerHTML={{
                                __html: item.template,
                              }}
                              style={{
                                maxHeight: "250px",
                                overflowY: "scroll",
                              }}
                            />
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                removeSelectedIntoDraftArrays(item.key, index)
                              }
                            >
                              {props.toMerge == 1
                                ? "Remove This"
                                : "Remove from View"}
                            </button>
                          </>
                        );
                      })}
                  </div>
                  <div className="col-md-6">
                    {props.toMerge == 1 ? (
                      <>
                        <i>*Preview</i>
                        {finalDraftToReturn != undefined ? (
                          <div
                            id={"finalDraftToReturnkey"}
                            key={`finalDraftToReturn`}
                            dangerouslySetInnerHTML={{
                              __html: finalDraftToReturn,
                            }}
                          />
                        ) : null}
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            props.onContentReturn(finalDraftToReturn);
                          }}
                        >
                          Submit
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default ResearchPresetDocForm;
