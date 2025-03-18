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
  WsPutClientCaseNew,
  WsGetOrgClientsNew,
} from "../../configs/WebService";
import { apiKeyHeader } from "../../configs/ApiKeys";
import userStore from "../../zustand/userStore";

const CreateClientCase = (props) => {
  let navigate = useNavigate();
  const userData = userStore((state) => state.user);

  console.log("userData_", userData);
  const location = useLocation();
  console.log("_location_", location);
  const client = props.client;

  const [genLegalDocForms, setGenLegalDocForms] = useState();

  const [selectedGenLegalDocForms, setSelectedGenLegalDocForms] = useState([]);
  const [showGenLegalDocFormModal, setShowGenLegalDocFormModal] =
    useState(false);

  const [caseTypes, setCaseTypes] = useState();
  const [orgClients, setOrgClients] = useState();
  const [selectedClient, setSelectedClient] = useState(
    client != undefined ? client : undefined
  );
  const [selectedCaseType, setSelectedCaseType] = useState(0);

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
      if (props?.onReturn == undefined || props?.onReturn == null) {
        getLegalGeneralDocForm();
      }

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
        // WsGetOrgClients
        WsGetOrgClientsNew + "/" + userData.org.id + "/" + userData.id,
        {
          headers: apiKeyHeader(),
        }
      )
      .then((response) => {
        const responseData = response.data;
        console.log("_responseData", responseData);
        if (responseData.resultCode === 1) {
          const newdata = responseData.resultMessage
            .filter((each) => each.isMobileVerify === 1)
            .map((each) => ({
              ...each,
              user: { ...each.user, id: each.id },
            }));

          // responseData.resultMessage.map((each) => {
          //   each.user.id = each.id;
          //   return each;
          // });
          setOrgClients(processOrgClientsMappedData(newdata));
          // setOrgClients(
          //   processOrgClientsMappedData(responseData.resultMessage)
          // );
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
    } else if (selectedCaseType === 0) {
      alert("Select Case Type");
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
      caseType: selectedCaseType !== undefined ? Number(selectedCaseType) : null,
      docformsIds: docformsIdStringArray.length > 0 ? docformsIdStringArray : null,
    };
  
    // Logging the request data for debugging
    console.log("OrgUserLogIn_Params", JSON.stringify(requestData));
  
    try {
      // Fetching the case statistics first
      const response = await fetch(
        `https://web1024.ipguide.net:8443/dm_leorg_new1/userStatistics/${userData.org.id}`,
        { headers: apiKeyHeader() }
      );
      const data = await response.json();

      if (!data.resultMessage) {
        alert("Invalid API response. Please try again.");
        return;
      }

      const { max_cases, case_cases_total } = data.resultMessage[0] ?? {};

      // if (typeof max_cases !== "number" || typeof case_cases_total !== "number") {
      //   alert("Invalid response values. Please contact support.");
      //   return;
      // }

      // Check if the number of cases is within the limit
      // if (max_cases !== 0 &&  case_cases_total >= max_cases) {
      //   alert("You have reached the maximum case limit. Extend your plan.");
      //   return;
      // }

      console.log(
        "Proceeding with case creation:",
        max_cases,
        case_cases_total
      );

      // Proceeding with the case creation
      axios
        .post(WsPutClientCaseNew, JSON.stringify(requestData), {
          headers: apiKeyHeader(),
        })
        .then((response) => {
          const responseData = response.data;
          console.log("_responseData", responseData);

          if (responseData.resultCode >= 1) {
            if (props.onReturn) {
              props.onReturn(responseData.resultMessage);
            } else {
              if (toContinue) {
                goToClientCase(responseData.resultMessage);
              } else {
                navigate("/clientcaseinformation?2");
                window.location.reload();
              }
            }
          } else {
            alert(responseData.resultMessage);
            setErrorMsg(responseData.resultMessage);
          }
        })
        .catch((error) => {
          console.error("Error while processing:", error);
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
    <Form onSubmit={onSubmitHandler} method="POST">
      <div className="form-box px-lg-2 px-2">
        {client != undefined ? (
          <>{/* {client.name} */}</>
        ) : (
          <>
            <FormGroup className="mb-3" row>
              <Label htmlFor="orgClient" sm={2}>
                Select Client *
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
                  return <option value={caseType.id}>{caseType.type}</option>;
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

        {/* {props?.onReturn == undefined || props?.onReturn == null ? (
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
                  <h5>Select docform for Client case information</h5>
                  <ReactSelect
                    options={genLegalDocForms}
                    onChange={(selectedOption) => {
                      console.log(
                        "handleUsersReactSelectChanges",
                        selectedOption
                      );
                      add2SelectedGenLegalDocForms(selectedOption);
                    }}
                    isMulti={false}
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
                  {selectedGenLegalDocForms.map((selectedGenLegalDocForm) => {
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
                  })}
                </>
              ) : null}
            </Col>
          </FormGroup>
        ) : null} */}

        <div
          // className="text-start"
          className="text-end"
        >
          {/* <Button type="submit" className="btn btn-info"> */}
          {/* <span style={{ fontSize: "14px", color: "blue", cursor: "pointer" }}> */}
          <button
            className="btn btn-sm btn-primary ms-2 my-1 me-0"
            style={{
              fontSize: "14px",

              cursor: "pointer",
              textDecoration: "none",
            }}
            type="submit"
            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            onClick={onSubmitHandler}
          >
            Save & Continue (To complete case related documents)
          </button>
          {/* </Button> */}

          {props?.onReturn == undefined || props?.onReturn == null ? (
            // <Button
            //   type="button"
            //   className="btn btn-info"
            //   onClick={() => onSubmitHandler(null)}
            // >
            <button
              className="btn btn-sm btn-primary ms-2 my-1 me-0"
              style={{
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "none",
              }}
              // type="button"

              onMouseEnter={(e) =>
                (e.target.style.textDecoration = "underline")
              }
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
              onClick={() => onSubmitHandler(null)}
            >
              Save & Exit (Without completing any case related documents)
            </button>
          ) : // </Button>
          null}
          {/* <Button type="submit" className="btn btn-info">
            Save & Continue
          </Button>

          {props?.onReturn == undefined || props?.onReturn == null ? (
            <Button
              type="button"
              className="btn btn-info"
              onClick={() => onSubmitHandler(null)}
            >
              Save & Exit
            </Button>
          ) : null} */}
        </div>
      </div>
    </Form>
  );
};

export default CreateClientCase;
