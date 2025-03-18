import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import ReactToPrint from "react-to-print";
import axios from "axios";

import { toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";

import userStore from "../../zustand/userStore";

import {
  WsPutClientCaseDocFormMap,
  WsGetDocFormTemplateAndInputFields,
  WsPutClientDocFormDraftData,
  WsGetOrgClients,
  WsGetOrgClientCases,
  WsPutCaseDiary,
  WsGetOrgClientCasesNew1,
  WsGetOrgClientsNew,
  WsPutClientCaseDocFormMapNew,
  WsPutCaseDiaryNew,
  WsPutClientDocFormDraftDataNew,
} from "../../configs/WebService";
import {
  apiKeyHeader,
  apiKeyHeaderMultiPartFormData,
} from "../../configs/ApiKeys";
import { Button } from "reactstrap";
import {
  addDaysToDate,
  convertToDateFormatCD,
  processPageBreakandContent,
} from "../../OtherFunctions/OtherFunctions";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));

const DocFormCoreRun = lazy(() =>
  import("../../components/Core/DocFormCoreRun")
);
const CreateClient = lazy(() => import("../../components/client/Create"));
const CreateClientCase = lazy(() =>
  import("../../components/clientCase/Create")
);

const ClientCaseInfoDocFormFill = () => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);

  console.log("userData_", userData);
  const location = useLocation();
  const clientInfoLegalDocForm = location.state.clientInfoLegalDocForm;

  console.log("clientInfoLegalDocForm_51", clientInfoLegalDocForm);

  const [docFormFillData, setDocFormFillData] = useState();
  const [client, setClient] = useState();
  const [clientCase, setClientCase] = useState();
  const [existingClients, setExistingClients] = useState([]);
  const [existingClientCases, setExistingClientCases] = useState([]);
  const [oldNewClient, setOldNewClient] = useState("new-client");
  const [oldNewClientCase, setOldNewClientCase] = useState("new-client-case");
  const [selectedClientCase, setSelectedClientCase] = useState();

  let formsFieldsDataDefault = {
    buttonBackgroundColor: "#0000ff",
    formBorderColorOnFocus: "#0000ff",
    formFields: {},
  };
  let [formsFieldsDataThis, setFormsFieldsData] = useState(
    formsFieldsDataDefault
  );
  let [docFormTemplateData, setDocFormTemplateData] = useState("<p></p>");
  const [showCore, setShowCore] = useState(false);

  const [showClientDiv, setShowClientDiv] = useState(false);
  const [showClientCaseDiv, setShowClientCaseDiv] = useState(false);

  const clientOptions = existingClients.map((client) => ({
    value: client.user.id,
    label: client.user.name,
  }));

  const clientCaseOptions = existingClientCases?.map((clientCase) => ({
    value: clientCase.id,
    label: clientCase.title,
  }));

  const componentRef = useRef();
  const componentAIRef = useRef();
  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      if (clientInfoLegalDocForm != undefined) {
        getDocFormTemplateAndInputFields(clientInfoLegalDocForm);
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  const getExistingClients = async () => {
    await axios
      .get(
        // WsGetOrgClients
        WsGetOrgClientsNew + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          // setExistingClients(responseData.resultMessage);
          const fileterdData = responseData.resultMessage.filter(
            (each) => each.isMobileVerify === 1
          );
          const newdata = fileterdData.map((each) => ({
            ...each,
            user: { ...each.user, id: each.id },
          }));
          setExistingClients(newdata);
        } else {
          // alert(responseData.result_message);
          if (responseData.result_message) alert(responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
    return 1;
  };

  const handleBack = () => {
    navigate("/Casepreparations");
  };

  const getExistingClientCases = async (clientId) => {
    await axios
      .get(
        // WsGetOrgClientCases +
        WsGetOrgClientCasesNew1 +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/" +
          clientId,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          setExistingClientCases(responseData.resultMessage);
        } else {
          if (responseData.resultMessage === "No data found") {
            alert(
              "There are no existing cases for this client. Please proceed with creating a new client case."
            );
          } else {
            alert(responseData.resultMessage);
          }
        }
      })
      .catch((error) => {
        console.error("error", error);
      });

    return 1;
  };

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
      .then(async (response) => {
        console.log("template_n_input_response", response.data);
        const responseData = response.data;
        if (responseData.result_code === 1) {
          //setFormsFieldsData,setDocFormTemplateData
          // console.log("template_n_input", responseData.result_message);
          setFormsFieldsData(responseData.forms_fields);
          setDocFormTemplateData(responseData.forms_templates);
          setShowCore(true);
          await getExistingClients();
        } else {
          alert("DocForm Template: " + responseData.result_message);
        }
      })
      .catch((error) => {
        console.error("error", error);
      });
  };

  const onReturnDraftRecord = (docFormFilledData) => {
    if (docFormFilledData != null && docFormFilledData != undefined) {
      setDocFormFillData(docFormFilledData);
    }
  };

  const resetDraftRecord = () => {
    setDocFormFillData();
  };

  useEffect(() => {
    if (docFormFillData != undefined) {
      //Show CreateUserForm && show docFormFillData.template
      setShowClientDiv(true);
    }
  }, [docFormFillData]);

  const onClientCreateReturn = async (returnData) => {
    if (returnData != null || returnData != undefined) {
      setClient(returnData);
    }

    if (oldNewClient === "old-client") {
      await getExistingClientCases(returnData.id);
    }
  };

  useEffect(() => {
    if (docFormFillData != undefined && client != undefined) {
      setShowClientCaseDiv(true);
    }
  }, [client]);

  const onClientCaseCreateReturn = (returnData) => {
    if (returnData != null || returnData != undefined) {
      setClientCase(returnData);
    }
  };

  useEffect(() => {
    if (
      docFormFillData != undefined &&
      client != undefined &&
      clientCase != undefined
    ) {
      //   console.log("useEffect_clientCase_docFormFillData", docFormFillData);
      //   console.log("useEffect_clientCase_client", client);
      //   console.log("useEffect_clientCase_clientCase", clientCase);
      //   alert("Submit Data");
      addSelectedGenLegalDocFormToCase(
        clientCase,
        clientInfoLegalDocForm,
        "clntinfo",
        docFormFillData
      );
    }
  }, [clientCase]);
  // useEffect(() => {
  //   if (docFormFillData) {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch(
  //           `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
  //           { headers: apiKeyHeader() }
  //         );
  //         const data = await response.json();
  //         const problemData = data.resultMessage?.[0] ?? {}; // Safely access first element
  
  //         console.log(
  //           "sri",
  //           problemData.case_probleminfo_total,
  //           problemData.problem_Info
  //         );
  
  //         if (
  //           !problemData.case_probleminfo_total || // Covers null, undefined, or 0
  //           problemData.case_probleminfo_total < problemData.problem_Info
  //         ) {
  //           setShowClientDiv(true);
  //         } else {
  //           alert("Your researches are completed. Extend your plan.");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching data:", error);
  //       }
  //     };
  
  //     fetchData();
  //   }
  // }, [docFormFillData]); 
  

  const addSelectedGenLegalDocFormToCase = (
    clientCase,
    docForm,
    type,
    docFormFillData
  ) => {
    console.log(
      "addSelectedGenLegalDocFormToCase_params",
      JSON.stringify({
        caseId: clientCase.id,
        docFormId: docForm.id,
        userId: userData.id,
        type: type,
      })
    );
    axios
      .post(
        // WsPutClientCaseDocFormMap,
        WsPutClientCaseDocFormMapNew,
        JSON.stringify({
          caseId: clientCase.id,
          docFormId: docForm.id,
          userId: userData.id,
          type: type,
        }),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode >= 1) {
          //   setCaseDocForms([]);
          //   getClientCaseDocForms();
          putCaseFilledData(docFormFillData, clientCase, docForm, type);
        } else {
          alert(" " + responseData.resultMessage);
        }
        // setShowGenLegalDocFormModal(false);
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const putCaseFilledData = (
    docFormFilledData,
    clientCase,
    docForm,
    clientFormType
  ) => {
    toast.success("Submitting...", { autoClose: 100 });

    let formData2Post = new FormData();

    formData2Post.append("htmlString", docFormFilledData.htmlData);
    formData2Post.append(
      "inputData",
      JSON.stringify(docFormFilledData.inputData)
    );
    formData2Post.append("title", docFormFilledData.title); //DevNote[Remarks] ToBeDone:Added On: 13-08-2022
    formData2Post.append("recordId", 0);
    formData2Post.append("caseId", clientCase.id);

    formData2Post.append("userId", userData.id);
    formData2Post.append("docFormId", docForm.id);
    formData2Post.append("sType", clientFormType);
    formData2Post.append("isFilled", 1);

    axios
      .post(WsPutClientDocFormDraftDataNew, formData2Post, {
        headers: apiKeyHeaderMultiPartFormData(),
      })
      .then((response) => {
        const responseData = response.data;
        if (responseData.resultCode === 1) {
          console.log("responseData_334: ", responseData);
          putCaseDiary(clientCase);
        } else {
          window.alert(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("PutOrgDocFormUserData_error", error);
      });
  };

  const putCaseDiary = (caseDetails) => {
    let nextHearingDate;
    let statement = "This is a test statement for the case dairy.";

    if (
      docFormFillData.notice === "Yes" &&
      docFormFillData.mediation === "Yes"
    ) {
      nextHearingDate = docFormFillData.caseHearingDate;
      statement = `Notice and Mediation are both Yes. Next hearing date is ${nextHearingDate}`;
    } else if (
      docFormFillData.notice === "Yes" &&
      docFormFillData.mediation === "No"
    ) {
      nextHearingDate = addDaysToDate(docFormFillData.caseHearingDate, 5);
      statement = `Notice is Yes, but Mediation is No. Next hearing date is ${nextHearingDate}`;
      console.log(statement);
    } else if (docFormFillData.notice === "No") {
      nextHearingDate = addDaysToDate(docFormFillData.caseHearingDate, 30);
      statement = `Notice is No. Next hearing date is ${nextHearingDate}`;
      console.log(statement);
    }

    const {
      // hearingdate,
      // purposecurhearing,
      // outcome,
      attende,
      nextdate,
      purposenexhearing,
    } = docFormFillData.caseHearingDiary;
    // if (outcome && outcome.length > 0 && outcome !== "" && outcome !== null) {
    if (attende && attende.length > 0 && attende !== "" && attende !== null) {
      const nextHearingdate = convertToDateFormatCD(nextdate);
      // const hearingDate = convertToDateFormatCD(hearingdate);
      const body = {
        id: null,
        heading: "",
        particulars: purposenexhearing || "",
        previousdate: "",
        dateTime: "",
        attende: attende || "",
        nextdate: nextHearingdate,
        caseId: caseDetails.id,
        userId: userData.id,
        interimOrder: "",
      };
      // const body = {
      //   id: null,
      //   heading: outcome,
      //   particulars: purposenexhearing,
      //   previousdate: "",
      //   dateTime: hearingDate + " 00:00:00",
      //   attende: attende,
      //   nextdate: nextHearingdate,
      //   caseId: caseDetails.id,
      //   userId: userData.id,
      //   interimOrder: purposecurhearing,
      // };
      axios
        .post(WsPutCaseDiaryNew, JSON.stringify(body), {
          headers: apiKeyHeader(),
        })
        .then((response) => {
          const responseData = response.data;
          if (responseData.resultCode === 1) {
            goToClientCase(caseDetails);
          } else {
            alert("Contact Team.");
          }
        })
        .catch((error) => {
          console.error("putcase_diary_error: ", error);
        });
    } else {
      goToClientCase(caseDetails);
    }
  };
  // const putCaseDiary = (caseDetails) => {
  //   const {
  //     // hearingdate,
  //     // purposecurhearing,
  //     // outcome,
  //     attende,
  //     nextdate,
  //     purposenexhearing,
  //   } = docFormFillData.caseHearingDiary;
  //   // if (outcome && outcome.length > 0 && outcome !== "" && outcome !== null) {
  //   if (attende && attende.length > 0 && attende !== "" && attende !== null) {
  //     const nextHearingdate = convertToDateFormatCD(nextdate);
  //     // const hearingDate = convertToDateFormatCD(hearingdate);
  //     const body = {
  //       id: null,
  //       heading: "",
  //       particulars: purposenexhearing || "",
  //       previousdate: "",
  //       dateTime: "",
  //       attende: attende || "",
  //       nextdate: nextHearingdate,
  //       caseId: caseDetails.id,
  //       userId: userData.id,
  //       interimOrder: "",
  //     };
  //     // const body = {
  //     //   id: null,
  //     //   heading: outcome,
  //     //   particulars: purposenexhearing,
  //     //   previousdate: "",
  //     //   dateTime: hearingDate + " 00:00:00",
  //     //   attende: attende,
  //     //   nextdate: nextHearingdate,
  //     //   caseId: caseDetails.id,
  //     //   userId: userData.id,
  //     //   interimOrder: purposecurhearing,
  //     // };
  //     axios
  //       .post(WsPutCaseDiaryNew, JSON.stringify(body), {
  //         headers: apiKeyHeader(),
  //       })
  //       .then((response) => {
  //         const responseData = response.data;
  //         if (responseData.resultCode === 1) {
  //           goToClientCase(caseDetails);
  //         } else {
  //           alert("Contact Team.");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("putcase_diary_error: ", error);
  //       });
  //   } else {
  //     goToClientCase(caseDetails);
  //   }
  // };

  const goToClientCase = (cCase) => {
    navigate("/clientCaseShow", {
      state: {
        clientCase: cCase,
      },
    });
  };

  const handleClientChange = async (e) => {
    const selectedClient = await existingClients.find(
      (client) => client.user.id === e.value
    );
    onClientCreateReturn(selectedClient.user);
  };

  const handleClientCaseChange = async (e) => {
    const selectedClientCase = await existingClientCases.find(
      (clientCase) => clientCase.id === e.value
    );
    setSelectedClientCase(selectedClientCase);
  };

  const handleSubmitClientCase = async (e) => {
    e.preventDefault();
    onClientCaseCreateReturn(selectedClientCase);
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <Sidebar />
        <Navbar />

        {/* <!-- page content --> */}
        {/* {DevNote: Show Page Content Here} */}
        <div className="right_col ps-3" role="main">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="mb-4 p-0 border-0 bg-transparent"
          ></Button> */}
          <div
            className="tab-content"
            style={{ paddingLeft: "0", paddingRight: "0", border: "0" }}
          >
            <div className=" ">
              <div className="title_left">
                {location.state.isJudgement === 0 && (
                  <h6 className="mt-2 mb-0">
                    <span
                      onClick={() => {
                        navigate(-1);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Go Back ⬅️
                    </span>
                  </h6>
                )}
                {location.state.isJudgement === 1 && (
                  <h6 className="mt-2 mb-0">
                    <span
                      onClick={() => {
                        navigate(-1);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      Go Back ⬅️
                    </span>
                  </h6>
                )}
                {location.state.isJudgement === 0 && (
                  <h6>
                    <>
                      Fill/Edit Client related problems for '
                      {clientInfoLegalDocForm.nameTitle}'
                    </>
                  </h6>
                )}
                {/* <ArrowLeft className="mr-2 h-4 w-4 text-black" /> */}
              </div>
            </div>

            <div className="clearfix"></div>

            <div
              className={`row ${
                location?.state?.isJudgement === 1
                  ? "judgment-doc-form-pane"
                  : ""
              }`}
            >
              {/* <div className="row judgment-doc-form-pane"> */}
              <div className="col-md-12 col-sm-12  ">
                <div className="x_panel">
                  <div className="x_content">
                    <div className="row">
                      <div className="col-6">
                        {/* //ClientDetailDiv */}
                        {showClientDiv ? (
                          <>
                            {client != undefined ? (
                              <>
                                <h4>
                                  Client : {client?.name} ({client?.mobileNo})
                                </h4>
                                <br />
                                {oldNewClient === "old-client" && (
                                  <>
                                    Select Client Case:
                                    <label
                                      style={{
                                        marginRight: "20px",
                                        marginLeft: "50px",
                                      }}
                                    >
                                      <input
                                        type="radio"
                                        name="option"
                                        value="option1"
                                        defaultChecked
                                        onChange={() =>
                                          setOldNewClientCase("new-client-case")
                                        }
                                      />
                                      &nbsp; New Client Case
                                    </label>
                                    <label>
                                      <input
                                        type="radio"
                                        name="option"
                                        value="option2"
                                        onChange={() =>
                                          setOldNewClientCase("old-client-case")
                                        }
                                        disabled={
                                          existingClientCases?.length === 0
                                        }
                                      />
                                      &nbsp; Old Client Case
                                    </label>
                                    {oldNewClientCase === "old-client-case" && (
                                      <div
                                        style={{
                                          marginTop: "10px",
                                          marginBottom: "20px",
                                        }}
                                      >
                                        <Select
                                          // value={selectedOption}
                                          onChange={handleClientCaseChange}
                                          options={[
                                            {
                                              value: "",
                                              label: "Select client Case",
                                            },
                                            ...clientCaseOptions,
                                          ]}
                                          placeholder="Select Client Case"
                                          isSearchable
                                        />

                                        <Button
                                          type="submit"
                                          className="btn btn-sm btn-info"
                                          style={{ marginTop: "20px" }}
                                          disabled={!selectedClientCase}
                                          onClick={handleSubmitClientCase}
                                        >
                                          Save & Continue
                                        </Button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                {/* Create Client */}
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  Create Client
                                  <label
                                    style={{
                                      marginRight: "20px",
                                      marginLeft: "50px",
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      name="option"
                                      value="option1"
                                      defaultChecked
                                      onChange={() =>
                                        setOldNewClient("new-client")
                                      }
                                    />
                                    &nbsp; New Client
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      name="option"
                                      value="option2"
                                      onChange={() =>
                                        setOldNewClient("old-client")
                                      }
                                    />
                                    &nbsp; Old Client
                                  </label>
                                </div>
                                <br />
                                {oldNewClient === "new-client" ? (
                                  <CreateClient
                                    onReturn={onClientCreateReturn}
                                  />
                                ) : (
                                  existingClients.length > 0 && (
                                    <div>
                                      <Select
                                        // value={selectedOption}
                                        onChange={handleClientChange}
                                        options={clientOptions}
                                        placeholder="Select Client"
                                        isSearchable
                                      />
                                    </div>
                                  )
                                )}
                                <hr />
                              </>
                            )}
                          </>
                        ) : null}
                      </div>
                      {(oldNewClientCase === "new-client-case" ||
                        clientCase != undefined) && (
                        <div className="col-6">
                          {/* //ClientCaseDetailDiv */}
                          {showClientCaseDiv ? (
                            <>
                              {clientCase != undefined ? (
                                <>Show Case Detail</>
                              ) : (
                                oldNewClientCase === "new-client-case" && (
                                  <div>
                                    Create Client Case
                                    <CreateClientCase
                                      client={client}
                                      onReturn={onClientCaseCreateReturn}
                                    />
                                  </div>
                                )
                              )}
                              <hr />
                            </>
                          ) : null}
                        </div>
                      )}
                      <div className="col-12">
                        {docFormFillData != undefined ? (
                          <>
                            <ReactToPrint
                              documentTitle="LeOrgDocMaster_Print"
                              pageStyle={`
                                @media print {
                                  @page {
                                    size: A4;
                                    margin: 0 50px 0 50px !important; 
                                    padding:50px 0!important;
                                  }
                                  body {
                                    -webkit-print-color-adjust: exact;
                                    margin: 0;
                                    padding: 0;
                                   
                                  }
                                }
                              `}
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
                            {docFormFillData.aiResponse.length > 0 && (
                              <ReactToPrint
                                documentTitle="LeOrgDocMaster_Print"
                                pageStyle={`
                                  @media print {
                                    @page {
                                      size: A4;
                                      margin: 0 50px 0 50px !important; 
                                      padding:50px 0!important;
                                    }
                                    body {
                                      -webkit-print-color-adjust: exact;
                                      margin: 0;
                                      padding: 0;
                                     
                                    }
                                  }
                                `}
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
                                      Print AI Response
                                    </button>
                                  );
                                }}
                                content={() => componentAIRef.current}
                              />
                            )}
                            <div
                              className="col-3"
                              style={{ textAlign: "start" }}
                            >
                              {/* <i
                  className="fa fa-times-circle mx-2"
                  title="Close"
                  style={{ color: "red", cursor: "pointer" }}
                  aria-hidden="true"
                  onClick={() => {
                    setCaseDocForm2Fill();
                    setCaseDocForm2View();
                    setShowCore(false);
                  }}
                /> */}
                            </div>

                            {docFormFillData.aiResponse.length > 0 ? (
                              <div className="row">
                                <div className="col-md-6 pb-border-right">
                                  <div
                                    id="contentToPrint"
                                    style={{
                                      fontFamily:
                                        "'Times New Roman', Times, serif",
                                    }}
                                    className="contentToPrintTableProps"
                                    ref={componentRef}
                                    key={`ccDivDrftDtView` + "docFormFillData"}
                                    dangerouslySetInnerHTML={{
                                      __html: processPageBreakandContent(
                                        docFormFillData?.htmlData
                                      ),
                                    }}
                                  />
                                </div>
                                <div className="col-md-6">
                                  <>
                                    <div className="text-center mb-3">
                                      <u
                                        style={{
                                          fontWeight: 600,
                                          color: "black",
                                          fontSize: "12pt",
                                        }}
                                      >
                                        AI Generated Response
                                      </u>
                                    </div>
                                    <div
                                      id="AiResponseEl"
                                      style={{
                                        fontFamily:
                                          "'Times New Roman', Times, serif",
                                      }}
                                      ref={componentAIRef}
                                      className="contentToPrintTableProps"
                                      dangerouslySetInnerHTML={{
                                        __html: docFormFillData.aiResponse,
                                      }}
                                    />
                                  </>
                                </div>
                              </div>
                            ) : (
                              <div
                                id="contentToPrint"
                                style={{
                                  fontFamily: "'Times New Roman', Times, serif",
                                }}
                                className="contentToPrintTableProps"
                                ref={componentRef}
                                key={`ccDivDrftDtView` + "docFormFillData"}
                                dangerouslySetInnerHTML={{
                                  __html: processPageBreakandContent(
                                    docFormFillData?.htmlData
                                  ),
                                }}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            {showCore ? (
                              <>
                                <DocFormCoreRun
                                  docForm={clientInfoLegalDocForm}
                                  formsTemplate={docFormTemplateData}
                                  formsFieldsData={formsFieldsDataThis}
                                  userPrefilledFields={[]}
                                  inputFieldsChangeCount={0}
                                  filledDocForm={undefined}
                                  userData={userData}
                                  draft={null}
                                  submittedBy={userData}
                                  oldFilledData={null}
                                  docFormPreFills={null}
                                  toMerge={true}
                                  onReturnDraftRecord={onReturnDraftRecord}
                                  isClientDocForm={true}
                                  clientFormType={
                                    location?.state?.isJudgement === 1
                                      ? "judgement"
                                      : "clntInfoInit"
                                  }
                                />{" "}
                                <hr />
                              </>
                            ) : null}
                          </>
                        )}
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
      </div>
    </Suspense>
  );
};

export default ClientCaseInfoDocFormFill;
