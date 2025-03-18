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
  mergeMultipleSNO,
  WsPutClientCaseDocFormMapNew,
  WsGetClientCaseDocFormsNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { changeCreateNoteWindow } from "../stickyNotes/StickyNotesSlice";
import { fetchStickyNotesByCaseId } from "../stickyNotes/stickyNotesApi";

const DocFormCoreRun = lazy(() =>
  import("../../components/Core/DocFormCoreRun")
);

const ClientCaseDocForms = (props) => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const userData = userStore((state) => state.user);

  const [genLegalDocForms, setGenLegalDocForms] = useState();
  const [genLegalDocFormError, setGenLegalDocFormError] = useState();
  const [caseDocForms, setCaseDocForms] = useState([]);
  const [showGenLegalDocFormModal, setShowGenLegalDocFormModal] =
    useState(false);

  const [caseDocForm2Fill, setCaseDocForm2Fill] = useState();
  const [caseDocForm2View, setCaseDocForm2View] = useState();
  const [showCore, setShowCore] = useState(false);
  const [mergeCheckboxes, setMergeCheckBoxes] = useState(null);
  const [filesToMerge, setFilesToMerge] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState("");
  const [mergeLoader, setMergeLoader] = useState(false);
  const mergeFileTypes = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "xls",
    "xlsx",
    "doc",
    "docx",
  ];

  const [dataError, setDataError] = useState();

  let formsFieldsDataDefault = {
    buttonBackgroundColor: "#0000ff",
    formBorderColorOnFocus: "#0000ff",
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault
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

  useEffect(
    function () {
      if (props.getNotes) {
        getNotes("drafting");
      }
    },
    [props.getNotes]
  );

  const getNotes = (type) => {
    const loaderId = toast.success("Loading...", { autoClose: false });
    dispatch(
      fetchStickyNotesByCaseId({
        caseId: props.clientCase.id,
        type,
      })
    );
    if (loaderId) {
      toast.update(loaderId, {
        render: "Loaded!",
        autoClose: 0,
      });
    }
  };

  const getClientCaseDocForms = () => {
    setDataError();
    axios
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
          props.type,
        {
          headers: apiKeyHeader(),
        }
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
          simpleData.draftData.inputData
        );
      }
    });
    return simpleDataArray;
  };

  const getLegalGeneralDocForm = () => {
    setGenLegalDocFormError();
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
        }
      )
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          const publishedDocForms = await responseData.resultMessage.filter(
            (eachDoc) => {
              return props.type === "clntinfo"
                ? eachDoc.docform.isProblemInfo === 1
                : props.type === "othr"
                ? eachDoc
                : eachDoc.docform.isDraft === 1;
            }
          );
          setGenLegalDocForms(
            processGetLegalGeneralDocFormData(publishedDocForms)
          );
        } else {
          setGenLegalDocFormError(
            " Legal DocForms: " + responseData.resultMessage
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
      })
    );
    axios
      .post(
        // WsPutClientCaseDocFormMap,
        WsPutClientCaseDocFormMapNew,
        JSON.stringify({
          caseId: props.clientCase.id,
          docFormId: docForm.id,
          userId: userData.id,
          type: props.type,
        }),
        {
          headers: apiKeyHeader(),
        }
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
          "' from Case"
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
        }
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
    window.location.reload();
    // setCaseDocForms(
    //   caseDocForms.filter((caseDocForm) => {
    //     return caseDocForm.id !== caseDocFormVar.id;
    //   })
    // );
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
        }
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
    console.log("onReturnDraftRecord_caseDocFormDraft", caseDocFormDraft);
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

    if (
      props?.increaseChangeCount != null &&
      props?.increaseChangeCount != undefined
    ) {
      props.increaseChangeCount();
    }
  };

  const handleFileMerge = (e) => {
    e.preventDefault();
    if (mergeCheckboxes === null) {
      const element = document.getElementById("contentToPrint");
      const links = element.getElementsByTagName("a");
      const linksJson = Array.from(links).map((link) => {
        const parentP = link.closest("p");
        let customName = "";
        if (parentP) {
          const textContent = parentP.textContent;
          customName = textContent.split(":")[0].trim();
        }

        return {
          url: link.href,
          name: link.textContent,
          customname: customName || "",
          type: link.href.split(".").pop(),
        };
      });
      setMergeCheckBoxes(linksJson);
      // const results = [];
      // const childNodes = element.childNodes;
      // console.log("childNodes_369: ", childNodes);
      // childNodes.forEach((node) => {
      //   if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      //     const customname = node.textContent.trim().replace(/:$/, "");
      //     const nextSibling = node.nextSibling;
      //     if (nextSibling && nextSibling.nodeName === "A") {
      //       const url = nextSibling.href;
      //       const name = nextSibling.textContent;
      //       const type = nextSibling.href.split(".").pop();
      //       results.push({ customname, url, name, type });
      //     }
      //   }
      // });
      // console.log("results_384: ", results);
      // setMergeCheckBoxes(results);
    } else {
      setMergeCheckBoxes(null);
      setFilesToMerge([]);
      setMergedPdfUrl("");
    }
  };

  const handleCheckboxEX = (e, item) => {
    const { checked } = e.target;
    setFilesToMerge((prev) => {
      if (checked) {
        return [
          ...prev,
          {
            sno: prev.length + 1,
            filename: `${item.customname} (${item.name})`,
            url: item.url,
          },
        ];
      } else {
        const upadatedFiles = prev.filter((file) => file.url !== item.url);
        return upadatedFiles.map((file, index) => ({
          ...file,
          sno: index + 1,
        }));
      }
    });
  };

  const handleMergingAPI = async (e) => {
    e.preventDefault();

    const body = {
      filesToMerge: filesToMerge,
    };

    const loader = toast.success("Merging in progress...", {
      autoClose: false,
    });
    setMergeLoader(true);

    try {
      const response = await fetch(mergeMultipleSNO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      toast.dismiss(loader);
      setMergedPdfUrl(responseData.mergedUrl);
      setFilesToMerge([]);
    } catch (error) {
      await toast.dismiss(loader);
      toast.error("Error while merging.. Please try again later", {
        autoClose: 5000,
      });
      console.error("Error during API call:", error);
    } finally {
      setMergeLoader(false);
    }
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      
      {caseDocForm2Fill != undefined ? (
        <div className="row">
          <div className="col-md-12 d-flex justify-content-between">
            <button className="btn btn-sm btn-outline-primary"  onClick={() => {
                setCaseDocForm2Fill();
                setShowCore(false);
              }}> Fill/Edit{' '}{caseDocForm2Fill.docform.nameTitle}{" "}
              <i className="fa fa-times"
                title="Close"
                style={{ fontSize: "16px" }}
                aria-hidden="true"
              
              />
            </button>
            {(props.type === "clntinfo" || props.type === "drftng") && (
                <button className="btn btn-sm btn-primary"
                  onClick={() => {
                    const type =
                      props.type === "clntinfo" ? "probleminfo" : "drafting";
                    dispatch(
                      changeCreateNoteWindow({
                        noteWindow: true,
                        clientCase: { ...props.clientCase, type },
                      })
                    );
                  }}
                >
                  <b>Create Note</b>
                </button>
            )}
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
                {caseDocForm2View?.draftData.title}
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
                          style={{ fontSize: "16px" }}
                          className="fa fa-print"
                          aria-hidden="true"
                        ></i>{" "}
                        Print
                      </button>
                    );
                  }}
                  content={() => componentRef.current}
                />

                {props.type === "othr" && (
                  <button
                    className={`no_print btn btn-outline-${
                      mergeCheckboxes === null ? "primary" : "danger"
                    } mb-3`}
                    // className="no_print btn btn-outline-primary mb-3"
                    onClick={handleFileMerge}
                  >
                    {mergeCheckboxes === null ? "Merge" : "Close Merge"}
                  </button>
                )}
              </div>
              <div className="col-3" style={{ textAlign: "start" }}>
                <button className="btn btn-outline-danger" onClick={() => {
                      setCaseDocForm2Fill();
                      setCaseDocForm2View();
                      setShowCore(false);
                      setMergeCheckBoxes(null);
                      setFilesToMerge([]);
                      setMergedPdfUrl("");
                    }}>
                  <i
                    className="fa fa-times"
                    title="Close"
                    style={{ fontSize: "16px" }}
                    aria-hidden="true"
                    
                  />
                </button>
              </div>

              {mergeCheckboxes === null && (
                <div
                  style={{
                    color: "black",
                  }}
                  id="contentToPrint"
                  ref={componentRef}
                  key={`ccDivDrftDtView` + props.clientCase.id}
                  dangerouslySetInnerHTML={{
                    __html: caseDocForm2View.draftData?.htmlData,
                  }}
                />
              )}
              <div className="d-flex justify-content gap-5 flex-wrap fs-6">
                {mergeCheckboxes !== null && mergedPdfUrl.length === 0 && (
                  <div className="mt-4">
                    {mergeCheckboxes.map((item, index) => (
                      <label
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          onChange={(e) => handleCheckboxEX(e, item, index + 1)}
                          disabled={
                            !mergeFileTypes.includes(item.type.toLowerCase())
                          }
                        />
                        <span>
                          {item.customname}: {item.name}
                        </span>
                        {!mergeFileTypes.includes(item.type.toLowerCase()) && (
                          <small className="text-danger ms-2">
                            (This file cannot be merged)
                          </small>
                        )}
                      </label>
                    ))}
                    <button
                      onClick={handleMergingAPI}
                      className="btn btn-outline-primary mt-3"
                      disabled={filesToMerge.length <= 1 || mergeLoader}
                    >
                      {mergeLoader ? "Merging in Progress" : "Merge"}
                    </button>
                  </div>
                )}
                {filesToMerge.length > 0 && (
                  <ul className="list-unstyled">
                    <strong>Sequence of files to merge</strong>
                    {filesToMerge.map((file) => (
                      <li key={file.sno} className="mt-2">
                        {file.sno} - {file.filename}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {mergedPdfUrl.length > 0 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setMergedPdfUrl("");
                    }}
                    className="no_print btn btn-outline-primary mb-3"
                    style={{ width: "300px", marginLeft: "10px" }}
                  >
                    Merge Again
                  </button>
                  <iframe
                    title="mergedPdf"
                    src={mergedPdfUrl}
                    width="100px"
                    height="420px"
                    style={{
                      marginBottom: "30px",
                      borderRadius: "20px",
                      marginLeft: "5px",
                    }}
                  ></iframe>
                </>
              )}
            </div>
          ) : (
            <>
              {/* <Modal
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
                  <h5>
                    Select docform for Client case{" "}
                    {props.type == "clntinfo"
                      ? "Info"
                      : "Limitation & Jurisdiction"}{" "}
                  </h5>
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
              </Modal> */}

              {showGenLegalDocFormModal ? (
                <div>
                  <button
                    className="btn btn-danger"
                    // style={{ position: "absolute", top: 5, right: 5 }}
                    onClick={() => {
                      setShowGenLegalDocFormModal(false);
                    }}
                  >
                    Close
                  </button>
                  <h6>
                    Select Document for Client case{" "}
                    {props.type == "clntinfo" ? "Info" : null}{" "}
                    {props.type == "landj" ? "Limitation & Jurisdiction" : null}{" "}
                    {props.type == "drftng" ? "Drafting" : null}
                    {props.type == "othr" ? "External Record(s)" : null}{" "}
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
              ) : (
                <>
                  <p style={{ paddingTop: "20px" }}>
                    {caseDocForms.length > 0 &&
                    props.type == "clntinfo" ? null : (
                      <button className="btn btn-sm btn-primary"  onClick={() => setShowGenLegalDocFormModal(true)}>
                        {/* Client Case {props.type == "clntinfo" ? "Info" : null}
                        {props.type == "landj"
                          ? "Limitation & Jurisdiction"
                          : null}
                        {props.type == "drftng" ? "Drafting" : null}
                        {props.type == "clientCaseOtherDF"
                          ? "Other DocForm(s)"
                          : null}{" "} */}
                        Add DocForm
                        <i
                          className="fa fa-plus "
                          title="Add"
                          style={{
                            fontSize: "16px",
                          }}
                          aria-hidden="true"
                        />
                      </button>
                    )}
                  </p>
                  {caseDocForms && caseDocForms.length > 0 ? (
                    <div className="table-responsive table-container"> 
                    <table className="table">
                      <thead>
                        <tr>
                          <th>S. No</th>
                          <th>DocForm</th>
                          {/* <th>Draft</th> */}
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
                                {/* <td>
                                  {caseDocForm?.draftData != null
                                    ? caseDocForm.draftData.title
                                    : "N/A"}
                                </td> */}
                                <td>
                                  <i
                                    className="fa fa-trash mx-2"
                                    title="Remove this"
                                    style={{ color: "red", cursor: "pointer" }}
                                    aria-hidden="true"
                                    onClick={() =>
                                      removeCaseDocform(caseDocForm)
                                    }
                                  />
                                  <i
                                    className="fa fa-pencil mx-2"
                                    title="Edit"
                                    style={{
                                      color: "#1c46f2",
                                      cursor: "pointer",
                                    }}
                                    aria-hidden="true"
                                    onClick={() =>
                                      setCaseDocForm2Fill(caseDocForm)
                                    }
                                  />

                                  {caseDocForm?.draftData != null ? (
                                    <i
                                      className="fa fa-eye mx-2"
                                      title="View"
                                      style={{
                                        color: "grey",
                                        cursor: "pointer",
                                      }}
                                      aria-hidden="true"
                                      onClick={() => {
                                        setCaseDocForm2View(caseDocForm);
                                        setMergeCheckBoxes(null);
                                      }}
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
        </>
      )}
    </Suspense>
  );
};

export default ClientCaseDocForms;
