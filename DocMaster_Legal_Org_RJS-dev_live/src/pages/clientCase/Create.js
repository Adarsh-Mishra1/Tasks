import { useEffect, useState, Suspense, lazy, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";

import ReactSelect from "react-select";
import Modal from "react-modal";
import axios from "axios";

import {
  WsGetCaseTypes,
  WsGetOrgClients,
  WsPutClientCase,
  WsGetLegalGeneralDocForm,
  WsGetOrgClientsNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";
const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Footer = lazy(() => import("../../components/Footer"));
const CreateClientCase = lazy(() =>
  import("../../components/clientCase/Create")
);

const ClientCreate = ({ setCurTab }) => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);

  console.log("userData_", userData);
  const location = useLocation();
  console.log("_location_", location);
  const client = location?.state?.client;

  const [genLegalDocForms, setGenLegalDocForms] = useState();

  const [selectedGenLegalDocForms, setSelectedGenLegalDocForms] = useState([]);
  const [showGenLegalDocFormModal, setShowGenLegalDocFormModal] =
    useState(false);

  const [caseTypes, setCaseTypes] = useState();
  const [orgClients, setOrgClients] = useState();
  const [selectedClient, setSelectedClient] = useState(
    client != undefined ? client : undefined
  );
  const [selectedCaseType, setSelectedCaseType] = useState();

  const titleRef = useRef();
  const detailsRef = useRef();
  const eMailRef = useRef();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (
      userData != null &&
      userData != undefined &&
      userData.isLoggedIn != undefined &&
      userData.isLoggedIn
    ) {
      getCaseType(null);
      getLegalGeneralDocForm();
      if (client == undefined) {
        // get Org Client List
        getOrgClients();
      }
    } else {
      window.location.href = "/";
    }
  }, []);

  const getCaseType = (parentTypeId) => {
    // if (parentTypeId != null) {
    //   setResearchSubTypes();
    // }
    axios
      .get(
        WsGetCaseTypes +
          "/" +
          userData.id +
          (parentTypeId != null ? "/" + parentTypeId : ""),
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          //   if (parentTypeId != null) {
          //     setResearchSubTypes(responseData.resultMessage);
          //   } else {
          //     setResearchTypes(responseData.resultMessage);
          //   }
          setCaseTypes(responseData.resultMessage);
        } else {
          alert("CaseType: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const getLegalGeneralDocForm = () => {
    //setGenLegalDocForms
    axios
      .get(
        WsGetLegalGeneralDocForm +
          "/" +
          userData.org.id +
          "/" +
          userData.id +
          "/clntinfo",
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          setGenLegalDocForms(
            processGetLegalGeneralDocFormData(responseData.resultMessage)
          );
        } else {
          alert(" Clients: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
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
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  const getOrgClients = () => {
    axios
      .get(
        // WsGetOrgClients +
        WsGetOrgClientsNew + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData_168", responseData);
        if (responseData.resultCode === 1) {
          const fileterdData = responseData.resultMessage.filter(
            (each) => each.isMobileVerify === 1
          );
          const newdata = fileterdData.map((each) => ({
            ...each,
            user: { ...each.user, id: each.id },
          }));

          console.log("fileterdData_178: ", fileterdData);
          console.log("newdata_179: ", newdata);

          setOrgClients(processOrgClientsMappedData(newdata));
        } else {
          alert(" Clients: " + responseData.resultMessage);
          // setErrorMsg(responseData.resultMessage);
        }
      })
      .catch((error) => {
        console.error("error", error);
        // setErrorMsg("Error while processing");
      });
  };

  const processOrgClientsMappedData = (simpleDataArray) => {
    let tempArrayVar = [];
    simpleDataArray.map((simpleData, index) => {
      // let tempVar=simpleData.user;
      simpleData = simpleData.user;
      //   tempVar["label"]=simpleData.name;
      //   tempVar["value"]=simpleData.id;

      simpleData["label"] = simpleData.name;
      simpleData["value"] = simpleData.id;
      //   console.error("_simpleData", simpleData);
      //   simpleData=tempVar
      //   console.error("_simpleData_tempVar", tempVar);
      tempArrayVar.push(simpleData);
    });
    //console.log("_simpleDataArray", simpleDataArray);
    //console.log("_simpleDataArray_tempArrayVar", tempArrayVar);
    // return simpleDataArray;
    return tempArrayVar;
  };

  const onSubmitHandler = (e) => {
    if (e != null) {
      e.preventDefault();
    }
    if (selectedClient == undefined) {
      alert("Select a Client");
    } else if (titleRef.current.value.length < 5) {
      alert("Enter case Title");
    } else if (detailsRef.current.value.length < 10) {
      alert("Enter case Details");
    } else {
      proceed2PutClientCase(e != null ? true : false);
    }
  };

  const proceed2PutClientCase = async (toContinue) => {
    const docformsIdStringArray = concatAllIntoDocFormIdsArray();

    const requestData = {
      orgId: userData.org.id,
      userId: userData.id,
      clientId: selectedClient.id,
      title: titleRef.current.value,
      details: detailsRef.current.value,
      caseType:
        selectedCaseType !== undefined ? Number(selectedCaseType) : null,
      docformsIds:
        docformsIdStringArray.length > 0 ? docformsIdStringArray : null,
    };

    // Logging the request data for debugging
    console.log("OrgUserLogIn_Params", JSON.stringify(requestData));

    try {
      const response = await fetch(
        `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
        { headers: apiKeyHeader() }
      );
      const data = await response.json();

      if (!data.resultMessage) {
        alert("Invalid API response. Please try again.");
        return;
      }

      const { max_cases, case_cases_total } = data.resultMessage[0] ?? {}; // Access first element safely

      console.log("Max allowed cases:", max_cases);
      console.log("Current cases:", case_cases_total);

      // if (typeof max_cases !== "number" || typeof case_cases_total !== "number") {
      //     alert("Invalid response values. Please contact support.");
      //     return;
      // }

      // Check if the number of cases is within the limit
      // if (max_cases !== 0  && case_cases_total <= max_cases) {
      //     alert("You have reached the maximum case limit. Extend your plan.");
      //     return;
      // }

      console.log(
        "Proceeding with case creation:",
        max_cases,
        case_cases_total
      );

      // Proceed with the case creation after the check
      axios
        .post(WsPutClientCase, JSON.stringify(requestData), {
          headers: apiKeyHeader(),
        })
        .then((response) => {
          const responseData = response.data;
          console.log("_responseData", responseData);

          if (responseData.resultCode >= 1) {
            toContinue
              ? goToClientCase(responseData.resultMessage)
              : goToClientCases(responseData.client);
          } else {
            alert(responseData.resultMessage);
            setErrorMsg(responseData.resultMessage);
          }
        })
        .catch((error) => {
          console.error(
            "Error while processing:",
            error?.response?.data || error.message
          );
          setErrorMsg("Error while processing");
        });
    } catch (error) {
      console.error("Error fetching case statistics:", error);
      alert("Failed to fetch case statistics. Please try again.");
    }
  };

  const goToClientCase = (cCase) => {
    cCase["client"] = selectedClient;
    navigate("/clientCaseShow", {
      state: {
        clientCase: cCase,
      },
    });
  };

  const goToClientCases = () => {
    navigate("/clientCaseShowAllByClient", {
      state: {
        client: selectedClient,
      },
    });
  };

  const add2SelectedGenLegalDocForms = (docForm) => {
    console.log("processReturnedDocForm_docForm", docForm);

    // addToResearchDocForms()
    if (
      checkDataExistInResearchDocFormsArray(
        docForm.id,
        selectedGenLegalDocForms
      ) == false
    ) {
      // researchDocForms.push(docForm);
      setSelectedGenLegalDocForms([...selectedGenLegalDocForms, docForm]);
      setShowGenLegalDocFormModal(false);
    } else {
      alert("Already Exist in Array");
    }
  };

  const checkDataExistInResearchDocFormsArray = (docFormId, docFormArray) => {
    if (docFormArray == undefined) {
      return false;
    }
    return docFormArray.some((docFormObj) => {
      return docFormObj.id == docFormId;
    });
  };

  const removeFromResearchDocFormsArray = (docForm) => {
    setSelectedGenLegalDocForms(
      selectedGenLegalDocForms.filter((researchDocForm) => {
        return researchDocForm.id !== docForm.id;
      })
    );
  };

  const concatAllIntoDocFormIds = () => {
    let docFormIds = "";
    selectedGenLegalDocForms.map((researchDocForm) => {
      docFormIds = researchDocForm + "," + researchDocForm.id;
    });
    return docFormIds;
  };

  const concatAllIntoDocFormIdsArray = () => {
    let docFormIdsArray = [];
    selectedGenLegalDocForms.map((researchDocForm) => {
      docFormIdsArray.push(researchDocForm.id);
    });
    return docFormIdsArray;
  };

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className="main_container">
        <div className="page-title mb-2" style={{ paddingLeft: "20px" }}>
          <div className="title_left">
            <h6 className="mt-0">
              <span  >
                You can add a case to an existing client only. If your client is
                not in select client column, add client details first.
              </span>
            </h6>
            <h6
              style={{ color: "blue", cursor: "pointer" }}
              onClick={() => {
                navigate(-1);
                // setCurTab("all");
              }}
            >
              Go Back ⬅️
            </h6>
          </div>
        </div>

        <div className="clearfix"></div>

        <div className="row">
          <div className="col-md-12 col-sm-12  ">
            <div className="x_panel">
              {client != undefined ? (
                <div className="x_title">
                  <h6>
                    {" "}
                    Add New Case for: <b>{client.name}</b>
                  </h6>
                  <div className="clearfix"></div>
                </div>
              ) : null}
              <div className="x_content">
                <CreateClientCase
                  client={client}
                  // onReturn={onClientCaseCreateReturn}
                />

                {/* <Form onSubmit={onSubmitHandler} method="POST">
                    <div className="form-box px-lg-2 px-2">
                      {client != undefined ? (
                        <>{client.name}</>
                      ) : (
                        <>
                          <FormGroup className="mb-3" row>
                            <Label htmlFor="orgClient" sm={2}>
                              Select Client
                            </Label>
                            <Col sm={10}>
                              <ReactSelect
                                options={orgClients}
                                onChange={(selectedOption) => {
                                  console.log(
                                    "handleUsersReactSelectChanges",
                                    selectedOption
                                  );
                                  setSelectedClient(selectedOption);
                                }}
                                // ref={departmentRef}
                                isMulti={false}
                                //   defaultValue={{}}
                              />
                            </Col>
                          </FormGroup>
                        </>
                      )}

                      <FormGroup className="mb-3" row>
                        <Label for="inputCaseType" sm={2}>
                          Case Type *
                        </Label>

                        <Col sm={10}>
                          <Input
                            type="select"
                            className="form-control "
                            id="inputCaseType"
                            aria-describedby="caseTypeHelp"
                            // value={researchTypeId}
                            onChange={(e) => {
                              setSelectedCaseType(Number(e.target.value));
                            }}
                          >
                            <option>-Select-</option>
                            {caseTypes != undefined &&
                              caseTypes.map((caseType) => {
                                return (
                                  <option value={caseType.id}>
                                    {caseType.type}
                                  </option>
                                );
                              })}
                          </Input>
                        </Col>
                      </FormGroup>

                      <FormGroup className="mb-3" row>
                        <Label for="inputtitle" sm={2}>
                          Title *
                        </Label>

                        <Col sm={10}>
                          <Input
                            type="text"
                            className="form-control "
                            id="inputtitle"
                            aria-describedby="titleHelp"
                            innerRef={titleRef}
                            minLength={3}
                            maxLength={64}
                            required
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup className="mb-3" row>
                        <Label for="inputdetails" sm={2}>
                          Details *
                        </Label>

                        <Col sm={10}>
                          <Input
                            type="textarea"
                            className="form-control "
                            id="inputdetails"
                            aria-describedby="detailsHelp"
                            innerRef={detailsRef}
                            minLength={10}
                            maxLength={500}
                            required
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup className="mb-3" row>
                        <Label for="inputDocFormNeeded" sm={2}>
                        Client case information DocForm(s) Needed *
                        </Label>
                        <Col sm={10}>
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
                              <h5>
                                Select docform for Client case information
                              </h5>
                              <ReactSelect
                                options={genLegalDocForms}
                                onChange={(selectedOption) => {
                                  console.log(
                                    "handleUsersReactSelectChanges",
                                    selectedOption
                                  );
                                  add2SelectedGenLegalDocForms(selectedOption);
                                  // //docFormId = selectedOption.id;
                                  // if(props.type==0){
                                  //   setSelectedDocForm(selectedOption);
                                  // }else{
                                  //   props.onReturn(selectedOption);
                                  // }
                                }}
                                // ref={docFormRef}
                                isMulti={false}
                                //   defaultValue={{}}
                              />
                            </div>
                          </Modal>

                          <i
                            className="fa fa-plus mx-2"
                            title="Add"
                            style={{ color: "grey", cursor: "pointer" }}
                            aria-hidden="true"
                            onClick={() => setShowGenLegalDocFormModal(true)}
                          />
                          <br />
                          {selectedGenLegalDocForms != undefined &&
                          selectedGenLegalDocForms.length > 0 ? (
                            <>
                              {selectedGenLegalDocForms.map(
                                (selectedGenLegalDocForm) => {
                                  return (
                                    <p>
                                      {" "}
                                      <i
                                        className="fa fa-close mx-2"
                                        title="Add"
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                        }}
                                        aria-hidden="true"
                                        onClick={() =>
                                          removeFromResearchDocFormsArray(
                                            selectedGenLegalDocForm
                                          )
                                        }
                                      />{" "}
                                      {selectedGenLegalDocForm.nameTitle}
                                    </p>
                                  );
                                }
                              )}
                            </>
                          ) : null}
                        </Col>
                      </FormGroup>

                      <div className="text-start">
                        <Button type="submit" className="btn btn-info">
                          Save & Continue
                        </Button>
                        
                        <Button
                          type="button"
                          className="btn btn-success"
                          onClick={() => onSubmitHandler(null)}
                        >
                          Submit & Exit
                        </Button>
                      </div>
                    </div>
                  </Form> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- /page content --> */}

      {/* <Footer /> */}
      {/* </div> */}
    </Suspense>
  );
};

export default ClientCreate;
